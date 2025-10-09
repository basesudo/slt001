<!-- 下分 -->
<template>
  <el-dialog
    title="限额设置"
    :visible.sync="visible"
    width="500px"
    append-to-body
    @close="cancel"
    
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="限额" prop="primaryLimit">
        <el-input v-model="form.primaryLimit" type="number" />
      </el-form-item>
      <el-form-item label="状态" prop="isOpenPrimary">
        <el-switch
          v-model="form.isOpenPrimary"
          :active-value="true"
          :inactive-value="false"
        ></el-switch>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        primaryLimit: [
          { required: true, message: "金额不能为空", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    getSettingConfig("AUTH_LIMIT").then((res) => {
      if (res.code === 200) {
        this.form = res.data;
      }
    });
  },
  computed: {
    visible: {
      get() {
        return this.value;
      },
      set(val) {},
    },
  },
  methods: {
    // 表单重置
    reset() {
      this.form = {
        primaryLimit: null,
        isOpenPrimary: null,
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          saveSettingConfig("AUTH_LIMIT", JSON.stringify(this.form))
            .then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess(res.msg);
                this.cancel();
                this.getList();
              }
            })
            .finally(() => {
              this.cancel();
            });
        }
      });
    },

    // 取消按钮
    cancel() {
      this.$emit("input", false);
      // this.reset();
    },
  },
};
</script>
