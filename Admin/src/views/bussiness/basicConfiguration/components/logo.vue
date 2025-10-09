<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      class="box"
    >
      <el-form-item label="logo" prop="logo">
        <ImageUpload :limit="1" v-model="form.logo"></ImageUpload>
      </el-form-item>
      <el-form-item label="57*57" prop="logoA">
        <ImageUpload :limit="1" v-model="form.logoA"></ImageUpload>
      </el-form-item>
      <el-form-item label="72*72" prop="logoB">
        <ImageUpload :limit="1" v-model="form.logoB"></ImageUpload>
      </el-form-item>
      <el-form-item label="120*120" prop="logoC">
        <ImageUpload :limit="1" v-model="form.logoC"></ImageUpload>
      </el-form-item>
      <el-form-item label="144*144" prop="logoD">
        <ImageUpload :limit="1" v-model="form.logoD"></ImageUpload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {
  getSettingConfig,
  saveSettingConfig,
  getTimezone,
} from "@/api/public.js";
export default {
  data() {
    return {
      loading: true,
      sidebarList: [], //侧边栏数据
      open: false, // 是否显示弹出层
      title: "", // 弹出层标题
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      form: {}, //表单参数
      // 表单校验
      rules: {
        logo: [{ required: true, message: "不能为空", trigger: "blur" }],
        logoA: [{ required: true, message: "不能为空", trigger: "blur" }],
        logoB: [{ required: true, message: "不能为空", trigger: "blur" }],
        logoC: [{ required: true, message: "不能为空", trigger: "change" }],
        logoD: [
          {
            required: true,
            message: "不能为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    close() {
      this.getList();
      this.reset();
      this.open = false;
    },
    // 获取logo
    async getList() {
      this.loading = true;
      try {
        const res = await getSettingConfig("LOGO_SETTING");
        if (res.code === 200) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          const result = res.data;
          this.form = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },

    // 提交表单
    submitForm() {
      let flag = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // alert(flag)
          saveSettingConfig("LOGO_SETTING", JSON.stringify(this.form)).then(
            (res) => {
              if (res.code == "200") {
                this.$modal.msgSuccess("上传成功");
                this.reset();
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(res.msg);
              }
            }
          );
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    // 修改
    handleUpdate(item, index) {
      console.log(item, index);
      this.open = true;
      this.form = item;
      this.form["index"] = index.toString();
    },
    // 删除
    handleDelete(item) {
      this.$modal
        .confirm('是否确认删除侧边栏"' + item.name + '"？')
        .then(function () {
          item.name = "";
          return saveSettingConfig("LOGO_SETTING", JSON.stringify(item));
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  justify-content: space-between;
}
</style>
