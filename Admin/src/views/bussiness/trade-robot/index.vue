<template>
  <div class="app-container">
    <SearchFormBox title="参数设置">
      <el-form
        :model="form"
        :rules="rules"
        size="small"
        :inline="true"
        label-width="100px"
        :disabled="isPriview || isUpdate"
      >
        <el-form-item label="交易对" prop="symbol">
          <el-select
            v-model="form.symbol"
            filterable
            placeholder="请选择交易对"
            clearable
          >
            <el-option
              v-for="(item, index) in symbolList"
              :key="index"
              :label="item.showSymbol"
              :value="item.symbol"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="控盘策略" prop="model">
          <el-radio-group v-model="form.model" @change="onModelChange">
            <el-radio-button
              v-for="item in modelList"
              :key="item.label"
              :label="item.value"
            >
              {{ item.label }}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="控盘时间" prop="time" v-if="form.model != 0">
          <el-date-picker
            v-model="form.time"
            type="datetime"
            placeholder="选择控盘时间"
            format="yyyy-MM-dd HH:mm"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="最大涨幅" prop="increase" v-if="form.model != 0">
          <el-input
            v-model="form.increase"
            type="number"
            :min="0.001"
            placeholder="请输入最大涨幅"
          >
            <template v-slot:append>%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="最大跌幅" prop="decline" v-if="form.model != 0">
          <el-input
            v-model="form.decline"
            type="number"
            :min="0.001"
            placeholder="请输入最大跌幅"
          >
            <template v-slot:append>%</template>
          </el-input>
        </el-form-item>
        <template v-if="form.model != 0">
          <!-- <el-form-item label="控制粒度" prop="granularity">
            <el-radio-group v-model="form.granularity">
              <el-radio-button
                v-for="item in granularityList"
                :key="item.label"
                :label="item.value"
              >
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item> -->
          <el-form-item label="浮动比例" prop="pricePencent">
            <el-input
              v-model="form.pricePencent"
              type="number"
              :min="0.001"
              :max="100"
              placeholder="请输入价格浮动比例"
              @change="KLinePerview"
              style="width: 250px"
            >
              <template v-slot:append>%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="参考价格"
            prop="conPrice"
            v-if="isPriview || isUpdate"
          >
            <el-input
              v-model="form.conPrice"
              :disabled="form.conPrice > 0"
              type="number"
              :min="0.001"
              placeholder="请输入价格浮动比例"
            >
            </el-input>
          </el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  size="mini"
                  plain
                  @click="
                    drawLine();
                    KLinePerview();
                  "
                  v-if="form.model != 0"
                >
                  绘制
                </el-button>
                <!-- <el-button
                  icon="el-icon-view"
                  size="mini"
                  @click="KLinePerview()"
                  v-if="form.model != 0"
                >
                  预览
                </el-button> -->

                <el-button
                  type="primary"
                  icon="el-icon-check"
                  size="mini"
                  @click="submit"
                  :disabled="isPriview"
                >
                  保存
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </template>
      </el-form>
    </SearchFormBox>

    <div v-if="form.model == 0">
      <!-- 跟随型 -->
      <TableContentBox :title="modelInfo.label">
        <el-form :disabled="isPriview">
          <el-row>
            <el-col :span="6">
              <el-form-item label="浮动价格" prop="conPrice">
                <el-tooltip
                  effect="dark"
                  placement="bottom-start"
                  content="当前币种价格 + 浮动价格"
                >
                  <i class="el-icon-info" />
                </el-tooltip>
                <el-input
                  v-model="form.conPrice"
                  :min="0"
                  type="number"
                  placeholder="请输入浮动价格"
                >
                  <template v-slot:append>USDT</template>
                </el-input>
              </el-form-item>
            </el-col>

            <!-- <el-col :span="6" :offset="2">
              <el-form-item label="浮动比例" prop="pricePencent">
                <el-input
                  v-model="form.pricePencent"
                  type="number"
                  placeholder="请输入价格浮动比例"
                >
                  <template v-slot:append>%</template>
                </el-input>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-check"
          size="mini"
          @click="submit"
          :disabled="isPriview"
        >
          保存
        </el-button>
      </TableContentBox>
    </div>
    <div v-else>
      <!-- 线 图表 -->
      <TableContentBox :title="modelInfo.label">
        <el-row>
          <div class="line-chart" ref="lineChartRef"></div>
        </el-row>
      </TableContentBox>

      <!-- K线 图表 -->
      <TableContentBox title="趋势预览" style="margin-top: 15px">
        <el-row>
          <div class="kline-chart" ref="KLineChartRef"></div>
        </el-row>
      </TableContentBox>
    </div>
  </div>
