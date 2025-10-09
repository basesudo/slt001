<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="提现地址" prop="toAdress">
          <el-input
            v-model="queryParams.toAdress"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="queryParams.status" clearable>
            <el-option
              v-for="dict in dict.type.withdraw_order_status"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="serialId">
          <el-input
            v-model="queryParams.serialId"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="提现金额" prop="amount">
          <div class="picker">
            <el-input
              v-model="queryParams.minAmount"
              clearable
              placeholder="最小金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
            <span> - </span>
            <el-input
              v-model="queryParams.maxAmount"
              clearable
              placeholder="最大金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </div>
        </el-form-item>
        <el-form-item label="用户类型" prop="isTest">
          <el-select v-model="queryParams.isTest" clearable style="width: 100%">
            <el-option :label="'正常用户'" :value="0" />
            <el-option :label="'测试用户'" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单类型" prop="orderType">
          <el-select
            v-model="queryParams.orderType"
            clearable
            style="width: 100%"
          >
            <el-option :label="'全部'" :value="-1" />
            <el-option :label="'提现'" :value="1" />
            <el-option :label="'彩金'" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <div class="picker">
            <el-date-picker
              clearable
              v-model="queryParams.params.beginTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              class="amount"
            >
            </el-date-picker
            >至
            <el-date-picker
              clearable
              v-model="queryParams.params.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              class="amount"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <!-- <el-form-item label="备注" prop="remark">
          <el-input
            v-model="queryParams.remark"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
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
      </el-form></SearchFormBox
    >

    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['system:withdraw:export']"
            >导出</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="info" plain size="small"
            >总金额:{{ allWithdraw }}</el-button
          >
        </el-col>
        <right-toolbar
          :columns.sync="columns"
          :showSearch.sync="showSearch"
          pageName="withdrawlist"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="withdrawList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="50" align="center" />
        <el-table-column
          label="用户ID"
          align="center"
          prop="userId"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="用户名"
          align="center"
          prop="username"
          v-if="columns[1].visible"
        />
        <el-table-column
          label="用户类型"
          align="center"
          prop="isTest"
          v-if="columns[2].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.user_type"
              :value="scope.row.isTest"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="提现地址"
          align="center"
          prop="toAdress"
          v-if="columns[3].visible"
        />
        <el-table-column
          label="提现金额"
          align="center"
          prop="amount"
          v-if="columns[4].visible"
        />
        <el-table-column
          label="审核状态"
          align="center"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.withdraw_order_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>

        <!-- <el-table-column label="取款地址" align="center" prop="fromAddr" /> -->
        <el-table-column
          label="提现类型"
          align="center"
          prop="type"
          min-width="100px"
          v-if="columns[6].visible"
        />
        <el-table-column
          label="订单类型"
          align="center"
          prop="orderType"
          v-if="columns[7].visible"
        >
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.orderType == 2"> 彩金 </el-tag>
            <el-tag type="info" v-else> 提现 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="提现时间"
          sortable
          align="center"
          prop="createTime"
          min-width="180"
          v-if="columns[8].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作时间"
          sortable
          align="center"
          prop="operateTime"
          min-width="180"
          v-if="columns[9].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.operateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="币种"
          align="center"
          prop="coin"
          v-if="columns[10].visible"
        />

        <el-table-column
          label="手续费"
          align="center"
          prop="fee"
          v-if="columns[11].visible"
        />

        <!-- <el-table-column label="订单号" align="center" prop="serialId"/> -->
        <el-table-column
          label="订单号"
          align="center"
          prop="serialId"
          min-width="150px"
          v-if="columns[12].visible"
        >
          <template slot-scope="scope">
            <!-- <el-link
              :underline="false"
              v-clipboard="scope.row.serialId"
              >{{ scope.row.serialId }} <i class="el-icon-copy-document"></i>
            </el-link> -->
            <el-link
              :underline="false"
              v-clipboard="scope.row.serialId"
              v-clipboard:success="clipboardSuccess"
              >{{ scope.row.serialId }} <i class="el-icon-copy-document"></i>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column
          label="实际金额"
          align="center"
          prop="realAmount"
          v-if="columns[13].visible"
        />

        <!-- <el-table-column label="更新者" align="center" prop="adminUserId" /> -->
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          v-if="columns[14].visible"
        />

        <el-table-column
          label="提现说明"
          align="center"
          prop="withDrawRemark"
          v-if="columns[15].visible"
        />
        <!-- <el-table-column label="银行名称" align="center" prop="bankName" />
        <el-table-column
          label="银行收款人名称"
          align="center"
          prop="bankUserName"
        />
        <el-table-column label="分行" align="center" prop="bankBranch" /> -->
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          min-width="150px"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="small"
              type="warning"
              plain
              @click="lockWithdraw(scope.row)"
              v-hasPermi="['bussiness:withdraw:edit']"
              >{{
                !["rxce"].includes(VUE_APP_ENV) ? "锁定" : "冻结"
              }}</el-button
            >

            <el-button
              v-else-if="scope.row.status == 1 || scope.row.status == 2"
              size="small"
              type="success"
              plain
              @click="lookFor(scope.row)"
              v-hasPermi="['bussiness:order:query']"
              >查看</el-button
            >
            <div v-else-if="scope.row.status == 3">
              <el-button
                size="small"
                type="danger"
                plain
                @click="review(scope.row)"
                v-hasPermi="['bussiness:withdraw:edit']"
                >审核</el-button
              >
              <el-button
                size="small"
                type="info"
                plain
                @click="unLockWithdraw(scope.row)"
                v-hasPermi="['bussiness:withdraw:edit']"
                >解锁</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>

    <!-- 添加或修改用户提现对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="地址" prop="toAdress">
          <el-input v-model="form.toAdress" />
        </el-form-item>
        <!-- <el-form-item label="银行名称" prop="bankName">
          <el-input v-model="form.bankName" />
        </el-form-item>
        <el-form-item label="收款人名称" prop="bankUserName">
          <el-input v-model="form.bankUserName" />
        </el-form-item>
        <el-form-item label="分行" prop="bankBranch">
          <el-input v-model="form.bankBranch" />
        </el-form-item> -->
        <el-form-item label="提现金额" prop="amount">
          <el-input v-model="form.amount" />
        </el-form-item>
        <el-form-item label="单号" prop="serialId">
          <el-input v-model="form.serialId" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" />
        </el-form-item>
        <el-form-item label="实际金额" prop="realAmount">
          <el-input v-model="form.realAmount" />
        </el-form-item>
        <el-form-item label="收款地址" prop="toAdress">
          <el-input v-model="form.toAdress" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="提现说明" prop="withDrawRemark">
          <el-input v-model="form.withDrawRemark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="form.status == 3">
        <el-button type="primary" @click="passWithdraw">通过</el-button>
        <el-button type="primary" @click="cancel">取消</el-button>
        <el-button @click="reject">不通过</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
