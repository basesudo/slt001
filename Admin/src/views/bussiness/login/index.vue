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
        <el-form-item label="IP" prop="ipaddr">
          <el-input
            v-model="queryParams.ipaddr"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="登陆地点" prop="loginLocation">
          <el-input
            v-model="queryParams.loginLocation"
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
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:log:export']"
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
        :data="logList"
        @sort-change="sortTableFun"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" />
        <el-table-column label="用户ID" align="center" prop="userId" />

        <el-table-column label="访问IP" align="center" prop="ipaddr" />
        <el-table-column label="访问位置" align="center" prop="loginLocation" />
        <el-table-column label="浏览器" align="center" prop="browser" />
        <el-table-column label="系统OS" align="center" prop="os" />
        <el-table-column label="登录状态" align="center" prop="status" />
        <el-table-column
          label="登录时间"
          sortable
          align="center"
          prop="loginTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.loginTime, "{y}-{m}-{d}") }}</span>
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
import { listLog } from "@/api/bussiness/log";

export default {
  name: "Log",
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
      // 系统访问记录表格数据
      logList: [],
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
        ipaddr: null,
        loginLocation: null,
        browser: null,
        os: null,
        status: null,
        msg: null,
        loginTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: [
          { required: true, message: "登录用户ID不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
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
      this.queryParams["orderByColumn"] = "loginTime";
      this.queryParams["isAsc"] = this.order;
      listLog(this.queryParams).then((response) => {
        this.rechargeList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询系统访问记录列表 */
    getList() {
      this.loading = true;
      listLog(this.queryParams).then((response) => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        userId: null,
        username: null,
        ipaddr: null,
        loginLocation: null,
        browser: null,
        os: null,
        status: null,
        msg: null,
        loginTime: null,
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
        "system/log/export",
        {
          ...this.queryParams,
        },
        `log_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
