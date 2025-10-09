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
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            clearable
            @keyup.enter.native="handleQuery"
          />
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
        <el-table-column label="用户ID" align="center" prop="userId" />
        <!-- <el-table-column label="用户名" align="center" prop="userName" /> -->
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
import { listData } from "@/api/bussiness/data";

export default {
  name: "Detail",
  data() {
    return {
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
        userId: null,
        userName: null,
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
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户详细信息列表 */
    getList() {
      this.loading = true;
      listData(this.queryParams).then((response) => {
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
      this.form = {
        id: null,
        userId: null,
        userName: null,
        totalRechargeAmount: null,
        totalWithdrawAmount: null,
        totalWingAmount: null,
        totalSubAmount: null,
        totalCollectAmount: null,
        totalCurrencyAmount: null,
        totalContractAmount: null,
        totalMattersAmount: null,
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
