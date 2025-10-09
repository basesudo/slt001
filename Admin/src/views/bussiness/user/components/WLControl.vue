<!-- 控输赢 -->

<template>
  <el-dialog
    title="包输包赢设置"
    :visible.sync="visible"
    width="500px"
    append-to-body
    
    @close="cancel"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="订单标记">
        <el-radio-group v-model="user.buff">
          <el-radio :label="0">正常</el-radio>
          <el-radio :label="1">包赢</el-radio>
          <el-radio :label="2">包输</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { changeWin } from "@/api/bussiness/user.js";
export default {
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      // 资产列表
      assetList: [],
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        buff: [{ required: true, message: "输赢不能为空", trigger: "blur" }],
      },
    };
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
    /** 提交按钮 */
    submitForm() {
      let data = {
        userId: this.user.userId,
        buff: this.user.buff,
      };
      changeWin(data)
        .then((res) => {
          if (res.code == 200) {
            this.$modal.msgSuccess(res.msg);
          } else {
            this.$modal.msgError(res.msg);
          }
        })
        .finally(() => {
          this.cancel();
        });
    },
    // 取消按钮
    cancel() {
      this.$emit("input", false);
    },
  },
};
</script>
