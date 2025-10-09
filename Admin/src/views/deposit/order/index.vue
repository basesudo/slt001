<template>
  <div class="content">
    <el-form ref="form" :model="form" label-width="120px" class="formContent">
      <el-form-item label="地址" prop="toAddress">
        <el-input v-model="form.toAddress" />
      </el-form-item>
      <el-form-item label="单号" prop="serialId">
        <el-input v-model="form.serialId" />
      </el-form-item>
      <el-form-item label="充值金额" prop="amount">
        <el-input v-model="form.amount" />
      </el-form-item>
      <el-form-item label="实际充值金额" prop="realAmount">
        <el-input v-model="form.realAmount" />
      </el-form-item>
      <!-- <el-form-item label="更新时间" prop="params.date">
        <el-input v-model="form.params.date" />
      </el-form-item> -->
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" />
      </el-form-item>
      <!-- <el-form-item label="充值说明" prop="rechargeRemark">
        <el-input v-model="form.rechargeRemark" />
      </el-form-item> -->
    </el-form>
    <div class="right" @click="goBack">
      <el-button type="primary">关闭</el-button>
    </div>
  </div>
</template>

<script>
import { getRecharge } from "@/api/system/recharge";
export default {
  name: "Recharge",
  data() {
    return {
      id: "",
      form: {},
    };
  },
  mounted() {
    getRecharge(this.$route.query.id).then((res) => {
      this.form = res.data;
    });
  },
  methods: {
    goBack() {
      this.$router.push("/deposit/rechargelist");
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  margin: 100px auto;
  width: 800px;
  .formContent {
    width: 800px;
    height: 400px;
    display: flex;
    flex-direction: column;
  }
  .right {
    text-align: right;
  }
}
</style>
