package com.ruoyi.quartz.task;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.ruoyi.bussiness.domain.TMineOrder;
import com.ruoyi.bussiness.domain.TMineOrderDay;
import com.ruoyi.bussiness.domain.setting.FinancialSettlementSetting;
import com.ruoyi.bussiness.domain.setting.Setting;
import com.ruoyi.bussiness.service.*;
import com.ruoyi.common.enums.CommonEnum;
import com.ruoyi.common.enums.SettingEnum;
import com.ruoyi.quartz.domain.SysJob;
import com.ruoyi.quartz.service.ISysJobService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;

/**
 * 理财任务测试类 - 用于验证每日结算功能
 * 可以直接通过管理后台的任务调度页面执行此任务进行测试
 */
@Component("mineFinancialTaskTest")
@Slf4j
public class MineFinancialTaskTest {

    @Autowired
    private SettingService settingService;
    
    @Autowired
    private ITMineOrderService orderService;
    
    @Autowired
    private ITMineOrderDayService mineOrderDayService;
    
    @Autowired
    private MineFinancialTask mineFinancialTask;
    
    @Autowired
    private ISysJobService sysJobService;

    /**
     * 测试每日结算功能
     * 此方法可以在管理后台手动执行，用于验证结算逻辑是否正常工作
     */
    public void testFinancialSettlement() {
        try {
            log.info("===== 开始测试理财订单结算功能 =====");
            
            // 1. 检查系统配置
            Setting setting = settingService.get(SettingEnum.FINANCIAL_SETTLEMENT_SETTING.name());
            if (setting == null) {
                log.error("未找到结算设置配置(FINANCIAL_SETTLEMENT_SETTING)");
                return;
            }
            
            FinancialSettlementSetting settlementSetting = JSONUtil.toBean(setting.getSettingValue(), FinancialSettlementSetting.class);
            log.info("当前结算类型: {}, 结算类型名称: {}", 
                settlementSetting.getSettlementType(), getSettlementTypeName(settlementSetting.getSettlementType()));
            
            // 2. 检查待结算订单
            List<TMineOrder> pendingOrders = orderService.list(
                new LambdaQueryWrapper<TMineOrder>()
                    .eq(TMineOrder::getStatus, 0L)
                    .eq(TMineOrder::getType, 0L)
            );
            log.info("当前有待结算订单数量: {}", pendingOrders.size());
            
            // 3. 检查定时任务配置
            checkJobConfiguration();
            
            // 4. 执行结算测试
            if (Objects.equals(CommonEnum.TWO.getCode(), settlementSetting.getSettlementType())) {
                log.info("当前设置为每日结算，开始执行结算测试");
                
                // 记录执行前的结算记录数量
                long beforeCount = mineOrderDayService.count();
                log.info("执行前的结算记录总数: {}", beforeCount);
                
                // 调用原始的定时任务方法进行测试
                mineFinancialTask.mineFinancialTask();
                
                // 记录执行后的结算记录数量
                long afterCount = mineOrderDayService.count();
                log.info("执行后的结算记录总数: {}, 新增记录数: {}", afterCount, afterCount - beforeCount);
                
                log.info("理财订单结算测试完成");
            } else {
                log.warn("当前结算类型不是日结，无法执行日结测试。当前类型: {}", settlementSetting.getSettlementType());
                log.info("提示: 请在管理后台将结算类型设置为 2 (日结) 以启用每日结算功能");
            }
            
            // 5. 检查最近的结算记录
            List<TMineOrderDay> recentRecords = mineOrderDayService.list(
                new LambdaQueryWrapper<TMineOrderDay>()
                    .orderByDesc(TMineOrderDay::getCreateTime)
                    .last("LIMIT 5")
            );
            
            if (!CollectionUtils.isEmpty(recentRecords)) {
                log.info("最近5条结算记录:");
                for (TMineOrderDay record : recentRecords) {
                    log.info("记录ID: {}, 订单号: {}, 状态: {}, 收益: {}, 创建时间: {}",
                        record.getId(), record.getOrderNo(), record.getStatus(), 
                        record.getEarn(), record.getCreateTime());
                }
            }
            
        } catch (Exception e) {
            log.error("测试理财结算失败", e);
        } finally {
            log.info("===== 理财订单结算测试结束 =====");
        }
    }
    
