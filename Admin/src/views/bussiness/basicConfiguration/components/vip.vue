<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="80px"
      :rules="rules"
      class="box"
    >
      <el-form-item label="vip0">
        开始：<el-input
          v-model.number="form.vip0Start"
          style="width: 150px"
        ></el-input>
        结束：<el-input
          v-model.number="form.vip0End"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="vip1">
        开始：<el-input
          v-model.number="form.vip1Start"
          style="width: 150px"
        ></el-input>
        结束：<el-input
          v-model.number="form.vip1End"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="vip2">
        开始：<el-input
          v-model.number="form.vip2Start"
          style="width: 150px"
        ></el-input>
        结束：<el-input
          v-model.number="form.vip2End"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="vip3">
        开始：
        <el-input
          v-model.number="form.vip3Start"
          style="width: 150px"
        ></el-input>
        结束：<el-input
          v-model.number="form.vip3End"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="vip4">
        开始：<el-input
          v-model.number="form.vip4Start"
          style="width: 150px"
        ></el-input>
        结束：
        <el-input v-model.number="form.vip4End" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="vip5">
        开始：<el-input
          v-model.number="form.vip5Start"
          style="width: 150px"
        ></el-input>
        结束：
        <el-input v-model.number="form.vip5End" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="vip6">
        开始：<el-input
          v-model.number="form.vip6Start"
          style="width: 150px"
        ></el-input>
        结束：
        <el-input v-model.number="form.vip6End" style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="vip7">
        开始：<el-input
          v-model.number="form.vip7Start"
          style="width: 150px"
        ></el-input>
        结束：<el-input
          v-model.number="form.vip7End"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="vip8">
        开始：
        <el-input
          v-model.number="form.vip8Start"
          style="width: 150px"
        ></el-input>
      </el-form-item>
      <el-form-item label="开关" prop="isOpen">
        <el-radio-group v-model="form.isOpen">
          <el-radio :label="true">开</el-radio>
          <el-radio :label="false">关</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">保存</el-button>
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
        const res = await getSettingConfig("VIP_LEVEL_SETTING");
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
          saveSettingConfig(
            "VIP_LEVEL_SETTING",
            JSON.stringify(this.form)
          ).then((res) => {
            if (res.code == "200") {
              this.$modal.msgSuccess("保存成功");
              this.reset();
              this.open = false;
              this.getList();
            } else {
              this.$modal.msgError(res.msg);
            }
          });
        }
      });
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
  },
};
</script>

<style lang="scss" scoped>
// .box {
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
// }
</style>
