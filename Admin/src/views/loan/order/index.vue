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
        <el-form-item label="贷款金额" prop="amount">
          <!-- <el-input
            v-model="queryParams.amount"
            clearable
            @keyup.enter.native="handleQuery"
          /> -->
          <el-input
            v-model="queryParams.params.amountMin"
            clearable
            placeholder="最小金额"
            @keyup.enter.native="handleQuery"
            class="amount"
          />
          <span> - </span>
          <el-input
            v-model="queryParams.params.amountMax"
            clearable
            placeholder="最大金额"
            @keyup.enter.native="handleQuery"
            class="amount"
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
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:loadOrder:export']"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="loadOrderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="贷款商品ID" align="center" prop="proId" />
        <el-table-column label="贷款金额" align="center" prop="amount" />
        <el-table-column label="贷款利率%" align="center" prop="rate" />
        <el-table-column label="利息" align="center" prop="interest" />
        <el-table-column label="周期" align="center" prop="cycleType" />
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-button
              size="small"
              type="warning"
              plain
              v-if="scope.row.status == 0"
              >待审核</el-button
            >
            <el-button
              size="small"
              type="success"
              plain
              v-else-if="scope.row.status == 1"
              >成功</el-button
            >
            <el-button
              size="small"
              type="info"
              plain
              v-else-if="scope.row.status == 2"
              >失败</el-button
            >
            <el-button
              size="small"
              type="success"
              plain
              v-else-if="scope.row.status == 3"
              >已结清</el-button
            >
            <el-button
              size="small"
              type="info"
              plain
              v-else-if="scope.row.status == 4"
              >已逾期</el-button
            >
          </template></el-table-column
        >
        <el-table-column
          label="放款日期"
          align="center"
          prop="disburseTime"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.disburseTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="最后还款日"
          align="center"
          prop="finalRepayTime"
          width="100"
        >
          <template slot-scope="scope">
            <span>{{
              parseTime(scope.row.finalRepayTime)
            }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="审批金额"
          align="center"
          prop="disburseAmount"
        />

        <el-table-column label="手持身份证" align="center" width="100">
          <!-- <template slot-scope="scope">
            <a :href="scope.row.cardUrl" target="_blank">{{
              scope.row.cardUrl | imgLoad
            }}</a>
          </template> -->
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.cardUrl"
              :preview-src-list="[scope.row.cardUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="身份证正面" align="center" width="100">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.cardBackUrl"
              :preview-src-list="[scope.row.cardBackUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="身份证反面" align="center" width="100">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.capitalUrl"
              :preview-src-list="[scope.row.capitalUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column label="${comment}" align="center" prop="licenseUrl" /> -->

        <el-table-column label="用户备注" align="center" prop="remark" />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              plain
              size="small"
              type="primary"
              @click="review(scope.row)"
              v-hasPermi="['bussiness:load:order:edit']"
              v-if="scope.row.status == 0"
              >审核</el-button
            >
            <el-button
              plain
              size="small"
              type="success"
              @click="review(scope.row)"
              v-hasPermi="['bussiness:load:order:query']"
              v-if="scope.row.status == 3"
            >
              查看
            </el-button>
            <el-button
              size="small"
              type="primary"
              plain
              v-hasPermi="['bussiness:load:order:edit']"
              @click="repaymentAmount(scope.row)"
              v-if="scope.row.status == 1"
            >
              还款
            </el-button>
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
    <!-- 添加或修改贷款订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="贷款商品" prop="proId">
          <el-input v-model="form.proId" placeholder="请输入贷款商品表id" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="贷款金额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入贷款金额" />
        </el-form-item>
        <el-form-item label="贷款利率" prop="rate">
          <el-input v-model="form.rate" placeholder="请输入贷款利率" />
        </el-form-item>
        <el-form-item label="利息" prop="interest">
          <el-input v-model="form.interest" placeholder="请输入利息" />
        </el-form-item>

        <el-form-item label="审批金额" prop="disburseAmount">
          <el-input
            v-model="form.disburseAmount"
            placeholder="请输入审批金额"
          />
        </el-form-item>

        <el-form-item label="用户备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="pass"
          v-hasPermi="['bussiness:loadOrder:passTLoadOrder']"
          >通过</el-button
        >
        <el-button @click="canceled">关闭</el-button>
        <el-button
          @click="close"
          type="warning"
          v-hasPermi="['bussiness:loadOrder:refuseTLoadOrder']"
          >不通过</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listLoadOrder,
  passTLoadOrder,
  refuseTLoadOrder,
  getLoadOrder,
  repayment,
} from "@/api/bussiness/loanOrder";

export default {
  name: "LoadOrder",
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
      // 贷款订单表格数据
      loadOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        proId: null,
        userId: null,
        // amount: null,
        params: { amountMin: "", amountMax: "" },
        rate: null,
        interest: null,
        status: null,
        finalRepayTime: null,
        disburseTime: null,
        returnTime: null,
        disburseAmount: null,
        adminParentIds: null,
        cardUrl: null,
        cardBackUrl: null,
        capitalUrl: null,
        licenseUrl: null,
        orderNo: null,
        cycleType: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        disburseAmount: [
          { required: true, message: "审批金额不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询贷款订单列表 */
    getList() {
      this.loading = true;
      listLoadOrder(this.queryParams).then((response) => {
        this.loadOrderList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /**审核 */
    review(row) {
      this.reset();
      const id = row.id || this.ids;
      getLoadOrder(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "贷款订单审核";
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        proId: null,
        userId: null,
        createTime: null,
        amount: null,
        rate: null,
        interest: null,
        status: null,
        finalRepayTime: null,
        disburseTime: null,
        returnTime: null,
        disburseAmount: null,
        adminParentIds: null,
        cardUrl: null,
        cardBackUrl: null,
        capitalUrl: null,
        licenseUrl: null,
        orderNo: null,
        cycleType: null,
        remark: null,
        createBy: null,
        updateBy: null,
        updateTime: null,
        searchValue: null,
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
    /** 还款 */
    repaymentAmount(row) {
      const id = row.id;
      this.$modal
        .confirm("确定要结清订单吗")
        .then(function () {
          return repayment({ id });
        })
        .then(() => {
          this.$modal.msgSuccess("还款成功");
          this.getList();
        })
        .catch(() => {
          this.$modal.msgError("还款失败");
          this.getList();
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bussiness/loadOrder/export",
        {
          ...this.queryParams,
        },
        `loadOrder_${new Date().getTime()}.xlsx`
      );
    },
    /**订单审核通过 */
    passTLoadOrder() {
      let msg = false;
      if (!this.form.disburseAmount) {
        msg = "审批金额不能为空";
      }
      if (msg) {
        return this.$message.error(msg);
      } else {
        let data = {
          id: this.form.id,
          rate: this.form.rate,
          proId: this.form.proId,
          userId: this.form.userId,
          amount: this.form.amount,
          disburseAmount: this.form.disburseAmount,
          interest: this.form.interest,
          cycleType: this.form.cycleType,
        };
        passTLoadOrder(data).then((res) => {
          if (res.code == 200) {
            this.$modal.msgSuccess(res.msg);
            this.getList();
            this.open = false;
          }
        });
      }
    },
    /**订单审核失败 */
    refuseTLoadOrder() {
      let data = {
        id: this.form.id,
        remark: this.form.remark,
      };
      refuseTLoadOrder(data).then(() => {});
    },

    pass() {
      this.passTLoadOrder();
    },
    close() {
      this.refuseTLoadOrder();
      this.open = false;
    },
    canceled() {
      this.open = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.amount.el-input {
  width: 100px;
}
</style>
