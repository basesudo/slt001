<!--
 * @Autor: Aka
 * @Date: 2023-08-17 18:43:19
 * @Description: 
 * @LastEditTime: 2023-08-21 14:36:48
-->
<template>
  <div class="app-container">
    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDeleteAll"
            >删除</el-button
          >
        </el-col>
      </el-row>
      <el-table
        border
        v-loading="loading"
        :data="helpList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="标题" align="center" prop="question" />
        <el-table-column label="语言" align="center" prop="language">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_app_language"
              :value="scope.row.language"
            />
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" prop="content">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="bottom">
              <div
                v-html="scope.row.content"
                slot="content"
                class="Tabletooltip"
              ></div>
              <div
                v-html="
                  scope.row.content.length > 50
                    ? scope.row.content.slice(0, 50) + '...'
                    : scope.row.content
                "
                class="Tableellipsis"
              ></div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              plain
              v-if="scope.row.enable === '1'"
              >启用</el-button
            >
            <el-button
              type="warning"
              size="mini"
              plain
              v-if="scope.row.enable === '2'"
              >禁用</el-button
            >
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="200"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="primary"
              plain
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageNum"
        :limit.sync="pageSize"
        @pagination="getList"
      />
    </TableContentBox>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form
        ref="formObj"
        :model="formObj"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="标题" prop="question">
          <el-input v-model="formObj.question" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select
            v-model="formObj.language"
            clearable
            disabled
            style="width: 100%"
          >
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <editor v-model="formObj.content" :min-height="192" />
        </el-form-item>
        <el-form-item label="开启状态" prop="enable">
          <el-switch
            v-model="formObj.enable"
            :active-value="'1'"
            :inactive-value="'2'"
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
import {
  helpCenterInfo,
  addhelpCenterInfo,
  updatehelpCenterInfo,
  delecthelpCenterInfo,
} from "@/api/help/index.js";
export default {
  dicts: ["t_app_language"],
  components: {},
  data() {
    return {
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      ids: [], // 选中数组
      pageNum: 1,
      pageSize: 10,
      loading: false,
      helpList: [],
      total: 0,
      open: false, // 是否显示弹出层
      staus: 1, // 弹窗状态 1 添加 2 修改
      title: "", // 弹出层标题,
      formObj: {
        helpCenterId: "",
        question: "",
        language: "",
        content: "",
        enable: "1",
      },
      currentId: "",
      formRules: {
        question: [
          { required: true, message: "标题不能为空", trigger: "blur" },
        ],
        content: [{ required: true, message: "内容不能为空", trigger: "blur" }],
        language: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log(selection);
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加问题";
      this.staus = 1;
      this.resetForm("formObj");
    },
    // 修改
    handleUpdate(row) {
      this.open = true;
      this.title = "修改问题";
      this.staus = 2;
      const { question, language, enable, content, id } = row;
      this.formObj.question = question;
      this.formObj.language = language;
      this.formObj.enable = enable;
      this.formObj.content = content;
      this.currentId = id;
    },
    getList() {
      this.loading = true;
      let data = {
        helpCenterId: this.formObj.helpCenterId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      helpCenterInfo(data).then((res) => {
        if (res.code === 200) {
          this.loading = false;
          this.helpList = res.rows;
          this.total = res.total;
        } else {
          this.loading = false;
        }
      });
    },
    submitForm() {
      this.$refs["formObj"].validate((valid) => {
        if (valid) {
          if (this.staus === 1) {
            addhelpCenterInfo(this.formObj).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          } else if (this.staus === 2) {
            updatehelpCenterInfo({
              ...this.formObj,
              ...{ id: this.currentId },
            }).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              }
            });
          }
        }
      });
    },
    // 全部删除
    handleDeleteAll() {
      this.$modal
        .confirm("是否确认删除选中数据？")
        .then(() => {
          delecthelpCenterInfo(this.ids.toString()).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除该条数据？")
        .then(() => {
          delecthelpCenterInfo(row.id).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    // 取消
    cancel() {
      this.open = false;
    },
  },
  mounted() {
    if (this.$route.params.helpId) {
      this.formObj.helpCenterId = this.$route.params.helpId;
      this.formObj.language = this.$route.params.language;
      this.getList(this.$route.params.helpId);
    }
  },
};
</script>
<style>
.Tableellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 400px;
}
.Tableellipsis img {
  display: none;
}
.Tabletooltip {
  width: 400px;
}
.Tabletooltip img {
  width: 400px;
}
</style>
