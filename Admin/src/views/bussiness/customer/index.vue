<!--
 * @Autor: Aka
 * @Date: 2023-07-24 15:18:34
 * @Description: 
 * @LastEditTime: 2023-07-24 16:30:44
-->
<template>
  <div class="app-container">
    <SearchFormBox :title="$route.meta.title">
      <el-form ref="customerForm" :model="customerForm" label-width="100px">
        <el-form-item
          label=""
          v-for="(item, index) in customerForm.list"
          :key="index"
        >
          <div style="margin-bottom: 10px; display: flex; align-items: center">
            名称：
            <el-input
              maxlength="100"
              v-model.trim="item.name"
              style="width: 150px; margin-right: 10px"
            ></el-input>
            图标：
            <ImageUpload
              :limit="1"
              :isShowTip="false"
              v-model="item.imgUrl"
              style="transform: scale(0.7)"
            ></ImageUpload>
            客服链接：
            <el-input
              v-model.trim="item.url"
              style="width: 150px; margin-right: 10px"
            ></el-input>
            <el-button type="danger" @click="delectBtn(index)">删除</el-button>
            <el-button
              type="success"
              @click="addBtn"
              v-show="customerForm.list.length !== 0"
              >添加</el-button
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitcustomerForm('customerForm')"
            >保存</el-button
          >
          <el-button
            type="success"
            @click="addBtn"
            v-show="customerForm.list.length === 0"
            >添加</el-button
          >
        </el-form-item>
      </el-form>
    </SearchFormBox>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  components: {},
  data() {
    return {
      customerForm: {
        list: [],
      },
      uploadUrl: __config._BASE_API + "/common/upload/OSS",
      dialogVisible: false,
      dialogImageUrl: "",
    };
  },
  methods: {
    /** 客服设置 */
    async getCustomerForm() {
      try {
        const res = await getSettingConfig("SUPPORT_STAFF_SETTING");
        if (res.code === 200) {
          const result = res.data;
          for (let i = 0; i < result.length; i++) {
            for (let key in result[i]) {
              if (!result[i][key]) {
                result[i][key] = "";
              }
            }
          }
          this.customerForm.list = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    /**添加 */
    addBtn() {
      let data = {
        url: "",
        imgUrl: "",
      };
      this.customerForm.list.push(data);
    },
    /**删除 */
    delectBtn(index) {
      this.customerForm.list.splice(index, 1);
    },

    submitcustomerForm(formName) {
      if (
        this.customerForm.list.some((val) =>
          val.url == "" || val.imgUrl === "" ? true : false
        )
      ) {
        this.$message({
          type: "error",
          message: "请填写完整内容",
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          try {
            saveSettingConfig(
              "SUPPORT_STAFF_SETTING",
              JSON.stringify(this.customerForm.list)
            ).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "保存成功",
                  type: "success",
                });
              }
            });
          } catch (error) {}
        } else {
          return false;
        }
      });
    },
  },
  mounted() {
    this.getCustomerForm();
  },
};
</script>
<style lang="scss" scoped></style>
