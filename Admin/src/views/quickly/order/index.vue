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
        <el-form-item label="订单号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- 

        <el-form-item label="开盘时间" prop="openTime">
          <el-input
            v-model="queryParams.openTime"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="关盘时间" prop="closeTime">
          <el-input
            v-model="queryParams.closeTime"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->

        <!-- <el-form-item label="订单标记" prop="sign">
          <el-select
            v-model="queryParams.sign"
            style="width: 150px; margin-right: 10px"
          >
            <el-option label="正常 " value="0"></el-option>
            <el-option label="包赢" value="1"></el-option>
            <el-option label="包输" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人工干预" prop="manualIntervention">
          <el-select
            v-model="queryParams.manualIntervention"
            style="width: 150px; margin-right: 10px"
          >
            <el-option label="是 " value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
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
            v-hasPermi="['secondContractOrder:order:export']"
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
        @sort-change="sortTableFun"
        :default-sort="{ prop: 'date', order: 'descending' }"
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column
          label="订单号"
          align="center"
          prop="orderNo"
          width="120"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              v-clipboard="scope.row.orderNo"
              v-clipboard:success="clipboardSuccess"
              >{{ scope.row.orderNo }} <i class="el-icon-copy-document"></i>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="交易对" align="center" prop="symbol" />
        <el-table-column label="周期" align="center" prop="type">
          <template slot-scope="scope">
            <div>{{ scope.row.type }} S</div>
          </template>
        </el-table-column>
        <el-table-column label="预测方向" align="center" prop="betContent">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.coin_quickly_direction"
              :value="scope.row.betContent"
            />
          </template>
        </el-table-column>
        <el-table-column label="订单状态" align="center" prop="status"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.coin_quickly_result"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="开奖结果" align="center" prop="openResult">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.coin_quickly_status"
              :value="scope.row.openResult"
            />
          </template>
        </el-table-column>
        <el-table-column label="投注金额" align="center" prop="betAmount" />
        <el-table-column label="获奖金额" align="center" prop="rewardAmount" />
        <el-table-column
          label="赔偿金额"
          align="center"
          prop="compensationAmount"
        />
        <el-table-column label="开盘价格" align="center" prop="openPrice" />
        <el-table-column label="关盘价格" align="center" prop="closePrice" />
        <el-table-column
          label="开盘时间"
          sortable
          align="center"
          prop="openTime"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.openTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="关盘时间"
          align="center"
          prop="closeTime"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.closeTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交易币种/结算币种" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.coinSymbol }}/{{ scope.row.baseSymbol }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单标记" align="center" prop="sign">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.coin_quickly_sign"
              :value="scope.row.sign"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否人工干预" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              plain
              v-if="scope.row.manualIntervention == 0"
              >是</el-button
            >
            <el-button
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.manualIntervention == 1"
              >否</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="赔率(%)" align="center" prop="rate" />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 0"
              size="medium"
              plain
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['secondContractOrder:order:edit']"
              >输赢设置</el-button
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
      />
    </TableContentBox>
    <!-- 添加或修改秒合约订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单标记 " prop="sign">
          <el-radio-group v-model="form.sign">
            <el-radio :label="0">正常</el-radio>
            <el-radio :label="1">包赢</el-radio>
            <el-radio :label="2">包输</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listOrder,
  getOrder,
  delOrder,
  addOrder,
  updateOrder,
} from "@/api/bussiness/quicklyOrder";

export default {
  name: "Order",
  dicts: [
    "coin_quickly_status",
    "coin_quickly_result",
    "coin_quickly_sign",
    "coin_quickly_intervene",
    "coin_quickly_direction",
  ],
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
      // 秒合约订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderNo: null,
        symbol: null,
        type: null,
        userId: null,
        userAddress: null,
        betContent: null,
        openResult: null,
        status: null,
        betAmount: null,
        rewardAmount: null,
        compensationAmount: null,
        openPrice: null,
        closePrice: null,
        openTime: null,
        closeTime: null,
        coinSymbol: null,
        baseSymbol: null,
        sign: null,
        manualIntervention: null,
        rate: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        orderNo: [
          { required: true, message: "订单号不能为空", trigger: "blur" },
        ],
        symbol: [
          { required: true, message: "交易对不能为空", trigger: "blur" },
        ],
        type: [{ required: true, message: "类型不能为空", trigger: "change" }],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" },
        ],
        userAddress: [
          { required: true, message: "用户地址不能为空", trigger: "blur" },
        ],
        betContent: [
          {
            required: true,
            message: "预测方向:0 涨 1跌不能为空",
            trigger: "blur",
          },
        ],
        status: [
          {
            required: true,
            message: "订单状态 0参与中 1已开奖 2已撤销不能为空",
            trigger: "change",
          },
        ],
        betAmount: [
          { required: true, message: "投注金额不能为空", trigger: "blur" },
        ],
        rewardAmount: [
          { required: true, message: "获奖金额不能为空", trigger: "blur" },
        ],
        compensationAmount: [
          { required: true, message: "赔偿金额不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    /**倒序 */
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
      listOrder(this.queryParams).then((response) => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    /** 查询秒合约订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then((response) => {
        this.orderList = response.rows;
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
        orderNo: null,
        symbol: null,
        type: null,
        userId: null,
        userAddress: null,
        betContent: null,
        openResult: null,
        status: null,
        betAmount: null,
        rewardAmount: null,
        compensationAmount: null,
        createTime: null,
        openPrice: null,
        closePrice: null,
        openTime: null,
        closeTime: null,
        coinSymbol: null,
        baseSymbol: null,
        sign: null,
        manualIntervention: null,
        rate: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加秒合约订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOrder(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改秒合约订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除秒合约订单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delOrder(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bussiness/order/export",
        {
          ...this.queryParams,
        },
        `order_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