    /**
     * 检查待结算订单数量和详情
     */
    public void checkPendingOrders() {
        try {
            log.info("===== 开始检查待结算订单 =====");
            
            // 查询状态为0(待结算)且类型为0的订单
            List<TMineOrder> pendingOrders = orderService.list(
                new LambdaQueryWrapper<TMineOrder>()
                    .eq(TMineOrder::getStatus, 0L)
                    .eq(TMineOrder::getType, 0L)
            );
            
            if (CollectionUtils.isEmpty(pendingOrders)) {
                log.info("当前没有待结算的订单");
            } else {
                log.info("当前有待结算订单数量: {}", pendingOrders.size());
                // 输出前10个订单的详细信息
                int showCount = Math.min(10, pendingOrders.size());
                for (int i = 0; i < showCount; i++) {
                    TMineOrder order = pendingOrders.get(i);
                    log.info("订单详情: ID={}, 订单号={}, 用户ID={}, 金额={}, 最小利率={}, 最大利率={}", 
                        order.getId(), order.getOrderNo(), order.getUserId(), 
                        order.getAmount(), order.getMinOdds(), order.getMaxOdds());
                }
                
                // 检查是否有今天的结算记录
                List<TMineOrderDay> todayRecords = mineOrderDayService.list(
                    new LambdaQueryWrapper<TMineOrderDay>()
                        .ge(TMineOrderDay::getCreateTime, getTodayStart())
                        .eq(TMineOrderDay::getStatus, CommonEnum.TWO.getCode()) // 已结算状态
                );
                log.info("今日已结算记录数量: {}", todayRecords.size());
            }
            
        } catch (Exception e) {
            log.error("检查待结算订单失败", e);
        } finally {
            log.info("===== 待结算订单检查结束 =====");
        }
    }
    
    /**
     * 检查定时任务配置
     */
    public void checkJobConfiguration() {
        try {
            log.info("===== 开始检查定时任务配置 =====");
            
            // 查询mineFinancialTask相关的定时任务
            List<SysJob> jobs = sysJobService.selectJobList(new SysJob() {
                {
                    setInvokeTarget("mineFinancialTask.mineFinancialTask");
                }
            });
            
            if (CollectionUtils.isEmpty(jobs)) {
                log.error("未找到mineFinancialTask相关的定时任务配置！");
                log.info("请在管理后台的定时任务管理页面添加该任务，设置为每日执行");
            } else {
                log.info("找到mineFinancialTask相关的定时任务数量: {}", jobs.size());
                for (SysJob job : jobs) {
                    log.info("任务信息: 任务ID={}, 任务名称={}, 任务组={}, 调用目标={}, Cron表达式={}, 状态={}",
                        job.getJobId(), job.getJobName(), job.getJobGroup(),
                        job.getInvokeTarget(), job.getCronExpression(), job.getStatus());
                    
                    // 验证Cron表达式是否为每日执行
                    if (job.getCronExpression() != null) {
                        boolean isDaily = isDailyCronExpression(job.getCronExpression());
                        log.info("任务是否设置为每日执行: {}", isDaily);
                        if (!isDaily) {
                            log.warn("建议的每日执行Cron表达式: 0 0 0 * * ? (每天凌晨0点执行)");
                        }
                    }
                    
                    // 检查任务状态
                    if (!"0".equals(job.getStatus())) {
                        log.warn("警告: 任务当前未启用，状态: {}", job.getStatus());
                        log.info("请在管理后台启用该任务");
                    }
                }
            }
            
        } catch (Exception e) {
            log.error("检查定时任务配置失败", e);
        } finally {
            log.info("===== 定时任务配置检查结束 =====");
        }
    }
    
    /**
     * 立即执行单个订单的结算测试
     */
    public void testSingleOrderSettlement() {
        try {
            log.info("===== 开始测试单个订单结算 =====");
            
            // 查找第一个待结算订单
            TMineOrder order = orderService.getOne(
                new LambdaQueryWrapper<TMineOrder>()
                    .eq(TMineOrder::getStatus, 0L)
                    .eq(TMineOrder::getType, 0L)
                    .last("LIMIT 1")
            );
            
            if (order == null) {
                log.info("没有找到待结算的订单");
                return;
            }
            
            log.info("找到测试订单: ID={}, 订单号={}, 用户ID={}, 金额={}",
                order.getId(), order.getOrderNo(), order.getUserId(), order.getAmount());
            
            // 获取结算设置
            Setting setting = settingService.get(SettingEnum.FINANCIAL_SETTLEMENT_SETTING.name());
            FinancialSettlementSetting settlementSetting = JSONUtil.toBean(setting.getSettingValue(), FinancialSettlementSetting.class);
            
            // 手动调用结算方法
            log.info("开始手动执行结算");
            // 通过反射调用私有方法进行测试
            java.lang.reflect.Method method = MineFinancialTask.class.getDeclaredMethod("settlement", TMineOrder.class, FinancialSettlementSetting.class);
            method.setAccessible(true);
            method.invoke(mineFinancialTask, order, settlementSetting);
            
            log.info("单个订单结算测试完成");
            
        } catch (Exception e) {
            log.error("测试单个订单结算失败", e);
        } finally {
            log.info("===== 单个订单结算测试结束 =====");
        }
    }
    
    // 辅助方法
    private String getSettlementTypeName(Integer type) {
        switch (type) {
            case 1: return "指定日期结算";
            case 2: return "每日结算";
            case 3: return "产品到期结算";
            default: return "未知类型";
        }
    }
    
    private boolean isDailyCronExpression(String cronExpression) {
        // 简单检查是否符合每日执行的Cron表达式格式
        return cronExpression.matches("^\\d+\\s+\\d+\\s+\\d+\\s+\\*\\s+\\*\\s+.+$");
    }
    
    private Date getTodayStart() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }
}