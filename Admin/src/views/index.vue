<template>
  <div class="app-container">
    <TableContentBox title="数据统计">
      <panel-group
        :dataSource="dataSource"
        @handleSetLineChartData="handleSetLineChartData"
      />
    </TableContentBox>

    <el-row
      v-if="!['rxce'].includes(this.VUE_APP_ENV)"
      style="background: #fff; padding: 50px 16px 0"
    >
      <line-chart :chart-data="lineChartData" />
    </el-row>

    <!-- <el-row :gutter="32">
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <raddar-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <pie-chart />
        </div>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <div class="chart-wrapper">
          <bar-chart />
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>

<script>
import PanelGroup from "./dashboard/PanelGroup";
import LineChart from "./dashboard/LineChart";
import RaddarChart from "./dashboard/RaddarChart";
import PieChart from "./dashboard/PieChart";
import BarChart from "./dashboard/BarChart";
import { statisticsDataList } from "@/api/system/home";

export default {
  name: "Index",
  components: {
    PanelGroup,
    LineChart,
    RaddarChart,
    PieChart,
    BarChart,
  },
  data() {
    return {
      dataSource: {
        totalPlatformRevenue: {},
        numberOfPlayers: {},
        totalRechargeAmount: {},
        quantityOfOrder: {},
      },
      lineChartData: {},
    };
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = {
        expectedData: this.getObjToArray(
          this.dataSource[type].redLine,
          "value"
        ),
        actualData: this.getObjToArray(this.dataSource[type].blueLine, "value"),
        xAxisDate: this.getObjToArray(this.dataSource[type].redLine, "label"),
        legendData: [
          this.dataSource[type].redLineName,
          this.dataSource[type].blueLineName,
        ],
      };
    },
    getObjToArray(obj, key) {
      let result = Object.entries(obj)
        .sort()
        .map((item) => {
          return {
            label: item[0],
            value: item[1],
          };
        });
      if (key) {
        return result.map((item) => item[key]);
      } else {
        return result;
      }
    },
    getStatisticsDataList() {
      statisticsDataList().then((res) => {
        const arr = res.data;
        this.dataSource.totalPlatformRevenue = arr.find(
          (item) => item.title === 1
        );
        this.dataSource.numberOfPlayers = arr.find((item) => item.title === 2);
        this.dataSource.totalRechargeAmount = arr.find(
          (item) => item.title === 3
        );
        this.dataSource.quantityOfOrder = arr.find((item) => item.title === 4);
        this.handleSetLineChartData("totalPlatformRevenue");
      });
    },
  },
  created() {
    this.getStatisticsDataList();
  },
};
</script>

<style lang="scss" scoped>
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
