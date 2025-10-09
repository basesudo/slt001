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
            placeholder="请输入用户ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="订单编号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- <el-form-item label="成交价值" prop="dealValue">
          <el-input
            v-model="queryParams.dealValue"
            placeholder="请输入成交价值"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="委托时间" prop="delegateTime">
          <el-date-picker
            clearable
            v-model="queryParams.delegateTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择委托时间"
          >
          </el-date-picker>
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
            v-hasPermi="['bussiness:order:export']"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 400px)"
        border
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
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
        <el-table-column label="交易币种/结算币种" align="center" width="80"
          ><template slot-scope="scope">
            <div>{{ scope.row.symbol }}/{{ scope.row.coin }}</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="" align="center" prop="coin" /> -->
        <el-table-column label="订单类型" align="center">
          <template slot-scope="scope">
            <el-tag type="primary" size="mini" plain v-if="scope.row.type == 0">
              买入
            </el-tag>
            <el-tag
              type="warning"
              size="mini"
              plain
              v-else-if="scope.row.type == 1"
            >
              卖出
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="委托类型" align="center">
          <template slot-scope="scope">
            <el-tag
              type="warning"
              size="mini"
              plain
              v-if="scope.row.delegateType == 0"
            >
              限价
            </el-tag>
            <el-tag
              type="primary"
              size="mini"
              plain
              v-else-if="scope.row.delegateType == 1"
            >
              市价
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              size="mini"
              plain
              v-if="scope.row.status == 0"
            >
              待成交
            </el-tag>
            <el-tag
              type="success"
              size="mini"
              plain
              v-else-if="scope.row.status == 1"
            >
              已成交
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.status == 3"
            >
              已撤销
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="手续费" align="center" prop="fee" />
        <el-table-column label="委托总量" align="center" prop="delegateTotal" />
        <el-table-column label="委托价格" align="center" prop="delegatePrice" />
        <el-table-column label="已成交量" align="center" prop="dealNum" />
        <el-table-column label="成交价" align="center" prop="dealPrice" />
        <el-table-column label="委托价值" align="center" prop="delegateValue" />
        <el-table-column label="成交价值" align="center" prop="dealValue" />
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
          prop="dealTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dealTime) }}</span>
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
  </div>
</template>

<script>
import { listOrder } from "@/api/bussiness/currencyOrder";

export default {
  name: "Order",
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
      // 币币交易订单表格数据
      orderList: [],
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
        orderNo: null,
        symbol: null,
        coin: null,
        fee: null,
        delegateTotal: null,
        delegatePrice: null,
        dealNum: null,
        dealPrice: null,
        delegateValue: null,
        dealValue: null,
        delegateTime: null,
        dealTime: null,
        userId: null,
        searchValue: null,
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
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    /** 查询币币交易订单列表 */
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
        type: null,
        delegateType: null,
        status: null,
        orderNo: null,
        symbol: null,
        coin: null,
        fee: null,
        delegateTotal: null,
        delegatePrice: null,
        dealNum: null,
        dealPrice: null,
        delegateValue: null,
        dealValue: null,
        delegateTime: null,
        dealTime: null,
        userId: null,
        createTime: null,
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
