<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="开始时间">
          <el-date-picker
            clearable
            v-model="queryParams.params.beginTime"
            type="date"
            @change="onPicker"
            value-format="yyyy-MM-dd"
            class="amount"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            clearable
            v-model="queryParams.params.endTime"
            type="date"
            @change="onPicker1"
            value-format="yyyy-MM-dd"
            class="amount"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </SearchFormBox>
    <TableContentBox>
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="detailList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />

        <el-table-column
          label="总充值"
          align="center"
          prop="totalRechargeAmount"
        />
        <el-table-column
          label="总提现"
          align="center"
          prop="totalWithdrawAmount"
        />
        <el-table-column
          label="总赠送彩金"
          align="center"
          prop="totalWingAmount"
        />
        <el-table-column
          label="总扣减彩金"
          align="center"
          prop="totalSubBousAmount"
        />
        <el-table-column
          label="总人工上分"
          align="center"
          prop="totalAddAmount"
        />
        <el-table-column
          label="总人工下分"
          align="center"
          prop="totalSubAmount"
        />
        <el-table-column
          label="总归集金额"
          align="center"
          prop="totalCollectAmount"
        />
        <el-table-column label="秒合约输赢金额" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.rewardAmount - scope.row.betAmount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="U本位输赢总金额"
          align="center"
          prop="totalContractAmount"
        />
        <el-table-column
          label="理财总金额"
          align="center"
          prop="totalMattersAmount"
        />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>
  </div>
</template>

<script>
import { dailyData } from "@/api/bussiness/data";

export default {
  name: "Detail",
  data() {
    return {
      currentDate: new Date(),
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户详细信息表格数据
      detailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        params: {
          beginTime: "",
          endTime: "",
        },
        totalRechargeAmount: null,
        totalWithdrawAmount: null,
        totalWingAmount: null,
        totalSubAmount: null,
        totalCollectAmount: null,
        totalCurrencyAmount: null,
        totalContractAmount: null,
        totalMattersAmount: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  // created() {
  //   this.getList();
  // },
  computed: {
    datetimeFull() {
      var dateValue = new Date(
        new Date(new Date().toLocaleDateString()).getTime() +
          24 * 60 * 60 * 1000 -
          1
      );
      let datetime =
        dateValue.getFullYear() +
        "-" +
        (dateValue.getMonth() + 1 < 10
          ? "0" + (dateValue.getMonth() + 1)
          : dateValue.getMonth() + 1) +
        "-" +
        (dateValue.getDate() < 10
          ? "0" + dateValue.getDate()
          : dateValue.getDate()) +
        " " +
        dateValue.getHours() +
        ":" +
        dateValue.getMinutes() +
        ":" +
        dateValue.getSeconds();
      return datetime;
    },
    /**
     * 获取日期+00时00分00秒
     * @param {Date} datetime --日期
     */
    datetimeFullZero() {
      var dateValue = new Date(
        new Date(new Date().toLocaleDateString()).getTime()
      );
      var datetime =
        dateValue.getFullYear() +
        "-" +
        (dateValue.getMonth() + 1 < 10
          ? "0" + (dateValue.getMonth() + 1)
          : dateValue.getMonth() + 1) +
        "-" +
        (dateValue.getDate() < 10
          ? "0" + dateValue.getDate()
          : dateValue.getDate()) +
        " " +
        (dateValue.getHours() < 10
          ? "0" + dateValue.getHours()
          : dateValue.getHours()) +
        ":" +
        (dateValue.getMinutes() < 10
          ? "0" + dateValue.getMinutes()
          : dateValue.getMinutes()) +
        ":" +
        (dateValue.getSeconds() < 10
          ? "0" + dateValue.getSeconds()
          : dateValue.getSeconds());
      return datetime;
    },
  },
  mounted() {
    this.queryParams.params.beginTime = this.datetimeFullZero;
    this.queryParams.params.endTime = this.datetimeFull;
    dailyData(this.queryParams).then((response) => {
      this.detailList = response.rows;
      this.total = response.total;
      this.loading = false;
    });
  },
  methods: {
    onPicker(e) {
      // this.queryParams.params.endTime = e + " " + "23:59:59";
      this.queryParams.params.beginTime = e + " " + "00:00:00";
    },
    onPicker1(e) {
      this.queryParams.params.endTime = e + " " + "23:59:59";
      // this.queryParams.params.beginTime = e + " " + "00:00:00";
    },
    /** 查询用户详细信息列表 */
    getList() {
      this.loading = true;
      dailyData(this.queryParams).then((response) => {
        this.detailList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      // rewardAmount: null,
      this.form = {
        id: null,
        totalRechargeAmount: null,
        totalWithdrawAmount: null,
        totalWingAmount: null,
        totalSubAmount: null,
        totalCollectAmount: null,
        totalCurrencyAmount: null,
        totalContractAmount: null,
        totalMattersAmount: null,
        betAmount: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
  },
};
</script>
<style scoped lang="scss">
.img-box {
  width: 100%;
  height: 100px;
}
</style>
