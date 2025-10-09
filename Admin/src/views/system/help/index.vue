<!--
 * @Autor: Aka
 * @Date: 2023-08-17 16:46:08
 * @Description: 
 * @LastEditTime: 2023-08-21 15:24:19
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
            v-hasPermi="['bussiness:helpcenter:add']"
            >新增
          </el-button>
        </el-col>
      </el-row>
      <el-table border v-loading="loading" :data="helpList">
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="语言" align="center" prop="language">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_app_language"
              :value="scope.row.language"
            />
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
              v-hasPermi="['bussiness:helpcenter:edit']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:helpcenter:remove']"
              >删除</el-button
            >
            <el-button
              size="small"
              plain
              type="info"
              @click="getDetail(scope.row)"
              v-hasPermi="['bussiness:helpCenterInfo:list']"
              >详情</el-button
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
        <el-form-item label="标题" prop="title">
          <el-input v-model="formObj.title" />
        </el-form-item>
        <el-form-item label="语言" prop="language">
          <el-select v-model="formObj.language" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
  helpcenter,
  addhelpcenter,
  updatehelpcenter,
  delectpcenter,
} from "@/api/help/index.js";
export default {
  dicts: ["t_app_language"],
  components: {},
  data() {
    return {
      loading: false,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      helpList: [],
      open: false, // 是否显示弹出层
      staus: 1, // 弹窗状态 1 添加 2 修改
      title: "", // 弹出层标题,
      formObj: {
        title: "",
        language: "",
        enable: "1",
      },
      currentId: "",
      formRules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        language: [
          { required: true, message: "语言不能为空", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getList() {
      this.loading = true;
      let data = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      };
      helpcenter(data).then((res) => {
        if (res.code === 200) {
          this.helpList = res.rows;
          this.total = res.total;
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true;
      this.title = "添加标题";
      this.staus = 1;
      this.resetForm("formObj");
    },
    // 修改
    handleUpdate(row) {
      this.open = true;
      this.title = "修改标题";
      this.staus = 2;
      const { title, language, enable, id } = row;
      this.formObj.title = title;
      this.formObj.language = language;
      this.formObj.enable = enable;
      this.currentId = id;
    },
    // 详情
    getDetail(row) {
      this.$router.push(
        "/system/help-data/index/" + row.id + "/" + row.language
      );
    },
    // 删除
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除该条数据？")
        .then(() => {
          delectpcenter(row.id).then((res) => {
            if (res.code === 200) {
              this.$modal.msgSuccess("删除成功");
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    // 确定updatehelpcenter
    submitForm() {
      this.$refs["formObj"].validate((valid) => {
        if (valid) {
          if (this.staus === 1) {
            addhelpcenter(this.formObj).then((res) => {
              if (res.code === 200) {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              }
            });
          } else if (this.staus === 2) {
            updatehelpcenter({
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
    // 取消
    cancel() {
      this.open = false;
    },
  },
  mounted() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped></style>
