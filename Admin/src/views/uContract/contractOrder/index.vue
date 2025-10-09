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
        ><el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            placeholder="请输入订单编号"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable>
            <el-option
              v-for="dict in dict.type.sys_contract_status"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>
      <el-table
        height="calc(100vh - 400px)"
        border
        v-loading="loading"
        :data="contractOrderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column
          label="订单编号"
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
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column
          label="交易类型"
          align="center"
          prop="type"
          width="100"
        >
          <template slot-scope="scope">
            <dict-tag
              size="small"
              :options="dict.type.sys_ucontract_tradetype"
              :value="scope.row.type"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="委托类型"
          align="center"
          prop="delegateType"
          width="100"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_ucontract_delegatetype"
              :value="scope.row.delegateType"
            />
          </template>
        </el-table-column>

        <el-table-column label="状态" align="center" prop="status" width="100">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_contract_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="交易币种" align="center" prop="symbol" />
        <el-table-column label="杠杆" align="center" prop="leverage" />
        <el-table-column label="委托总量" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.delegateTotal }}</span>
          </template>
        </el-table-column>
        <el-table-column label="委托价格" align="center" prop="delegatePrice" />
        <el-table-column label="委托价值" align="center" prop="delegateValue" />
        <el-table-column label="已成交量" align="center" prop="dealNum" />
        <el-table-column label="成交价" align="center" prop="dealPrice" />
        <el-table-column label="成交价值" align="center" prop="dealValue" />
        <el-table-column label="手续费" align="center" prop="fee" />
        <el-table-column
          label="委托时间"
          align="center"
          prop="delegateTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.delegateTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="成交时间"
          align="center"
          prop="delegateTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.delegateTime) }}</span>
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
    <!-- 添加或修改U本位委托对话框 -->
    <!-- <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="委托总量" prop="delegateTotal">
          <el-input v-model="form.delegateTotal" placeholder="请输入委托总量" />
        </el-form-item>
        <el-form-item label="委托价格" prop="delegatePrice">
          <el-input v-model="form.delegatePrice" placeholder="请输入委托价格" />
        </el-form-item>
        <el-form-item label="已成交量" prop="dealNum">
          <el-input v-model="form.dealNum" placeholder="请输入已成交量" />
        </el-form-item>
        <el-form-item label="成交价" prop="dealPrice">
          <el-input v-model="form.dealPrice" placeholder="请输入成交价" />
        </el-form-item>
        <el-form-item label="委托价值" prop="delegateValue">
          <el-input v-model="form.delegateValue" placeholder="请输入委托价值" />
        </el-form-item>
        <el-form-item label="成交价值" prop="dealValue">
          <el-input v-model="form.dealValue" placeholder="请输入成交价值" />
        </el-form-item>
        <el-form-item label="委托时间" prop="delegateTime">
          <el-date-picker
            clearable
            v-model="form.delegateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择委托时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="成交时间" prop="delegateTime">
          <el-date-picker
            clearable
            v-model="form.delegateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择成交时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="交易币种" prop="coinSymbol">
          <el-input v-model="form.coinSymbol" placeholder="请输入交易币种" />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input v-model="form.orderNo" placeholder="请输入订单编号" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="手续费" prop="fee">
          <el-input v-model="form.fee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="基础币种" prop="baseCoin">
          <el-input v-model="form.baseCoin" placeholder="请输入基础币种" />
        </el-form-item>
        <el-form-item label="杠杆" prop="leverage">
          <el-input v-model="form.leverage" placeholder="请输入杠杆" />
        </el-form-item>
        <el-form-item label="交易对" prop="symbol">
          <el-input v-model="form.symbol" placeholder="请输入交易对" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog> -->
  </div>
</template>

<script>
import { listContractOrder } from "@/api/bussiness/contractOrder";

export default {
  name: "ContractOrder",
  dicts: [
    "sys_contract_status",
    "sys_ucontract_tradetype",
    "sys_ucontract_delegatetype",
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
      // U本位委托表格数据
      contractOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        delegateType: null,
        status: null,
        delegateTotal: null,
        delegatePrice: null,
        dealNum: null,
        dealPrice: null,
        delegateValue: null,
        dealValue: null,
        delegateTime: null,
        delegateTime: null,
        coinSymbol: null,
        orderNo: null,
        userId: null,
        fee: null,
        baseCoin: null,
        leverage: null,
        symbol: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          {
            required: true,
            message: "(0 买多 1卖空)不能为空",
            trigger: "change",
          },
        ],
        delegateType: [
          { required: true, message: "委托类型不能为空", trigger: "change" },
        ],
        orderNo: [
          { required: true, message: "订单编号不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" },
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

    /** 查询U本位委托列表 */
    getList() {
      this.loading = true;
      listContractOrder(this.queryParams).then((response) => {
        this.contractOrderList = response.rows;
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
        type: null,
        delegateType: null,
        status: null,
        delegateTotal: null,
        delegatePrice: null,
        dealNum: null,
        dealPrice: null,
        delegateValue: null,
        dealValue: null,
        delegateTime: null,
        delegateTime: null,
        coinSymbol: null,
        createTime: null,
        orderNo: null,
        userId: null,
        updateTime: null,
        fee: null,
        baseCoin: null,
        leverage: null,
        symbol: null,
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

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bussiness/contractOrder/export",
        {
          ...this.queryParams,
        },
        `contractOrder_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
