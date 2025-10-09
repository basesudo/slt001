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
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="操作人" prop="opertorId">
          <el-input
            v-model="queryParams.opertorId"
            placeholder="请输入操作人"
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
            v-hasPermi="['bussiness:mail:add']"
            >新增</el-button
          >
        </el-col>

        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:mail:export']"
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
        :data="mailList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" align="center" />
        <!-- <el-table-column label="${comment}" align="center" prop="id" /> -->
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="内容" align="center" prop="content" />
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              round
              v-if="scope.row.type == 1"
              >普通消息</el-button
            >
            <el-button
              size="mini"
              type="warning"
              round
              v-else-if="scope.row.type == 2"
              >全站消息</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="读取状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag
              size="mini"
              type="danger"
              round
              v-if="scope.row.status == 0"
              >未读</el-tag
            >
            <el-tag
              size="mini"
              type="info"
              round
              v-else-if="scope.row.status == 1"
              >已读</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作人" align="center" prop="opertorId" />

        <el-table-column
          label="操作"
          align="center"
          width="80"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
                <!-- <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['bussiness:mail:edit']"
            >修改</el-button
          > -->
                <el-button
                  size="small"
                  type="danger"
                  plain
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['bussiness:mail:remove']"
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
    <!-- 添加或修改1v1站内信对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="类型" prop="type">
          <el-select
            v-model="form.type"
            style="width: 100%; margin-right: 10px"
          >
            <el-option label="普通消息" value="1"></el-option>
            <el-option label="全站消息" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId" v-if="form.type != 2">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>

        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192" />
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
import { listMail, delMail, addMail } from "@/api/system/mail";

export default {
  name: "Mail",
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
      // 1v1站内信表格数据
      mailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        title: null,
        content: null,
        type: null,
        status: null,
        opertorId: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [{ required: true, message: "类型不能为空", trigger: "change" }],
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询1v1站内信列表 */
    getList() {
      this.loading = true;
      listMail(this.queryParams).then((response) => {
        this.mailList = response.rows;
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
        userId: null,
        title: null,
        content: null,
        type: null,
        status: null,
        opertorId: null,
        createTime: null,
        updateTime: null,
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
      this.title = "添加1v1站内信";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMail(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改1v1站内信";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMail(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let data = {
              userIds: this.form.userId,
              title: this.form.title,
              content: this.form.content,
              type: this.form.type,
            };
            addMail(data).then((response) => {
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
        .confirm('是否确认删除1v1站内信编号为"' + ids + '"的数据项？')
        .then(function () {
          return delMail(ids);
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
        "bussiness/mail/export",
        {
          ...this.queryParams,
        },
        `mail_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
