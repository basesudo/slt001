<template>
  <div class="app-container">
    <!-- :name="`'${index}'`" -->
    <el-tabs v-model="navIndex" @tab-click="handleClick">
      <el-tab-pane
        :label="item.value"
        :name="item.key"
        v-for="item in actionList"
        :key="item.key"
      ></el-tab-pane>
    </el-tabs>
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
        <el-form-item label="语言" prop="language" width="100%">
          <el-select v-model="queryParams.language" clearable>
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <!-- prop="isShow" -->
        <el-form-item label="是否展示">
          <el-select v-model="queryParams.isShow" placeholder="是否展示">
            <el-option label="展示" value="0"></el-option>
            <el-option label="不展示" value="2"></el-option>
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
            v-hasPermi="['bussiness:rules:add']"
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
            v-hasPermi="['bussiness:rules:export']"
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
        :data="rulesList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" align="center" />
        <!-- <el-table-column label="ID" align="center" prop="id" /> -->
        <el-table-column label="标题" align="center" prop="title" width="120" />
        <el-table-column
          label="语言"
          align="center"
          prop="language"
          width="120"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_app_language"
              :value="scope.row.language"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="是否展示"
          align="center"
          prop="isShow"
          width="80"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="warning"
              plain
              v-if="scope.row.isShow == 0"
              >是</el-button
            >
            <el-button
              size="mini"
              type="info"
              plain
              v-else-if="scope.row.isShow == 2"
              >否</el-button
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
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:rules:edit']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:rules:remove']"
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

    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入标题" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="form.language" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="是否展示" prop="isShow">
          <el-switch
            v-model="form.isShow"
            :active-value="0"
            :inactive-value="2"
          ></el-switch>
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
// getRules,
import {
  listRules,
  delRules,
  addRules,
  updateRules,
  getLabelList,
  getRules,
} from "@/api/system/rules";
import { listData } from "@/api/system/dict/data";
export default {
  name: "Rules",
  dicts: ["t_app_language"],
  data() {
    return {
      // 当前选中
      navIndex: "",
      navId: "",
      activeName: 1,
      actionList: [],
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
      // 前台文本配置表格数据
      rulesList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        language: null,
        content: null,
        isShow: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    getLabelList().then((res) => {
      this.actionList = res.rows;
    });
    listData({ dictType: "t_app_language" }).then((res) => {
      console.log(res);
    });
  },
  mounted() {
    this.handleClick({ name: "TERMS_CLAUSE" });
  },
  watch: {
    navIndex() {
      this.resetQuery();
    },
  },
  methods: {
    handleClick(e) {
      this.navIndex = e.name;
      this.getList();
    },
    /** 查询前台文本配置列表 */
    getList() {
      this.loading = true;
      // listRules({ key: this.navIndex }).then((response) => {
      this.queryParams["key"] = this.navIndex;
      listRules(this.queryParams).then((response) => {
        this.rulesList = response.rows;
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
        language: null,
        content: null,
        isShow: null,
        createTime: null,
        type: null,
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
      this.title = "添加前台文本配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.navId = row.id || this.ids;
      getRules(this.navId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改前台文本配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log(this.form);
          if (this.form.id != null) {
            updateRules(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let data = {
              title: this.form.title,
              content: this.form.content,
              isShow: this.form.isShow,
              language: this.form.language,
              key: this.navIndex,
            };
            addRules(data).then((response) => {
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
        .confirm('是否确认删除前台文本配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delRules(ids);
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
        "bussiness/rules/export",
        {
          ...this.queryParams,
        },
        `rules_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: calc(100% - 280px);
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