</template>

<script>
import TimeFormater from "time-formater";
import * as echarts from "echarts";
import {
  generateTimeList,
  getKLineYRandomList,
  distributeMinutes,
  getMockKLineOption,
} from "./util";
import { _toFixed, _div, _mul } from "./decimal";
import {
  getSymbolListApi,
  saveTradeRobotApi,
  getDetailApi,
  updateDetailApi,
} from "@/api/bussiness/trade-robot.js";
export default {
  name: "TradeRobot",

  data() {
    return {
      detail: null,
      // 历史id
      id: null,
      // 类型 priview update
      type: null,
      // 控盘策略列表
      modelList: [
        { value: 0, label: "跟随型趋势" },
        // { value: 1, label: "自定义趋势" },
        { value: 2, label: "秒杀型趋势" },
      ],
      // 币种列表
      symbolList: [],
      // 表单
      form: {},
      // 表单校验
      rules: {
        symbol: { required: true, message: "币种不能为空", trigger: "blur" },
      },
      // 总分钟数
      totalMinutes: 0,
      // 基础粒度
      granularity: 15,
      // X轴时间
      xTimeScaleList: [],
      // Y轴计算比例
      yRandomList: [],
      // 图表实例
      lineChart: null,
      // 图表实例
      KLineChart: null,
      /**
       * k线预处理数据
       */
      klineYRandomList: [],
      /**
       * k线数据
       */
      klineMockYData: [],

      pickerOptions: {
        //设置禁用状态，参数为当前日期
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000; //  - 86400000是否包括当天
        },
      },
    };
  },
  computed: {
    /**
     * 策略信息
     */
    modelInfo() {
      return this.modelList.find(
        (elem) => elem.value == (this.form?.model || 0)
      );
    },
    /**
     * 控制粒度列表
     */
    granularityList() {
      let tempList = [
        { value: 15, label: "15分钟" },
        { value: 30, label: "30分钟" },
        { value: 60, label: "1小时" },
        { value: 120, label: "2小时" },
        { value: 240, label: "4小时" },
      ];

      if (this.form.model == 2) {
        // 秒杀型趋势
        tempList = [
          { value: 1, label: "1分钟" },
          { value: 5, label: "5分钟" },
          { value: 10, label: "10分钟" },
          { value: 15, label: "15分钟" },
        ];
      }
      return tempList;
    },
    /**
     * 是否为预览
     */
    isPriview() {
      return this.type == "priview";
    },
    /**
     * 是否为修改
     */
    isUpdate() {
      return this.type == "update";
    },
  },
  async mounted() {
    await this.getSymbolList();
    this.id = this.$route.query.id || null;
    this.type = this.$route.query.type || null;
    if (this.id) {
      this.getDetail();
    } else {
      this.reset();
      window.addEventListener("resize", this.resize);
    }
  },
  methods: {
    /**
     * 获取数据详情
     */
    async getDetail() {
      const res = await getDetailApi(this.id);
      if (res.code == 200) {
        console.log(res);
        let tempData = res.data;
        this.detail = tempData;
        if (!this.symbolList.some((elem) => elem.symbol == tempData.symbol)) {
          tempData.symbol = "";
        }
        this.form = {
          decline: tempData.decline,
          increase: tempData.increase,
          granularity: tempData.granularity,
          model: tempData.model,
          conPrice: tempData.conPrice,
          pricePencent: tempData.pricePencent,
          symbol: tempData.symbol,
          time: new Date(tempData.beginTime),
        };
        this.klineMockYData = tempData.botInfoList.map((elem) => {
          this.klineYRandomList[elem.x] = elem.y;
          return [elem.open, elem.close, elem.high, elem.low];
        });
        this.granularity = this.granularityList[0].value;

        if (tempData.model == 2) {
          this.totalMinutes = 60;
          this.xTimeScaleList = generateTimeList(
            this.form.time,
            this.granularity,
            this.totalMinutes
          );
        }
        this.yRandomList = JSON.parse(tempData.lineChartData);
        this.drawLine();
        this.drawKLine();
        this.KLinePerview({
          series: [{ data: this.klineMockYData }],
          xAxis: this.xTimeScaleList,
        });
      }
    },
    /**
     * 提交
     */
    async submit() {
      console.log("表单数据", this.form);
      console.log("K线数据 open, close, high, low", this.klineMockYData);
      console.log(
        "K线数据 时间",
        this.klineYRandomList,
        this.form.time.getTime()
      );
      let tempBotInfoList = [];
      this.form.time.setSeconds(0);
      this.form.time.setMilliseconds(0);

      let nowDate = new Date();
      nowDate.setSeconds(0);
      nowDate.setMilliseconds(0);

      let time = this.form.time.getTime();
      // if (
      //   [2].includes(this.form.model) &&
      //   time < nowDate.getTime() + 120 * 1000
      // ) {
      //   this.$modal.msgError("请将控盘时间设置为 当前时间 + 两分钟");
      //   return;
      // }
      if ([1, 2].includes(this.form.model)) {
        tempBotInfoList = Object.keys(this.klineYRandomList).map(
          (elem, index) => {
            return {
              x: elem,
              y: `${this.klineYRandomList[index]}`,

              dateTime: time + elem * this.form.granularity * 60 * 1000,
              open: this.klineMockYData[index][0],
              close: this.klineMockYData[index][1],
              high: this.klineMockYData[index][2],
              low: this.klineMockYData[index][3],
            };
          }
        );
      }
      let params = {
        // 最大跌幅
        decline: this.form.pricePencent,
        // 最大涨幅
        increase: this.form.pricePencent,
        // 控制粒度
        granularity: "",
        // 控盘策略 0 跟随型 1 自定义 2 秒杀型
        model: this.form.model,
        // 浮动价格  model为 0 时有效
        conPrice: this.form.conPrice,
        // 浮动比例
        pricePencent: this.form.pricePencent,
        // 交易对
        symbol: this.form.symbol,
        // 开始时间
        beginTime: time,
        // 结束时间
        endTime: "",
        // 趋势列表
        botInfoList: [
          {
            close: 0,
            dateTime: time,
            high: 0,
            low: 0,
            open: 0,
            x: "0",
            y: "0",
          },
        ],
        // 图表刻度数据
        lineChartData: "[]",
      };
      if ([1, 2].includes(this.form.model)) {
        // 最大跌幅
        params.decline = this.form.decline;
        // 最大涨幅
        params.increase = this.form.increase;
        // 控制粒度
        params.granularity = this.form.granularity;
        // 开始时间
        params.beginTime = tempBotInfoList[0].dateTime;
        // 结束时间
        params.endTime = tempBotInfoList[tempBotInfoList.length - 1].dateTime;
        // 趋势列表
        params.botInfoList = tempBotInfoList;
        // 图表刻度数据
        params.lineChartData = JSON.stringify(this.yRandomList);
      }
      console.log(params);
      if (this.form.symbol == "") {
        this.$modal.msgError("交易对不能为空");
        return false;
      }
      if (this.id) {
        // 修改
        params.id = this.id;
        const res = await updateDetailApi(params);
        if (res.code == 200) {
          this.$modal.msgSuccess(res.msg);
          // 控盘策略 0 跟随型 1 自定义 2 秒杀型
          if (this.form.model == 0) {
            this.form.conPrice = "";
          } else {
            this.reset();
          }
        } else {
          this.$modal.msgError(res.msg);
        }
      } else {
        const res = await saveTradeRobotApi(params);
        if (res.code == 200) {
          this.$modal.msgSuccess(res.msg);
          // 控盘策略 0 跟随型 1 自定义 2 秒杀型
          if (this.form.model == 0) {
            this.form.conPrice = "";
          } else {
            this.reset();
          }
        } else {
          this.$modal.msgError(res.msg);
        }
      }
    },
    /**
     * 监听粒度改变
     */
    onModelChange(val) {
      // console.log("监听粒度改变", val);
      if ([1, 2].includes(val)) {
        this.granularity = this.granularityList[0].value;
        this.form.granularity = this.granularity;
        this.pricePencent = 5;
      }

      if (val == 2) {
        this.totalMinutes = 60;
        this.xTimeScaleList = generateTimeList(
          this.form.time,
          this.granularity,
          this.totalMinutes
        );
        this.drawLine();
        this.drawKLine();
        this.KLinePerview();
      } else if (val == 1) {
        this.totalMinutes = 1 * 24 * 60;
        this.xTimeScaleList = generateTimeList(
          this.form.time,
          this.granularity
        );
        this.drawLine();
        this.drawKLine();
        this.KLinePerview();
      } else if (val == 0) {
        this.resetForm(() => {
          this.form.model = val;
        });
      }
    },
    /**
     * 充值表单
     */
    resetForm(callback) {
      this.form = {
        // 交易对
        symbol: "",
        // 模式
        model: 2,
        // 模拟时间
        time: new Date(),
        // 最大涨幅
        increase: 5,
        // 最大跌幅
        decline: 5,
        // 控制粒度
        granularity: 15,
        // 浮动价格
        conPrice: 0,
        // 价格浮动比例
        pricePencent: 5,
      };
      callback && callback();
    },
    /**
     * 重置表单
     */
    reset() {
      if (this.lineChart) {
        this.lineChart.dispose();
        this.lineChart = null;
      }
      if (this.KLineChart) {
        this.KLineChart.dispose();
        this.KLineChart = null;
      }
      this.resetForm();
      this.id = null;
      this.type = null;
      this.detail = null;
      // 总分钟数
      this.totalMinutes = 1 * 24 * 60;
      // 基础粒度
      this.granularity = 15;
      // X轴时间
      this.xTimeScaleList = [];
      // Y轴计算比例
      this.yRandomList = [];
      // K线计算曲线比例
      this.klineYRandomList = [];
      // K线模拟数据
      this.klineMockYData = [];
      this.onModelChange(this.form.model);
    },
    /**
     * 预览
     */
    KLinePerview(option) {
      if (!option) {
        option = getMockKLineOption(
          this.xTimeScaleList,
          this.klineYRandomList,
          this.form.pricePencent
        );
      }
      console.log(option);
      this.klineMockYData = option.series[0].data || [];
      this.KLineChart && this.KLineChart.setOption(option);
    },
    /**
     * 绘制 KLineChart
     */
    drawKLine() {
      if (!this.KLineChart && this.$refs.KLineChartRef) {
        this.KLineChart = echarts.init(this.$refs.KLineChartRef);
      }
      let options = {
        grid: {
          left: 30,
          right: 50,
          top: 10,
          bottom: 30,
        },
        xAxis: {
          type: "category",
          name: "时间",
          boundaryGap: false,
          axisLabel: {
            fontSize: 8,
            formatter: (params) => {
              return TimeFormater(Number(params)).format("HH:mm");
            },
          },
          data: this.xTimeScaleList,
        },
        yAxis: {
          //   min: 0 - this.form.decline,
          //   max: this.form.increase,
          name: "价格",
          type: "value",
          axisLine: { onZero: false },
          axisLabel: {
            fontSize: 8,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#CCC"],
              width: 1,
              type: "dashed",
            },
          },
        },
        series: [
          {
            type: "candlestick",
            itemStyle: {
              color: "#4bbd83", // 绿色（涨）
              color0: "#d62548", // 红色（跌）
              borderColor: "#4bbd83", // 绿色（涨）
              borderColor0: "#d62548", // 红色（跌）
              borderColorDoji: null,
              borderWidth: "1",
            },

            data: [],
          },
        ],
      };
      this.KLineChart && this.KLineChart.setOption(options);
    },
    /**
     * 绘制 lineChart
     */
    drawLine() {
      if (this.lineChart) {
        this.lineChart.dispose();
        this.lineChart = null;
      }
      if (this.$refs.lineChartRef) {
        this.lineChart = echarts.init(this.$refs.lineChartRef);
      }
      // 根据控制粒度计算X轴时间刻度
      if (!this.type || this.detail?.granularity != this.form.granularity) {
        // 获取当前粒度X数组
        let xTimeScaleList = distributeMinutes(
          this.totalMinutes,
          this.form.granularity
        );
        // 初始化默认Y数组
        this.yRandomList = xTimeScaleList.map((elem, index) => {
          return [xTimeScaleList[index] / this.granularity, 0];
        });
        // 获取模拟K线数据
        this.klineYRandomList = getKLineYRandomList(
          this.xTimeScaleList,
          this.yRandomList
        ).slice(0, this.xTimeScaleList.length);
      }
      // 计算options
      let options = {
        backgroundColor: "#fff",
        graphic: null,
        title: {
          text: "",
          subtext: "",
          x: "center",
        },
        interval: 1,
        grid: {
          left: 30,
          right: 50,
          top: 10,
          bottom: 30,
          containLabel: false, //grid 区域是否包含坐标轴的刻度标签
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              formatter: (params) => {
                if (params.axisDimension == "x") {
                  return TimeFormater(Number(params.value)).format(
                    "YYYY-MM-DD HH:mm"
                  );
                } else if (params.axisDimension == "y") {
                  return _toFixed(params.value, 4);
                }
              },
            },
            lineStyle: {
              color: "#3B91FF",
            },
          },
        },
        xAxis: {
          type: "category",
          name: "时间",
          boundaryGap: false,
          axisLabel: {
            fontSize: 8,
            formatter: (params) => {
              return TimeFormater(Number(params)).format("HH:mm");
            },
          },

          splitLine: {
            //网格线
            show: true,
            lineStyle: {
              color: ["#CCC"],
              width: 1,
              type: "dashed",
            },
          },
          data: this.xTimeScaleList,
        },
        yAxis: {
          min: 0 - this.form.decline,
          max: this.form.increase,
          name: "价格",
          type: "value",
          //   axisLine: { onZero: false },
          axisLabel: {
            fontSize: 8,
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: ["#CCC"],
              width: 1,
              type: "dashed",
            },
          },
        },

        series: [
          {
            data: this.yRandomList,
            type: "line",
            smooth: true,
            symbol: "circle",
            showSymbol: true,
            symbolSize: 12,
            itemStyle: {
              color: "#3B91FF",
            },
            lineStyle: {
              color: "#3B91FF",
            },
          },
        ],
      };
      this.lineChart && this.lineChart.setOption(options);
      if (!this.isPriview) {
        this.setLineOption();
      }
    },
    /**
     * 设置拖拽
     */
    setLineOption() {
      this.lineChart.setOption({
        graphic: echarts.util.map(this.yRandomList, (dataItem, dataIndex) => {
          const that = this; // 因为ondrag函数必须在回调内使用this.position获取实时坐标，此处必须用that替换this
          return {
            type: "circle",
            shape: {
              // 圆点的半径。
              r: 10,
            },
            style: {
              fill: "#3B91FF", // 设置圆点的填充色，这里设置为红色
            },
            position: this.lineChart.convertToPixel("grid", dataItem),
            invisible: true,
            draggable: true,
            z: 100,
            ondrag: echarts.util.curry(function (dataIndex) {
              let origin = that.lineChart.convertToPixel(
                "grid",
                that.yRandomList[dataIndex]
              );
              this.position[0] = origin[0]; // 控制每个点位只能在y轴方向移动
              // this.position[1] = origin[1] // 控制每个点位只能在x轴方向移动
              // 实时获取拖动的点位信息并根据此信息重新画图
              let tempData = that.lineChart.convertFromPixel(
                "grid",
                this.position
              );
              if (tempData[1] > that.form.increase) {
                tempData[1] = that.form.increase;
              } else if (tempData[1] < 0 - that.form.decline) {
                tempData[1] = 0 - that.form.decline;
              }
              that.yRandomList[dataIndex] = tempData;

              that.lineChart.setOption({
                series: [
                  {
                    data: that.yRandomList,
                  },
                ],
              });
            }, dataIndex),
            ondragend: function () {
              that.klineYRandomList = getKLineYRandomList(
                that.xTimeScaleList,
                that.yRandomList
              ).slice(0, that.xTimeScaleList.length);
              setTimeout(that.KLinePerview, 300);
              // 拖拽结束时，再次检查位置是否超出范围，如果超出则重置为合法位置
              const origin = that.lineChart.convertToPixel(
                "grid",
                that.yRandomList[dataIndex]
              );
              const tempData = that.lineChart.convertFromPixel(
                "grid",
                this.position
              );
              if (tempData[1] > that.form.increase) {
                this.position[1] = origin[1];
              } else if (tempData[1] < 0 - that.form.decline) {
                this.position[1] = origin[1];
              }
            },
          };
        }),
      });
    },
    /**
     * 监听大小
     */
    resize() {
      this.lineChart && this.lineChart.resize();
      this.KLineChart && this.KLineChart.resize();
    },
    async getSymbolList() {
      const res = await getSymbolListApi({
        pageNum: 1,
        pageSize: 1000,
      });
      if (res.code == 200) {
        this.symbolList = res.rows;
        this.form.symbol = this.symbolList[0].symbol;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.line-chart,
.kline-chart {
  height: 800px;
}
</style>
