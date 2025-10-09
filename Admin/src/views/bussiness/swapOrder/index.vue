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
        <el-form-item label="状态" prop="status">
          <el-select
            v-model="queryParams.status"
            style="width: 150px; margin-right: 10px"
          >
            <el-option label="已提交" value="0"></el-option>
            <el-option label="成功" value="1"></el-option>
            <el-option label="失败" value="2"></el-option>
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
            v-hasPermi="['bussiness:record:export']"
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
        :data="recordList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />

        <el-table-column label="兑换币种" align="center" prop="fromCoin" />
        <el-table-column label="目标币种" align="center" prop="toCoin" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              plain
              v-if="scope.row.status == 0"
            >
              已提交
            </el-button>
            <el-button
              type="success"
              size="mini"
              plain
              v-else-if="scope.row.status == 1"
            >
              成功
            </el-button>
            <el-button
              type="info"
              size="danger"
              plain
              v-else-if="scope.row.status == 2"
            >
              失败
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="金额" align="center" prop="amount" />
        <el-table-column label="创建时间" align="center" prop="createTime" />
        <el-table-column label="备注" align="center" prop="remark" />
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
import { swapRecordList } from "@/api/bussiness/manage";

export default {
  name: "Record",
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
      // 币种兑换记录表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        fromCoin: null,
        toCoin: null,
        userId: null,
        username: null,
        address: null,
        status: null,
        amount: null,
        thirdRate: null,
        systemRate: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        fromCoin: [
          { required: true, message: "$comment不能为空", trigger: "blur" },
        ],
        toCoin: [
          { required: true, message: "$comment不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" },
        ],
        amount: [{ required: true, message: "金额不能为空", trigger: "blur" }],
        createTime: [
          { required: true, message: "$comment不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询币种兑换记录列表 */
    getList() {
      this.loading = true;
      swapRecordList(this.queryParams).then((response) => {
        this.recordList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        fromCoin: null,
        toCoin: null,
        userId: null,
        username: null,
        address: null,
        status: null,
        amount: null,
        thirdRate: null,
        systemRate: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
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
        "bussiness/record/export",
        {
          ...this.queryParams,
        },
        `record_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
