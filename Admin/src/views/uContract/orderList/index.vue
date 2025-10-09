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
        <!-- <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
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
            v-hasPermi="['bussiness:ucontract:export']"
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
        :data="positionList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="委托类型" align="center" prop="delegateType">
          <template slot-scope="scope">
            <dict-tag
              size="mini"
              :options="dict.type.sys_ucontract_delegatetype"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="交易类型" align="center" prop="type"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_ucontract_tradetype"
              :value="scope.row.type"
            />
          </template>
        </el-table-column>
        <el-table-column label="止盈触发价" align="center" prop="earnPrice" />
        <el-table-column
          label="止盈委托价"
          align="center"
          prop="earnDelegatePrice"
        />
        <el-table-column label="止盈数量" align="center" prop="earnNumber" />
        <el-table-column label="止损触发价" align="center" prop="losePrice" />
        <el-table-column
          label="止损委托价"
          align="center"
          prop="loseDelegatePrice"
        />
        <el-table-column label="止损数量" align="center" prop="loseNumber">
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="120"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              plain
              type="primary"
              @click="lookFor(scope.row)"
              v-hasPermi="['bussiness:ucontract:edit']"
              >止盈止损列表</el-button
            >
          </template>
        </el-table-column> -->
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
import { getProfitList } from "@/api/bussiness/position";

export default {
  name: "Position",
  dicts: ["sys_ucontract_tradetype", "sys_ucontract_delegatetype"],
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
      // U本位持仓表表格数据
      positionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        type: null,
        delegateType: null,
        lossType: null,
        earnPrice: null,
        earnDelegatePrice: null,
        earnNumber: null,
        losePrice: null,
        loseDelegatePrice: null,
        loseNumber: null,
        createTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },

    /** 查询止盈止损列表 */
    getList() {
      this.loading = true;
      // this.queryParams.id = this.$route.query.id;
      getProfitList(this.$route.query.id).then((response) => {
        this.positionList = response.rows;
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
        lossType: null,
        earnPrice: null,
        earnDelegatePrice: null,
        earnNumber: null,
        losePrice: null,
        loseDelegatePrice: null,
        loseNumber: null,
        createTime: null,
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
        "bussiness/position/export",
        {
          ...this.queryParams,
        },
        `position_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
