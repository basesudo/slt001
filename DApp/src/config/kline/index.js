//启用的功能
import enabled_features from './enabled-features'
//面板上禁用的功能
import disabled_features from './disabled-features'
//柱状图颜色
import studies_overrides from './studies-overrides'
//主要配置
import { getOverrides } from './overrides'
//设置初始化加载条样式
import { getLoadingScreen } from './loading-screen'

export const getConfig = (theme) => {
  return {
    enabled_features,
    disabled_features,
    studies_overrides,
    overrides: getOverrides(theme),
    loading_screen: getLoadingScreen(theme)
  }
}

import { _t18 } from '@/utils/public'

/**
 * 分辨率
 */
export const getIntervalList = () => {
  let tempList = [
    // {
    //   label: '1秒',
    //   value: '1s'
    // },

    {
      label: `1${_t18('minute')}`,
      value: '1m',
      interval: '1',
      key: 'ONE_MIN'
    },
    // {
    //   label: `3${_t18('minute', ['dev'])}`,
    //   value: '3m',
    //   interval: '3',
    //   key: 'ONE_MIN'
    // },
    {
      label: `5${_t18('minute')}`,
      value: '5m',
      interval: '5',
      key: 'FIVE_MIN',
      market: 'mt5'
    },
    {
      label: `15${_t18('minute')}`,
      value: '15m',
      interval: '15',
      key: 'FIFTEEN_MIN',
      market: 'mt5'
    },
    {
      label: `30${_t18('minute')}`,
      value: '30m',
      interval: '30',
      key: 'THIRTY_MIN',
      market: 'mt5'
    },
    {
      label: `1${_t18('hour')}`,
      value: '1h',
      interval: '60',
      key: 'ONE_HOUR',
      market: 'mt5'
    },
    {
      label: `2${_t18('hour')}`,
      value: '2h',
      interval: '120',
      key: 'TWO_HOUR'
    },

    {
      label: `6${_t18('hour')}`,
      value: '6h',
      interval: '360',
      key: 'SIX_HOUR',
      isMore: true
    },

    {
      label: `1${_t18('day')}`,
      value: '1d',
      interval: '1d',
      key: 'ONE_DAY',
      isMore: true,
      market: 'mt5'
    },
    {
      label: `3${_t18('day')}`,
      value: '3d',
      interval: '3d',
      key: 'ONE_DAY',
      isMore: true
    },
    //周线
    {
      label: _t18('weekly'),
      value: '1w',
      interval: 'W',
      key: 'ONE_WEEK',
      isMore: true,
      market: 'mt5'
    },
    //月线
    {
      label: _t18('month'),
      value: '1M',
      interval: 'M',
      key: 'ONE_MON',
      isMore: true
    }
  ]
  return tempList
}

/**
 * 指标配置
 */
export const getStudyList = () => [
  {
    label: 'MA',
    name: 'Moving Average',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [5, 10, 30],
    studyList: []
  },
  {
    label: 'EMA',
    name: 'Moving Average Exponential',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [5, 10, 30],
    studyList: []
  },
  {
    label: 'BOLL',
    name: 'Bollinger Bands',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [14],
    studyList: []
  },
  {
    label: 'MACD',
    name: 'MACD',
    colorList: ['#E5BF39', '#7CC7BA', '#C5A0E0'],
    cycleList: [12],
    studyList: []
  },
  // {
  //   label: 'KDJ',
  //   name: 'KDJ Indicator',
  //   colorList: ['#7B2B8C', '#5FABAC', '#886024'],
  //   cycleList: [9, 3],
  //   studyList: []
  // },
  {
    label: 'RSI',
    name: 'Relative Strength Index',
    colorList: ['#7B2B8C', '#5FABAC', '#886024'],
    cycleList: [6],
    studyList: []
  },
  {
    label: 'WR',
    name: 'Williams %R',
    colorList: ['#886024'],
    cycleList: [14],
    studyList: []
  }
]
