package com.ruoyi.socket.service.impl;

import cn.hutool.http.HttpRequest;
import com.alibaba.fastjson2.JSONArray;
import com.alibaba.fastjson2.JSONObject;
import com.ruoyi.bussiness.domain.TContractCoin;
import com.ruoyi.bussiness.domain.TCurrencySymbol;
import com.ruoyi.bussiness.domain.TSecondCoinConfig;
import com.ruoyi.bussiness.service.ITContractCoinService;
import com.ruoyi.bussiness.service.ITCurrencySymbolService;
import com.ruoyi.bussiness.service.ITSecondCoinConfigService;
import com.ruoyi.bussiness.service.ITSymbolManageService;
import com.ruoyi.common.core.domain.entity.SysDictData;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.common.utils.uuid.UUID;
import com.ruoyi.socket.manager.WebSocketUserManager;
import com.ruoyi.system.service.ISysDictTypeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.net.SocketTimeoutException;
import java.net.URISyntaxException;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;


@Slf4j
@Component
public class MarketThreadMt5 {


    @Resource
    private ITSecondCoinConfigService secondCoinConfigService;
    @Resource
    private ITContractCoinService contractCoinService;
    @Resource
    private ITCurrencySymbolService tCurrencySymbolService;
    @Resource
    private ITSymbolManageService tSymbolManageService;

    @Resource
    private WebSocketUserManager webSocketUserManager;
    @Resource
    private ISysDictTypeService sysDictTypeService;

    @Async
    @Scheduled(cron = "*/15 * * * * ?")
    public void marketThreadRun() throws URISyntaxException, SocketTimeoutException {
        LocalDate today = LocalDate.now();
        DayOfWeek dayOfWeek = today.getDayOfWeek();
        Set<String> strings = new HashSet<>();
        //秒合约
        TSecondCoinConfig tSecondCoinConfig = new TSecondCoinConfig();
        tSecondCoinConfig.setMarket("mt5");
        tSecondCoinConfig.setStatus(1L);
        List<TSecondCoinConfig> tSecondCoinConfigs = secondCoinConfigService.selectTSecondCoinConfigList(tSecondCoinConfig);
        for (TSecondCoinConfig secondCoinConfig : tSecondCoinConfigs) {
            strings.add(secondCoinConfig.getSymbol().toUpperCase());
        }
        //U本位
        TContractCoin tContractCoin = new TContractCoin();
        tContractCoin.setEnable(0L);
        tContractCoin.setMarket("mt5");
        List<TContractCoin> tContractCoins = contractCoinService.selectTContractCoinList(tContractCoin);
        for (TContractCoin contractCoin : tContractCoins) {
            strings.add(contractCoin.getSymbol().toUpperCase());
        }
        //币币
        TCurrencySymbol tCurrencySymbol = new TCurrencySymbol();
        tCurrencySymbol.setEnable("1");
        tCurrencySymbol.setMarket("mt5");
        List<TCurrencySymbol> tCurrencySymbols = tCurrencySymbolService.selectTCurrencySymbolList(tCurrencySymbol);
        for (TCurrencySymbol currencySymbol : tCurrencySymbols) {
            strings.add(currencySymbol.getSymbol().toUpperCase());
        }

        //字典银行卡绑定币种
        List<SysDictData> backCoinList = sysDictTypeService.selectDictDataByType("t_bank_coin");
        if (!CollectionUtils.isEmpty(backCoinList)) {
            for (SysDictData sysDictData : backCoinList) {
                if ("USD".equalsIgnoreCase(sysDictData.getDictValue())) continue;
                strings.add(sysDictData.getDictValue().toUpperCase() + "USD");
                strings.add("USD" + sysDictData.getDictValue().toUpperCase());
            }
        }
        //兑换
        for (String string : strings) {

            Thread thread = new Thread(new Runnable() {
                @Override
                public void run() {
                    String token = "60594744d6d6218f7872792126e9716b-c-app";//alltick token
                    String code = string;
                    try {
                        HashMap<String, List<String>> data = getTickData(token, code);
                        if (null != data && data.containsKey("t")) {
                            String result = JSONObject.toJSONString(data);
                            webSocketUserManager.mt5KlineSendMeg(result, string);
                            webSocketUserManager.mt5DETAILSendMeg(result, string);
                        }
                    } catch (Exception e) {
                        log.error("456{}", e.getMessage());
                    }

                }
            });
            thread.start();
        }
    }

    /**
     * 各种开发对接 @xxccmake
     * https://t.me/xxccmake
     */
    private static HashMap<String, List<String>> getTickData(String token, String code) {
        String trace = UUID.randomUUID().toString();
        String query = "{\"trace\" : \"" + trace + "\",\"data\" : {\"code\" : \"" + code + "\",\"kline_type\" : 1,\"kline_timestamp_end\" : 0,\"query_kline_num\" : 1,\"adjust_type\": 0}}";
        String url = String.format("https://quote.tradeswitcher.com/quote-b-api/kline?token=%s&query=%s", token, query);
        String result = HttpRequest.get(url)
                .header("Accept", "application/json, text/javascript, */*; q=0.01")
                .header("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:130.0) Gecko/20100101 Firefox/130.0")
                .timeout(5000)
                .execute().body();

//        System.out.println(result);

        HashMap<String, List<String>> map = new HashMap<>();

        if (StringUtils.isNotEmpty(result) && result.contains("kline_list")) {
            JSONObject resultObject = JSONObject.parseObject(result);
            if (!resultObject.get("ret").toString().equals("200")) {
                return null;
            }

            JSONObject data = resultObject.getJSONObject("data");
            JSONArray kline_list = data.getJSONArray("kline_list");

            if (!kline_list.isEmpty() || kline_list.size() > 0) {
                List<String> t = new ArrayList<>();
                List<String> c = new ArrayList<>();
                List<String> o = new ArrayList<>();
                List<String> h = new ArrayList<>();
                List<String> l = new ArrayList<>();
                List<String> v = new ArrayList<>();
                for (int i = 0; i < kline_list.size(); i++) {
                    JSONObject kline = kline_list.getJSONObject(i);
                    t.add(kline.getString("timestamp").toString());
                    c.add(kline.getString("close_price").toString());
                    o.add(kline.getString("open_price").toString());
                    h.add(kline.getString("high_price").toString());
                    l.add(kline.getString("low_price").toString());
                    v.add(kline.getString("volume").toString());
                }

                map.put("t", t);
                map.put("c", c);
                map.put("o", o);
                map.put("h", h);
                map.put("l", l);
                map.put("v", v);
            }
        }
//        System.out.println(JSONObject.toJSONString(map));
        return map;
    }

}