const dayjs = require("dayjs");

import { mapGetters } from "vuex";
import {
  listWithdraw,
  lockorder,
  unlockorder,
  tryCheck,
  withdrawReview,
  rejectReview,
  getAllWithdraw,
} from "@/api/system/withdraw";
export default {
  name: "Withdraw",
  dicts: [
    "user_type", //用户类型
    "app_user_status", //账户是否冻结
    "user_address_type", //地址类型
    "user_buff_type", //包输赢
    "user_asset_type",
    "recharge_order_status",
    "withdraw_order_status",
  ],
  computed: {
    ...mapGetters(["verifiedNum", "rechargeNum", "withdrawNum"]),
  },
  data() {
    return {
      /**总提现金额 */
      allWithdraw: 0,
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
      // 用户提现表格数据
      withdrawList: [],
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
        userId: null,
        username: null,
        address: null,
        amount: null,
        minAmount: "",
        maxAmount: "",
        status: null,
        serialId: null,
        searchValue: null,
        fromAddr: null,
        type: null,
        coin: null,
        ratio: null,
        fee: null,
        withdrawId: null,
        host: null,
        realAmount: null,
        toAdress: null,
        adminUserId: null,
        noticeFlag: null,
        withDrawRemark: null,
        bankName: null,
        bankUserName: null,
        bankBranch: null,
        orderType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [{ required: true, message: "用户不能为空", trigger: "blur" }],
        status: [
          {
            required: true,
            message: "0审核中1成功2失败不能为空",
            trigger: "change",
          },
        ],
      },
      // 列信息
      columns: [
        { key: 0, label: `用户ID`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `用户类型`, visible: true },
        { key: 3, label: `提现地址`, visible: true },
        { key: 4, label: `提现金额`, visible: true },
        { key: 5, label: `审核状态`, visible: true },
        { key: 6, label: `提现类型`, visible: true },
        { key: 7, label: `订单类型`, visible: true },
        { key: 8, label: `提现时间`, visible: true },
        { key: 9, label: `操作时间`, visible: true },
        { key: 10, label: `币种`, visible: true },
        { key: 11, label: `手续费`, visible: true },
        { key: 12, label: `订单号`, visible: true },
        { key: 13, label: `实际金额`, visible: true },
        { key: 14, label: `备注`, visible: true },
        { key: 15, label: `提现说明`, visible: true },
      ],
    };
  },
  watch: {
    withdrawNum() {
      this.getList();
    },
  },
  created() {
    this.getList();
    // this.getAllWithdraw();
  },

  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    /** 查询用户提现列表 */
    getList() {
      this.loading = true;
      if (this.queryParams.params.endTime) {
        const date = new Date(this.queryParams.params.endTime);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        const modifiedDateString = date.toISOString();
        this.queryParams.params.endTime = dayjs(modifiedDateString).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      this.queryParams.orderType = this.queryParams.orderType || 1;
      listWithdraw(this.queryParams).then((response) => {
        this.withdrawList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getAllWithdraw();
    },
    /** 查询总提现金额 */
    getAllWithdraw() {
      let status = "";
      if (this.queryParams.orderType == -1) {
        status = -1;
      } else if (this.queryParams.orderType == 1) {
        status = 2;
      } else if (this.queryParams.orderType == 2) {
        status = 50;
      }
      getAllWithdraw({ type: status }).then((res) => {
        this.allWithdraw = res.data;
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
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        userId: null,
        username: null,
        address: null,
        amount: null,
        status: null,
        serialId: null,
        searchValue: null,
        fromAddr: null,
        type: null,
        coin: null,
        ratio: null,
        fee: null,
        withdrawId: null,
        host: null,
        realAmount: null,
        toAdress: null,
        adminUserId: null,
        noticeFlag: null,
        withDrawRemark: null,
        bankName: null,
        bankUserName: null,
        bankBranch: null,
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
      this.queryParams.minAmount = "";
      this.queryParams.maxAmount = "";
      this.queryParams.params.beginTime = "";
      this.queryParams.params.endTime = "";
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/withdraw/export",
        {
          ...this.queryParams,
        },
        `withdraw_${new Date().getTime()}.xlsx`
      );
    },
    /**审核按钮 */
    review(row) {
      this.reset();
      this.form = row;
      const data = {
        id: row.id,
        toAdress: row.toAdress,
        remark: row.remark,
        withDrawRemark: row.withDrawRemark,
      };
      /**锁定判断 */
      tryCheck(data).then((res) => {
        if (res.code == 200) {
          this.open = true;
        }
      });
    },
    /**查看按钮 */
    lookFor(row) {
      this.form = row;
      this.open = true;
    },
    /** 审核通过按钮 */
    passWithdraw() {
      const data = {
        id: this.form.id,
        toAdress: this.form.toAdress,
        remark: this.form.remark,
        withDrawRemark: this.form.withDrawRemark,
      };
      withdrawReview(data).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.getAllWithdraw();
          this.open = false;
        }
      });
    },
    /** 审核不通过按钮 */
    reject() {
      const data = {
        id: this.form.id,
        toAdress: this.form.toAdress,
        remark: this.form.remark,
        withDrawRemark: this.form.withDrawRemark,
      };
      rejectReview(data).then((res) => {
        if (res.code == 200) {
          this.getList();

          this.open = false;
          this.reset();
        }
      });
    },
    /** 锁定按钮 */
    lockWithdraw(row) {
      const data = {
        id: row.id,
        toAdress: row.toAdress,
        remark: row.remark,
        withDrawRemark: row.withDrawRemark,
      };

      this.$modal
        .confirm(
          "是否" +
            (!["rxce"].includes(this.VUE_APP_ENV) ? "锁定" : "冻结") +
            '"' +
            row.id +
            '"的数据项？'
        )
        .then(function () {
          return lockorder(data);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess(
            `${!["rxce"].includes(this.VUE_APP_ENV) ? "锁定" : "冻结"}成功`
          );
        })
        .catch(() => {});
    },
    /** 解锁按钮 */
    unLockWithdraw(row) {
      unlockorder;
      const data = {
        id: row.id,
        toAdress: row.toAdress,
        remark: row.remark,
        withDrawRemark: row.withDrawRemark,
      };
      this.$modal
        .confirm('是否解除"' + row.id + '"的数据项？')
        .then(function () {
          return unlockorder(data);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("解锁成功");
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.amount .el-input {
  width: 50px;
}
.picker {
  display: flex;
  justify-content: space-between;
}
:deep(.el-date-editor) {
  width: 120px;
  .el-input {
    width: 100px;
  }
}
</style>
