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
        <el-form-item label="充值金额" prop="amount">
          <div class="picker">
            <el-input
              v-model="queryParams.params.minMoney"
              clearable
              placeholder="最小金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
            <span> - </span>
            <el-input
              v-model="queryParams.params.maxMoney"
              clearable
              placeholder="最大金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </div>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="queryParams.status" clearable style="width: 100%">
            <el-option value="0" label="待审核" />
            <el-option value="1" label="通过" />
            <el-option value="2" label="不通过" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单号" prop="serialId">
          <el-input
            v-model="queryParams.serialId"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="充值地址" prop="address">
          <el-input
            v-model="queryParams.address"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="充值类型" prop="type">
          <el-select v-model="queryParams.type" clearable style="width: 100%">
            <el-option
              v-for="coin in rechargeTypeList"
              :key="coin.id"
              :label="coin.coinName"
              :value="coin.coinName"
            />
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
            </el-date-picker>
            &nbsp;至&nbsp;
            <el-date-picker
              clearable
              v-model="queryParams.params.endTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              class="amount"
            >
            </el-date-picker>
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
            <el-option :label="'充值'" :value="1" />
            <el-option :label="'彩金'" :value="2" />
          </el-select>
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
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['system:recharge:export']"
            >导出</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button type="info" plain size="small"
            >总金额{{ allRecharge }}</el-button
          >
        </el-col>

        <right-toolbar
          :columns.sync="columns"
          :showSearch.sync="showSearch"
          pageName="rechargelist"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        @sort-change="sortTableFun"
        :data="rechargeList"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          label="用户ID"
          align="center"
          prop="userId"
          v-if="columns[0].visible"
        >
        </el-table-column>

        <el-table-column
          label="用户名"
          align="center"
          prop="username"
          min-width="120"
          v-if="columns[1].visible"
        />
        <el-table-column
          label="充值金额"
          align="center"
          prop="amount"
          v-if="columns[2].visible"
        />
        <el-table-column
          label="状态"
          align="center"
          prop="status"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.recharge_order_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="用户类型"
          align="center"
          prop="isTest"
          v-if="columns[4].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.user_type"
              :value="scope.row.isTest"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="订单号"
          min-width="130"
          align="center"
          prop="serialId"
          v-if="columns[5].visible"
          ><template slot-scope="scope">
            <el-link
              :underline="false"
              v-clipboard="scope.row.serialId"
              v-clipboard:success="clipboardSuccess"
              >{{ scope.row.serialId }} <i class="el-icon-copy-document"></i>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column
          label="订单类型"
          align="center"
          prop="orderType"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.orderType == 2"> 彩金 </el-tag>
            <el-tag type="info" v-else> 充值 </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="充值类型"
          align="center"
          prop="type"
          v-if="columns[7].visible"
        />
        <el-table-column
          label="充值地址"
          min-width="150"
          align="center"
          prop="address"
          v-if="columns[8].visible"
        />
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
          v-if="columns[9].visible"
        />
        <el-table-column
          label="币种"
          align="center"
          prop="coin"
          v-if="columns[10].visible"
        />

        <el-table-column
          label="充值时间"
          sortable
          align="center"
          prop="createTime"
          min-width="180"
          v-if="columns[11].visible"
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
          v-if="columns[12].visible"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.operateTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="实际到账金额"
          align="center"
          prop="realAmount"
          v-if="columns[13].visible"
        />

        <el-table-column
          label="固定手续费"
          align="center"
          prop="fixed_fee"
          v-if="columns[14].visible"
        />

        <el-table-column
          label="图片"
          align="center"
          prop="fileName"
          v-if="columns[15].visible"
        >
          <template slot-scope="{ row }">
            <el-image
              v-if="row.fileName"
              style="width: 50px; height: 50px"
              :src="row.fileName"
              :preview-src-list="[row.fileName]"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          min-width="80"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1 || scope.row.status == 2"
              size="small"
              plain
              type="success"
              @click="Check(scope.row)"
              v-hasPermi="['bussiness:recharge:query']"
              >查看</el-button
            >
            <el-button
              v-else
              plain
              size="small"
              type="warning"
              v-hasPermi="['bussiness:recharge:query']"
              @click="review(scope.row)"
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
    /></TableContentBox>

    <!-- 添加或修改用户充值对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="充值币种" prop="coin">
          <el-input v-model="form.coin" disabled />
        </el-form-item>
        <el-form-item label="实际到账金额" prop="realAmount">
          <el-input
            v-model="form.realAmount"
            placeholder="请输入实际到账金额"
          />
        </el-form-item>
        <el-form-item label="充值说明" prop="rechargeRemark">
          <el-input v-model="form.rechargeRemark" type="textarea" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="pass"
          v-hasPermi="['bussiness:recharge:passOrder']"
          >通过</el-button
        >
        <el-button @click="canceled">关闭</el-button>
        <el-button
          @click="close"
          type="warning"
          v-hasPermi="['bussiness:recharge:failedOrder']"
          >不通过</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
const dayjs = require("dayjs");

import { mapGetters } from "vuex";
import {
  listRecharge,
  getRecharge,
  passRecharge,
  unRecharge,
} from "@/api/system/recharge";

