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
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="语言" prop="languageName" width="100%">
          <el-select v-model="queryParams.languageName" clearable>
            <el-option
              v-for="dict in dict.type.t_app_language"
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:setter:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:setter:edit']"
            >修改</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:setter:remove']"
            >删除</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="setterList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" align="center" />

        <el-table-column label="标题" align="center" prop="title" width="100" />

        <el-table-column label="图片" align="center" prop="imgUrl" width="100">
          <template slot-scope="scope">
            <el-image
              style="width: 60px; height: auto"
              :src="scope.row.imgUrl"
              :preview-src-list="[scope.row.imgUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" width="50" />

        <el-table-column
          label="语言"
          align="center"
          prop="languageName"
          width="80"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_app_language"
              :value="scope.row.languageName"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="点赞数"
          align="center"
          prop="likesNum"
          width="80"
        />
        <el-table-column
          label="类型"
          align="center"
          prop="homeType"
          width="80"
        />
        <el-table-column
          label="功能"
          align="center"
          prop="modelType"
          width="100"
        >
          <template slot-scope="scope">
            <el-tag
              size="mini"
              type="warning"
              round
              v-if="scope.row.modelType == 0"
              >{{ modelTypeList[0] }}</el-tag
            >
            <el-tag
              size="mini"
              type="success"
              round
              v-else-if="scope.row.modelType == 1"
              >{{ modelTypeList[1] }}</el-tag
            >
            <el-tag
              size="mini"
              type="primary"
              round
              v-else-if="scope.row.modelType == 2"
              >{{ modelTypeList[2] }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" prop="content">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.content }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="150px"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:setter:edit']"
              >修改</el-button
            >
            <el-button
              size="small"
              plain
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:setter:remove']"
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
    /></TableContentBox>

    <!-- 添加或修改规则说明对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="700px"
      append-to-body
      @close="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="功能" prop="modelType">
          <!-- <el-input v-model="form.modelType" /> -->
          <el-select v-model="showModelValue" clearable @change="change">
            <el-option label="首页" value="0" />
            <el-option label="difi挖矿" value="1" />
            <el-option label="助理贷" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="图片" prop="imgUrl">
          <ImageUpload :limit="1" v-model="form.imgUrl"></ImageUpload>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item label="语言" prop="languageName" width="100%">
          <el-select v-model="form.languageName" clearable>
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="点赞数" prop="likesNum">
          <el-input v-model="form.likesNum" />
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
  listSetter,
  getSetter,
  delSetter,
  addSetter,
  updateSetter,
} from "@/api/system/setter";

export default {
  name: "Setter",
  dicts: ["t_app_language"],
  data() {
    return {
      showModelValue: "",
      showModelType: 0,
      modelTypeList: ["首页", "defi挖矿", "助理贷"],
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
      // 规则说明表格数据
      setterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        author: null,
        content: null,
        imgUrl: null,
        sort: null,
        status: null,
        languageName: null,
        likesNum: null,
        homeType: null,
        modelType: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        sort: [{ required: true, message: "排序不能为空", trigger: "blur" }],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" },
        ],
        homeType: [
          { required: true, message: "类型不能为空", trigger: "change" },
        ],
        imgUrl: [
          { required: true, message: "图片链接不能为空", trigger: "change" },
        ],
        modelType: [
          { required: true, message: "功能不能为空", trigger: "change" },
        ],
        content: [
          { required: true, message: "内容不能为空", trigger: "change" },
        ],
        languageName: [
          { required: true, message: "语言不能为空", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    close() {
      this.showModelValue = "";
    },
    change(e) {
      this.form.modelType = e;
    },
    /** 查询规则说明列表 */
    getList() {
      this.loading = true;
      listSetter(this.queryParams).then((response) => {
        this.setterList = response.rows;
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
        title: null,
        author: null,
        content: null,
        createTime: null,
        imgUrl: null,
        sort: null,
        status: null,
        languageName: null,
        likesNum: null,
        homeType: null,
        modelType: null,
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
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();

      this.open = true;
      this.title = "添加规则说明";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getSetter(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改规则说明";
        this.showModelValue = this.modelTypeList[this.form.modelType];
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateSetter(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addSetter(this.form).then((response) => {
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
        .confirm('是否确认删除规则说明编号为"' + ids + '"的数据项？')
        .then(function () {
          return delSetter(ids);
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
        "bussiness/setter/export",
        {
          ...this.queryParams,
        },
        `setter_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: calc(100% - 580px);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
