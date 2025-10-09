<!-- 彩金 -->
<template>
  <el-dialog
    title="彩金"
    :visible.sync="visible"
    width="500px"
    append-to-body
    @close="cancel"
    
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户ID">
        <el-input disabled :value="user.userId" />
      </el-form-item>
      <el-form-item label="账号">
        <el-input disabled :value="user.loginName" />
      </el-form-item>
      <el-form-item label="彩金类型" prop="giveType">
        <el-select
          v-model="form.giveType"
          placeholder="请选择彩金类型"
          style="width: 100%"
        >
          <el-option label="赠送" value="0"></el-option>
          <el-option label="扣减" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资产类型" prop="type">
        <el-select
          v-model="form.type"
          placeholder="请选择资产类型"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="dict in dict.type.t_asset_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="币种" prop="symbol">
        <el-select
          v-model="form.symbol"
          placeholder="请选择币种"
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="dict in showAssetList"
            :key="dict.symbol"
            :label="dict.symbol"
            :value="dict.symbol"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="现有金额">
        <el-input disabled :value="hasAmount" />
      </el-form-item>
      <el-form-item label="金额" prop="amount">
        <el-input
          v-model="form.amount"
          type="number"
          placeholder="请输入金额"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { getAssetList, sendBousApi } from "@/api/bussiness/user.js";
export default {
  dicts: ["t_asset_type"],
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

  watch: {
    user: {
      handler() {
        this.getAssetList();
      },
      deep: true,
      immediate: true,
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
        amount: [{ required: true, message: "金额不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "资产类型不能为空", trigger: "blur" },
        ],
        giveType: [
          {
            required: true,
            message: "彩金类型不能为空",
            trigger: "blur",
          },
        ],
        symbol: [{ required: true, message: "币种不能为空", trigger: "blur" }],
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
    hasAmount() {
      let tempObj = this.showAssetList.find(
        (elem) => elem.symbol == this.form.symbol
      );
      return tempObj?.amout || 0;
    },
    /**
     * 资产列表
     */
    showAssetList() {
      // return this.assetList.filter((elem) => elem.type == this.form.type);
      let list = this.assetList.filter((elem) => elem.type == this.form.type);
      let reversedNumbers = [];
      for (let i = list.length - 1; i >= 0; i--) {
        reversedNumbers.push(list[i]);
      }
      return reversedNumbers;
    },
  },
  mounted() {},
  methods: {
    async getAssetList() {
      if (this.user?.userId) {
        this.reset();
        this.form.type = this.dict.type.t_asset_type[0]?.value;
        this.form.userId = this.user.userId;

        const res = await getAssetList({
          userId: this.user.userId,
          pageNum: 1,
          pageSize: 1000,
        });
        if (res.code == 200) {
          this.assetList = res.rows;
          this.form.symbol = this.showAssetList[0]?.symbol || "";
        }
      }
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        type: null,
        amount: null,
        symbol: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.userId = this.user.userId;
          sendBousApi(this.form)
            .then((res) => {
              if (res.code == 200) {
                this.$modal.msgSuccess(res.msg);
                this.$emit("getDataList");
              } else {
                this.$modal.msgError(res.msg);
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
      this.reset();
    },
  },
};
</script>
