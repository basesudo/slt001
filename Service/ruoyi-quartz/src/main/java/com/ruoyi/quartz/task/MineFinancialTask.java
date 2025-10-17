package com.ruoyi.quartz.task;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ruoyi.bussiness.domain.*;
import com.ruoyi.bussiness.domain.setting.FinancialSettlementSetting;
import com.ruoyi.bussiness.domain.setting.Setting;
import com.ruoyi.bussiness.mapper.TMineFinancialMapper;
import com.ruoyi.bussiness.service.*;
import com.ruoyi.common.core.redis.RedisCache;
import com.ruoyi.common.enums.*;
import com.ruoyi.common.utils.DateUtil;
import com.ruoyi.common.utils.DateUtils;
import java.util.Objects;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Component("mineFinancialTask")
@Slf4j
public class MineFinancialTask {


    @Resource
    private SettingService settingService;
    @Resource
    private TMineFinancialMapper tMineFinancialMapper;
    @Resource
    private ITAppUserService appUserService;
    @Resource
    private RedisCache redisCache;
    @Resource
    private ITAppAssetService tAppAssetService;
    @Resource
    private ITMineOrderService orderService;
    @Resource
    private ITMineUserService mineUserService;
    @Resource
    private ITAppWalletRecordService walletRecordService;
    @Resource
    private ITMineOrderDayService mineOrderDayService;


    /**
     * 到期结算 每日结算 指定收益入库
     * 定时任务主方法 - 负责处理所有待结算的理财订单
     */
    public void mineFinancialTask() {
        log.info("===== 开始执行mineFinancialTask定时任务 =====");
        long startTime = System.currentTimeMillis();
        int successCount = 0;
        int failCount = 0;
        
        try {
            // 1. 获取结算设置
            log.info("1. 获取系统结算配置");
            Setting setting = settingService.get(SettingEnum.FINANCIAL_SETTLEMENT_SETTING.name());
            if (setting == null) {
                log.error("未找到结算设置配置(FINANCIAL_SETTLEMENT_SETTING)，定时任务终止");
                return;
            }
            
            FinancialSettlementSetting settlementSetting = JSONUtil.toBean(setting.getSettingValue(), FinancialSettlementSetting.class);
            log.info("当前结算类型: {}, 结算类型名称: {}", 
                settlementSetting.getSettlementType(), getSettlementTypeName(settlementSetting.getSettlementType()));
            
            // 2. 查询待结算订单
            log.info("2. 查询今日待结算订单");
            List<TMineOrder> pendingOrders = orderService.list(
                new LambdaQueryWrapper<TMineOrder>()
                    .eq(TMineOrder::getStatus, 0L)  // 0: 待结算状态
                    .eq(TMineOrder::getType, 0L)    // 0: 日结算类型订单
            );
            
            log.info("待结算订单数量: {}", pendingOrders.size());
            
            if (CollectionUtils.isEmpty(pendingOrders)) {
                log.info("没有待结算的订单，定时任务结束");
                return;
            }
            
            // 3. 逐个处理订单
            log.info("3. 开始处理待结算订单");
            for (TMineOrder order : pendingOrders) {
                try {
                    log.info("开始处理订单: 订单ID={}, 订单号={}, 用户ID={}, 金额={}", 
                        order.getId(), order.getOrderNo(), order.getUserId(), order.getAmount());
                    
                    // 执行结算操作
                    settlement(order, settlementSetting);
                    successCount++;
                    log.info("订单处理成功: 订单ID={}, 订单号={}", order.getId(), order.getOrderNo());
                    
                } catch (Exception e) {
                    failCount++;
                    log.error("订单处理失败: 订单ID={}, 订单号={}", order.getId(), order.getOrderNo(), e);
                    // 继续处理下一个订单，不中断整体流程
                }
            }
            
            // 4. 执行指定日期结算检查
            log.info("4. 执行指定日期结算检查");
            specifiedDateSettlement();
            
        } catch (Exception e) {
            log.error("执行mineFinancialTask定时任务异常", e);
        } finally {
            long endTime = System.currentTimeMillis();
            log.info("===== mineFinancialTask定时任务执行结束 =====");
            log.info("执行统计: 总订单数={}, 成功={}, 失败={}, 耗时={}毫秒", 
                successCount + failCount, successCount, failCount, (endTime - startTime));
        }
    }

