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
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="请输入名称"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属链图标" prop="coinUrl">
          <el-input
            v-model="queryParams.coinUrl"
            placeholder="请输入所属链图标"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易总价格" prop="tradeAmount">
          <el-input
            v-model="queryParams.tradeAmount"
            placeholder="请输入交易总价格"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易次数" prop="tradeNum">
          <el-input
            v-model="queryParams.tradeNum"
            placeholder="请输入交易次数"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地板价格" prop="aveAmount">
          <el-input
            v-model="queryParams.aveAmount"
            placeholder="请输入地板价格"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="封面" prop="logoUrl">
          <el-input
            v-model="queryParams.logoUrl"
            placeholder="请输入封面"
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:series:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:series:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:series:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['bussiness:series:export']"
            >导出</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        border
        v-loading="loading"
        :data="seriesList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="所属链" align="center" prop="chainType" />
        <el-table-column label="所属链图标" align="center" prop="coinUrl" />
        <el-table-column label="交易总价格" align="center" prop="tradeAmount" />
        <el-table-column label="交易次数" align="center" prop="tradeNum" />
        <el-table-column label="地板价格" align="center" prop="aveAmount" />
        <el-table-column label="封面" align="center" prop="logoUrl" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column label="${comment}" align="center" prop="searchValue" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:series:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:series:remove']"
              >删除</el-button
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
    <!-- 添加或修改nft合集对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="所属链图标" prop="coinUrl">
          <ImageUpload :limit="1" v-model="queryParams.coinUrl"></ImageUpload>
        </el-form-item>
        <el-form-item label="交易总价格" prop="tradeAmount">
          <el-input v-model="form.tradeAmount" placeholder="请输入交易总价格" />
        </el-form-item>
        <el-form-item label="交易次数" prop="tradeNum">
          <el-input v-model="form.tradeNum" placeholder="请输入交易次数" />
        </el-form-item>
        <el-form-item label="地板价格" prop="aveAmount">
          <el-input v-model="form.aveAmount" placeholder="请输入地板价格" />
        </el-form-item>
        <el-form-item label="封面" prop="logoUrl">
          <el-input v-model="form.logoUrl" placeholder="请输入封面" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="${comment}" prop="searchValue">
          <el-input
            v-model="form.searchValue"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="0=正常 1=删除" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="请输入0=正常 1=删除" />
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
  listSeries,
  getSeries,
  delSeries,
  addSeries,
  updateSeries,
} from "@/api/nft/series";

export default {
  name: "Series",
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
      // nft合集表格数据
      seriesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        name: null,
        chainType: null,
        coinUrl: null,
        tradeAmount: null,
        tradeNum: null,
        aveAmount: null,
        logoUrl: null,
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
    /** 查询nft合集列表 */
    getList() {
      this.loading = true;
      listSeries(this.queryParams).then((response) => {
        this.seriesList = response.rows;
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
        name: null,
        chainType: null,
        coinUrl: null,
        tradeAmount: null,
        tradeNum: null,
        aveAmount: null,
        logoUrl: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        delFlag: null,
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
      this.title = "添加nft合集";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSeries(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改nft合集";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSeries(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSeries(this.form).then((response) => {
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
        .confirm('是否确认删除nft合集编号为"' + ids + '"的数据项？')
        .then(function () {
          return delSeries(ids);
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
        "bussiness/series/export",
        {
          ...this.queryParams,
        },
        `series_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
