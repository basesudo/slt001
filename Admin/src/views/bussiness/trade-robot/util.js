import { _add, _mul, _sub, _div } from "./decimal";
import _ from "loadsh";
/**
 * 获取一天时间 时间间隔列表
 * @param {*} time time
 * @param {*} interval min
 * @param {*} timeDiff min
 * @returns
 */
export const generateTimeList = (time, timeInterval, timeDiff) => {
  // 获取当前日期的午夜时间
  const startTime = new Date(time).setSeconds(0);
  // 结束时间 获取第二天的午夜时间
  let endTime = new Date(startTime).setDate(new Date(startTime).getDate() + 1);
  if (timeDiff) {
    // 自定义时差
    endTime = new Date(startTime).getTime() + timeDiff * 60 * 1000;
  }

  timeInterval = timeInterval * 60 * 1000;
  // 使用 Array.from() 创建时间数组，第一个参数是生成的数组的长度，第二个参数是一个映射函数，用于处理数组的每个元素
  let timeArray = Array.from(
    { length: Math.ceil((endTime - startTime) / timeInterval) },
    (item, index) => {
      const currentTime = startTime + index * timeInterval;
      return new Date(currentTime).getTime();
    }
  );
  timeArray.push(endTime);
  return timeArray;
};

/**
 * 获取随机值列表
 * @param {*} count
 * @param {*} min
 * @param {*} max
 * @returns
 */
export const getRandomIntegers = (count, min, max) => {
  // 然后将其映射到 min 到 max 之间的整数
  return Array.from({ length: count }, (item, index) => [
    index,
    Math.floor(Math.random() * (max - min + 1)) + min,
  ]);
};
/**
 * 获取分割数据
 * @param {*} totalMinutes 总分钟数
 * @param {*} unit 刻度单位
 * @returns
 */
export const distributeMinutes = (totalMinutes, unit) => {
  let timeList = [];
  let count = Math.floor(totalMinutes / unit);

  for (let i = 0; i <= count; i++) {
    timeList.push(i * unit);
  }
  return timeList;
};
/**
 * 随机涨跌
 * @returns
 */
const randomUD = () => Math.random() >= 0.5;

/**
 * 随机K线数据
 */
export const getMockKLineOption = (
  xTimeScaleList,
  klineYRandomList,
  pricePencent
) => {
  if (xTimeScaleList.length && klineYRandomList.length && pricePencent) {
    let klineMockYData = xTimeScaleList.map((elem, index) => {
      // 随机生成开盘价、收盘价、最高价、最低价
      var randClose = Math.ceil(Math.random() * pricePencent); // 收盘价格
      var randHigh = Math.ceil(Math.random() * pricePencent);
      var randLow = Math.ceil(Math.random() * pricePencent);

      let currentKLineY = klineYRandomList[index];
      if (!Number(klineYRandomList[index])) {
        currentKLineY = 1;
      }
      let tempObj = {};

      if (index == 0) {
        tempObj.open = 0;
      } else {
        tempObj.open = klineYRandomList[index - 1];
      }

      // 随机涨跌
      if (randomUD()) {
        tempObj.close = _add(
          klineYRandomList[index],
          _mul(currentKLineY, randClose / 100)
        );
      } else {
        tempObj.close = _sub(
          klineYRandomList[index],
          _mul(currentKLineY, randClose / 100)
        );
      }

      if (tempObj.open > tempObj.close) {
        // 开盘价大于收盘价
        tempObj.high = _add(tempObj.open, _mul(tempObj.open, randHigh / 100));
        tempObj.low = _sub(tempObj.close, _mul(tempObj.close, randLow / 100));
      } else {
        // 开盘价小于收盘价
        tempObj.high = _add(tempObj.close, _mul(tempObj.close, randHigh / 100));
        tempObj.low = _sub(tempObj.open, _mul(tempObj.open, randLow / 100));
      }
      return [tempObj.open, tempObj.close, tempObj.high, tempObj.low];
    });
    klineMockYData.slice(-1);
    return {
      xAxis: {
        data: xTimeScaleList,
      },
      series: [
        {
          data: klineMockYData,
        },
      ],
    };
  }
};

/**
 * 计算曲线 坐标值
 */
export const getKLineYRandomList = (xList, yList) => {
  let tempKLineYRandomList = [];
  // 精度
  let precision = _div(xList.length - 1, yList.length - 1);

  yList.forEach((elem, i) => {
    // 刻度循环
    let nextElem = yList[i + 1] || elem;
    for (var j = i * precision; j < (i + 1) * precision; j++) {
      // 精度循环
      let diff = _sub(elem[1], nextElem[1]);
      let result = 0;

      let diffDivided = _div(diff, precision);
      let relativeDistance = _sub(j, _mul(i, precision));
      let halfPiTimesRelativeDistance = _mul(
        _div(Math.PI, 2),
        relativeDistance
      );
      let sinValue = Math.sin(_div(halfPiTimesRelativeDistance, precision));
      result = _sub(
        elem[1],
        _mul(_mul(diffDivided, relativeDistance), sinValue)
      );
      tempKLineYRandomList[j] = result;
    }
  });
  return tempKLineYRandomList;
};
/**
 * 防抖计算
 */
export const getKLineYRandomListDebounce = _.debounce(getKLineYRandomList, 0);