    /**
     * 结算单个订单
     * 处理不同类型的结算逻辑：日结、指定日期结算、产品到期结算
     */
    private void settlement(TMineOrder order, FinancialSettlementSetting setting) {
        log.info("===== 开始结算订单: 订单ID={}, 订单号={}, 结算类型={} =====", 
            order.getId(), order.getOrderNo(), setting.getSettlementType());
            
        // 参数校验 - 确保所有必要参数有效
        if (order == null) {
            log.error("结算失败: 订单对象为空");
            throw new IllegalArgumentException("订单对象不能为空");
        }
        if (setting == null) {
            log.error("结算失败: 结算设置为空");
            throw new IllegalArgumentException("结算设置不能为空");
        }
        
        try {
            // 1. 验证用户信息
            TAppUser appUser = appUserService.getById(order.getUserId());
            if (appUser == null) {
                log.error("结算失败: 用户不存在, userId:{}", order.getUserId());
                throw new RuntimeException("用户不存在: " + order.getUserId());
            }
            log.info("用户验证成功: 用户ID={}", order.getUserId());
            
            // 2. 验证订单金额
            BigDecimal amount = order.getAmount();
            if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
                log.error("结算失败: 订单金额无效: {}", amount);
                throw new RuntimeException("订单金额无效: " + amount);
            }
            log.info("订单金额验证成功: {}", amount);
            
            // 3. 获取用户资产
            TAppAsset asset = tAppAssetService.getAssetByUserIdAndType(order.getUserId(), AssetEnum.FINANCIAL_ASSETS.getCode());
            if (asset == null) {
                log.error("结算失败: 用户资产不存在, userId:{}", order.getUserId());
                throw new RuntimeException("用户资产不存在: " + order.getUserId());
            }
            log.info("用户资产获取成功: 可用余额={}", asset.getAvailableAmount());
            
            // 4. 获取利率 (基于订单配置的最小和最大利率范围)
            BigDecimal dayRatio = getRatio(order.getMinOdds(), order.getMaxOdds());
            if (dayRatio == null || dayRatio.compareTo(BigDecimal.ZERO) <= 0) {
                log.error("结算失败: 计算的日利率错误或为零: {}", dayRatio);
                throw new RuntimeException("计算的日利率错误: " + dayRatio);
            }
            log.info("利率计算成功: {}%", dayRatio);
            
            // 5. 计算日收益
            BigDecimal earn = amount.multiply(dayRatio).divide(new BigDecimal(100)).setScale(6, RoundingMode.UP);
            if (earn.compareTo(BigDecimal.ZERO) <= 0) {
                log.error("结算失败: 计算收益为零或负数: {}", earn);
                throw new RuntimeException("计算收益无效: " + earn);
            }
            log.info("收益计算成功: 订单号={}, 金额={}, 日利率={}%, 日收益={}", 
                order.getOrderNo(), amount, dayRatio, earn);
            
            // 6. 查找或创建结算记录
            TMineOrderDay mineOrderDay = mineOrderDayService.getOne(
                new LambdaQueryWrapper<TMineOrderDay>()
                    .eq(TMineOrderDay::getStatus, 1) // 1: 待结算状态
                    .eq(TMineOrderDay::getOrderNo, order.getOrderNo())
            );
            
            if (mineOrderDay != null) {
                // 已有结算记录，累加收益
                log.info("找到已有结算记录，累计收益: {}", mineOrderDay.getEarn());
                mineOrderDay.setEarn(mineOrderDay.getEarn().add(earn));
                mineOrderDay.setOdds(dayRatio); // 更新为最新利率
            } else {
                // 创建新的结算记录
                log.info("创建新的结算记录");
                mineOrderDay = new TMineOrderDay();
                mineOrderDay.setAddress(order.getAdress());
                mineOrderDay.setOdds(dayRatio);
                mineOrderDay.setOrderNo(order.getOrderNo());
                mineOrderDay.setEarn(earn);
                mineOrderDay.setPlanId(order.getPlanId());
                mineOrderDay.setAmount(amount);
                mineOrderDay.setCreateTime(new Date());
                mineOrderDay.setType(0L); // 0: 日结算类型
            }

            // 7. 根据结算类型执行不同的结算逻辑
            // 7.1 指定日期结算 (类型1)
            if (Objects.equals(CommonEnum.ONE.getCode(), setting.getSettlementType())) {
                log.info("执行指定日期结算(类型1)");
                mineOrderDay.setStatus(CommonEnum.ONE.getCode()); // 1: 待结算状态
                mineOrderDayService.saveOrUpdate(mineOrderDay);
                log.info("指定日期结算处理完成, 订单号:{}, 收益暂存: {}", order.getOrderNo(), mineOrderDay.getEarn());
            }
            
            // 7.2 日结 (类型2)
            else if (Objects.equals(CommonEnum.TWO.getCode(), setting.getSettlementType())) {
                log.info("执行日结处理(类型2)");
                
                // 记录更新前的可用金额
                BigDecimal availableAmountBefore = asset.getAvailableAmount();
                
                // 更新资产 - 增加收益
                asset.setAmout(asset.getAmout().add(earn));
                asset.setAvailableAmount(asset.getAvailableAmount().add(earn));
                mineOrderDay.setStatus(CommonEnum.TWO.getCode()); // 2: 已结算状态
                
                // 保存资产更新
                tAppAssetService.updateTAppAsset(asset);
                log.info("资产更新成功: userId={}, 增加收益={}, 更新后可用余额={}", 
                    order.getUserId(), earn, asset.getAvailableAmount());
                
                // 保存结算记录
                boolean recordSaved = mineOrderDayService.saveOrUpdate(mineOrderDay);
                if (!recordSaved) {
                    log.error("结算记录保存失败, 订单号:{}", order.getOrderNo());
                    throw new RuntimeException("结算记录保存失败: " + order.getOrderNo());
                }
                log.info("结算记录保存成功: 订单号={}, 累计收益={}", 
                    order.getOrderNo(), mineOrderDay.getEarn());
                
                // 生成钱包记录
                walletRecordService.generateRecord(
                    order.getUserId(), 
                    earn, 
                    RecordEnum.FINANCIAL_SETTLEMENT.getCode(), 
                    "", 
                    order.getOrderNo(), 
                    RecordEnum.FINANCIAL_SETTLEMENT.getInfo(), 
                    availableAmountBefore, 
                    asset.getAvailableAmount(), 
                    asset.getSymbol(), 
                    appUser.getAdminParentIds()
                );
                log.info("钱包记录生成: 订单号:{}, 金额:{}", order.getOrderNo(), earn);
            }
            
            // 7.3 产品到期结算 (类型3)
            else if (Objects.equals(CommonEnum.THREE.getCode(), setting.getSettlementType())) {
                log.info("执行产品到期结算(类型3)");
                
                boolean isExpired = order.getEndTime() != null && DateUtil.daysBetween(order.getEndTime(), new Date()) == 0;
                if (isExpired) {
                    // 产品已到期，执行结算
                    log.info("产品已到期，执行结算: 订单号={}, 到期时间={}", 
                        order.getOrderNo(), order.getEndTime());
                    
                    mineOrderDay.setStatus(CommonEnum.TWO.getCode()); // 2: 已结算状态
                    boolean recordSaved = mineOrderDayService.saveOrUpdate(mineOrderDay);
                    if (!recordSaved) {
                        log.error("结算记录保存失败, 订单号:{}", order.getOrderNo());
                        throw new RuntimeException("结算记录保存失败: " + order.getOrderNo());
                    }
                    
                    // 结算总收益
                    BigDecimal totalEarn = mineOrderDay.getEarn();
                    BigDecimal availableAmountBefore = asset.getAvailableAmount();
                    
                    // 更新资产
                    asset.setAmout(asset.getAmout().add(totalEarn));
                    asset.setAvailableAmount(asset.getAvailableAmount().add(totalEarn));
                    
                    tAppAssetService.updateTAppAsset(asset);
                    
                    // 生成钱包记录
                    walletRecordService.generateRecord(
                        order.getUserId(), 
                        totalEarn, 
                        RecordEnum.FINANCIAL_SETTLEMENT.getCode(), 
                        "", 
                        order.getOrderNo(), 
                        RecordEnum.FINANCIAL_SETTLEMENT.getInfo(), 
                        availableAmountBefore, 
                        asset.getAvailableAmount(), 
                        asset.getSymbol(), 
                        appUser.getAdminParentIds()
                    );
                    
                    log.info("产品到期结算完成: 订单号={}, 结算收益={}", order.getOrderNo(), totalEarn);
                } else {
                    // 产品未到期，暂存收益
                    mineOrderDay.setStatus(CommonEnum.ONE.getCode()); // 1: 待结算状态
                    mineOrderDayService.saveOrUpdate(mineOrderDay);
                    log.info("产品未到期, 暂存收益: 订单号={}, 累计收益={}", 
                        order.getOrderNo(), mineOrderDay.getEarn());
                }
            } else {
                log.error("未知的结算类型: {}", setting.getSettlementType());
                throw new RuntimeException("未知的结算类型: " + setting.getSettlementType());
            }
            
            // 8. 更新订单累计收益和状态
            order.setAccumulaEarn(mineOrderDay.getEarn());
            
            // 检查是否产品到期
            boolean isOrderExpired = order.getEndTime() != null && DateUtil.daysBetween(order.getEndTime(), new Date()) == 0;
            if (isOrderExpired) {
                order.setStatus(1L); // 1: 已结算状态
                log.info("订单到期, 更新状态为已结算: 订单号={}, 到期时间={}", 
                    order.getOrderNo(), order.getEndTime());
            }
            
            // 更新订单信息
            int updateResult = orderService.updateTMineOrder(order);
            if (updateResult <= 0) {
                log.error("订单信息更新失败: 订单号={}", order.getOrderNo());
                throw new RuntimeException("订单信息更新失败: " + order.getOrderNo());
            }
            log.info("订单信息更新成功: 订单号={}, 累计收益={}, 状态={}", 
                order.getOrderNo(), order.getAccumulaEarn(), order.getStatus());
            
            log.info("===== 订单结算完成: 订单ID={}, 订单号={} =====", order.getId(), order.getOrderNo());
            
        } catch (Exception e) {
            log.error("理财订单结算失败: 订单ID={}, 订单号={}", order.getId(), order.getOrderNo(), e);
            // 重新抛出异常以便上层捕获并记录失败
            throw new RuntimeException("结算失败: " + e.getMessage(), e);
        }
    }


    /**
     * 获取订单的利率
     * 根据订单配置的最小和最大利率范围生成随机利率
     */
    private BigDecimal getRatio(BigDecimal minOdds, BigDecimal maxOdds) {
        try {
            log.info("计算订单利率: 最小利率={}, 最大利率={}", minOdds, maxOdds);
            
            // 参数验证
            if (minOdds == null || maxOdds == null) {
                log.error("利率参数错误: minOdds={}, maxOdds={}", minOdds, maxOdds);
                throw new IllegalArgumentException("利率参数错误");
            }
            
            if (minOdds.compareTo(BigDecimal.ZERO) < 0) {
                log.warn("最小利率为负数，使用0: {}", minOdds);
                minOdds = BigDecimal.ZERO;
            }
            
            if (maxOdds.compareTo(minOdds) < 0) {
                log.warn("最大利率小于最小利率，交换值: max={}, min={}", maxOdds, minOdds);
                BigDecimal temp = minOdds;
                minOdds = maxOdds;
                maxOdds = temp;
            }
            
            // 生成随机利率
            BigDecimal rate = queryHongBao(minOdds.doubleValue(), maxOdds.doubleValue());
            log.info("生成的随机利率: {}%", rate);
            return rate;
        } catch (Exception e) {
            log.error("获取订单利率失败", e);
            // 返回默认利率，避免结算失败
            return new BigDecimal("0.015"); // 默认0.015%
        }
    }

    /**
     * 生成随机利率
     * 在指定的最小和最大范围之间生成随机值
     */
    private static BigDecimal queryHongBao(double min, double max) {
        try {
            Random rand = new Random();
            double result = min + (rand.nextDouble() * (max - min));
            BigDecimal rate = new BigDecimal(result).setScale(4, RoundingMode.UP);
            log.debug("生成随机利率: 范围[{},{}], 结果={}%", min, max, rate);
            return rate;
        } catch (Exception e) {
            log.error("计算随机利率失败", e);
            return new BigDecimal("0.015"); // 默认0.015%
        }
    }
    
    /**
     * 获取结算类型名称
     * 辅助方法，用于日志显示
     */
    private String getSettlementTypeName(Integer type) {
        switch (type) {
            case 1: return "指定日期结算";
            case 2: return "每日结算";
            case 3: return "产品到期结算";
            default: return "未知类型(" + type + ")";
        }
    }

    /**
     * 指定日期结算
     */
    public void  specifiedDateSettlement(){
        //查看系统配置  获取结算方式
        Setting setting = settingService.get(SettingEnum.FINANCIAL_SETTLEMENT_SETTING.name());
        FinancialSettlementSetting settlementSetting = JSONUtil.toBean(setting.getSettingValue(), FinancialSettlementSetting.class);
        if(CommonEnum.ONE.getCode().equals(settlementSetting.getSettlementType())){
            // 查找未结算的收益
            List<TMineOrderDay> list = mineOrderDayService.list(new LambdaQueryWrapper<TMineOrderDay>().eq(TMineOrderDay::getStatus, CommonEnum.ONE.getCode()));
            if(CollectionUtils.isEmpty(list)){
                return;
            }
            for (TMineOrderDay mineOrderDay : list) {
                String orderNo = mineOrderDay.getOrderNo();
                //查找订单
                TMineOrder order = orderService.getOne(new LambdaQueryWrapper<TMineOrder>().eq(TMineOrder::getOrderNo, orderNo));
                TAppUser appUser = appUserService.getById(order.getUserId());
                if(CommonEnum.ONE.getCode().equals(order.getStatus().intValue())){
                    TAppAsset asset = tAppAssetService.getAssetByUserIdAndType(order.getUserId(), AssetEnum.FINANCIAL_ASSETS.getCode());
                    mineOrderDay.setStatus(CommonEnum.TWO.getCode());
                    mineOrderDayService.saveOrUpdate(mineOrderDay);
                    BigDecimal earn = mineOrderDay.getEarn();
                    BigDecimal availableAmount = asset.getAvailableAmount();
                    asset.setAmout(asset.getAmout().add(earn));
                    asset.setAvailableAmount(asset.getAvailableAmount().add(earn));
                    tAppAssetService.updateTAppAsset(asset);
                    walletRecordService.generateRecord(order.getUserId(), earn, RecordEnum.FINANCIAL_SETTLEMENT.getCode(),"",order.getOrderNo(),RecordEnum.FINANCIAL_SETTLEMENT.getInfo(),availableAmount,asset.getAvailableAmount(),asset.getSymbol(),appUser.getAdminParentIds());
                    //返利
                    //itActivityMineService.caseBackToFather(wallet.getUserId(), m.getAccumulaEarn(), wallet.getUserName(), orderNo);
                }
            }
        }

    }
}