import {
  getRechargeConfig,
  getAllRecharge,
} from "@/api/bussiness/rechargeRebate";
export default {
  name: "Recharge",
  dicts: [
    "user_type", //用户类型
    "app_user_status", //账户是否冻结
    "user_address_type", //地址类型
    "user_buff_type", //包输赢
    "user_asset_type",
    "recharge_order_status",
  ],
  computed: {
    ...mapGetters(["verifiedNum", "rechargeNum", "withdrawNum"]),
  },
  data() {
    return {
      /**总充值金额 */
      allRecharge: 0,
      /**充值类型 */
      rechargeTypeList: [],
      order: "desc",
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
      // 用户充值表格数据
      rechargeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        username: null,
        // amount: null,//充值金额
        params: {
          minMoney: "",
          maxMoney: "",
          beginTime: "",
          endTime: "",
        },
        bonus: null,
        status: null,

        serialId: null, //订单号
        type: null,
        searchValue: null,
        address: null,
        tree: null,
        coin: null, //币种
        toAddress: null,
        blockTime: null,
        host: null,
        realAmount: null, //到账金额
        fileName: null,
        rechargeRemark: null,
        noticeFlag: null,
        appParentIds: null,
        adminParentIds: null,
        isTest: null,
        orderType: null,
      },
      // 表单参数
      form: {},
      // reviewForm: {
      //   id: undefined,
      //   rechargeRemark: undefined,
      //   remark: undefined,
      // },
      // 表单校验
      rules: {
        rechargeRemark: [
          { required: true, message: "充值说明不能为空", trigger: "change" },
        ],
        remark: [
          { required: true, message: "备注不能为空", trigger: "change" },
        ],
      },
      // 列信息
      columns: [
        { key: 0, label: `用户ID`, visible: true },
        { key: 1, label: `用户名`, visible: true },
        { key: 2, label: `充值金额`, visible: true },
        { key: 3, label: `状态`, visible: true },
        { key: 4, label: `用户类型`, visible: true },
        { key: 5, label: `订单号`, visible: true },
        { key: 6, label: `订单类型`, visible: true },
        { key: 7, label: `充值类型`, visible: true },
        { key: 8, label: `充值地址`, visible: true },
        { key: 9, label: `备注`, visible: true },
        { key: 10, label: `币种`, visible: true },
        { key: 11, label: `充值时间`, visible: true },
        { key: 12, label: `操作时间`, visible: true },
        { key: 13, label: `实际到账金额`, visible: true },
        { key: 14, label: `固定手续费`, visible: true },
        { key: 15, label: `图片`, visible: true },
      ],
    };
  },
  watch: {
    rechargeNum() {
      this.getList();
    },
  },
  created() {
    this.getList();
    // this.getRecharge();
  },
  mounted() {
    getRechargeConfig("ASSET_COIN").then((res) => {
      this.rechargeTypeList = res.data;
    });
  },
  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    sortTableFun(column) {
      this.column = column.prop;
      if (column.prop) {
        if (column.order == "ascending") {
          this.order = "asc";
        } else if (column.order == "descending") {
          this.order = "desc";
        }
        this.indexQueryListFun();
      }
    },

    indexQueryListFun() {
      //发起后端请求的接口
      this.queryParams["orderByColumn"] = "createTime";
      this.queryParams["isAsc"] = this.order;
      listRecharge(this.queryParams).then((response) => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询用户充值列表 */
    getList() {
      this.loading = true;
      this.queryParams["orderByColumn"] = "createTime";
      this.queryParams["isAsc"] = this.order;

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
      listRecharge(this.queryParams).then((response) => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      this.getRecharge();
    },

    /** 查询用户充值列表 */
    getRecharge() {
      let status =
        this.queryParams.orderType == 2 ? 3 : this.queryParams.orderType;
      getAllRecharge({ type: status }).then((res) => {
        this.allRecharge = res.data;
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
        amount: null,
        bonus: null,
        status: null,
        serialId: null,
        type: null,
        searchValue: null,
        address: null,
        tree: null,
        coin: null,
        toAddress: null,
        blockTime: null,
        host: null,
        realAmount: null,
        fileName: null,
        rechargeRemark: null,
        noticeFlag: null,
        appParentIds: null,
        adminParentIds: null,
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
      this.queryParams.params.minMoney = "";
      this.queryParams.params.maxMoney = "";
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

    /**查看详情 */
    Check(row) {
      this.reset();
      const id = row.id || this.ids;
      this.$router.push(`/deposit/detail?id=${id}`);
      // this.$router.push("/deposit/detail");
    },

    /**审核按钮操作 */
    review(row) {
      const id = row.id || this.ids;
      this.form.id = id;
      getRecharge(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "审核充值订单";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/recharge/export",
        {
          ...this.queryParams,
        },
        `recharge_${new Date().getTime()}.xlsx`
      );
    },
    passRecharge() {
      passRecharge(this.form).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.reset();
        this.getList();
      });
    },

    unRecharge() {
      unRecharge(this.form).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.reset();
        this.getList();
      });
    },
    pass() {
      this.passRecharge();
      this.getRecharge();
      this.open = false;
    },
    close() {
      this.unRecharge();
      this.open = false;
      this.getList();
      this.getRecharge();
    },
    canceled() {
      this.open = false;
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
.amount .el-input {
  width: 100px;
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
