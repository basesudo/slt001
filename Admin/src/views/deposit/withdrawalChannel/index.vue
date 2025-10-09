<!-- 提现通道 -->
<template>
  <div class="app-container">
    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            v-hasPermi="['bussiness:currency:add']"
            @click="handleAdd"
            >新增</el-button
          >
        </el-col> -->
      </el-row>
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="whithdrawChannelList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="展示名称" align="center" prop="rechargeName" />
        <el-table-column label="提现币种" align="center" prop="rechargeType" />
        <el-table-column label="提现状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status == '0'">关闭</el-tag>
            <el-tag type="primary" v-if="scope.row.status == '1'">开启</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="提现类型" align="center" prop="type">
          <template slot-scope="scope">
            <p v-if="scope.row.type == '0'">数字货币</p>
            <p v-if="scope.row.type == '1'">银行卡</p>
          </template>
        </el-table-column>
        <el-table-column label="提现范围" align="center" prop="withdrawalMix">
          <template slot-scope="scope">
            <p>{{ scope.row.withdrawalMix }}~{{ scope.row.withdrawalMax }}</p>
          </template>
        </el-table-column>
        <el-table-column label="固定手续费" align="center" prop="fee" />
        <el-table-column label="手续费率(%)" align="center" prop="ratio" />
        <el-table-column
          label="次数限制(日)"
          align="center"
          prop="dayWithdrawalNum"
        />
        <el-table-column label="免费提现次数" align="center" prop="freeNum" />

        <el-table-column
          label="操作"
          fixed="right"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              plain
              type="primary"
              @click="handleChange(scope.row, scope.$index)"
              v-hasPermi="['bussiness:user:edit']"
              >修改</el-button
            >

            <!-- <el-button
              size="small"
              plain
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:user:remove']"
              >删除</el-button
            > -->
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>
    <!-- 修改添加弹窗 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      @close="close"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="提现币种" prop="rechargeType">
          <el-input
            v-model="form.rechargeType"
            v-if="form.index != undefined"
            disabled
          />
          <el-input v-model="form.rechargeType" v-else />
        </el-form-item>
        <el-form-item label="展示名称" prop="rechargeName">
          <el-input
            v-model="form.rechargeName"
            placeholder="请输入展示名称"
            v-if="form.index != undefined"
            disabled
          />
          <el-input
            v-model="form.rechargeName"
            placeholder="请输入展示名称"
            v-else
          />
        </el-form-item>
        <el-form-item label="提现状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="'1'"
            :inactive-value="'0'"
          ></el-switch>
        </el-form-item>
        <el-form-item label="选择提现类型" prop="type">
          <template v-if="form.index != undefined">
            <el-input
              v-model="showTypeList[0]"
              placeholder="请输入展示名称"
              v-if="form.type == 0"
              disabled
            />
            <el-input
              v-model="showTypeList[1]"
              placeholder="请输入展示名称"
              v-if="form.type == 1"
              disabled
            />
          </template>
          <el-select v-model="form.type" v-else>
            <el-option label="数字货币" :value="'0'"> </el-option>
            <el-option label="银行卡" :value="'1'"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="最小限制" prop="withdrawalMix">
          <el-input
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')"
            v-model="form.withdrawalMix"
            placeholder="请输入最小限制金额(0.001)"
          />
        </el-form-item>
        <el-form-item label="最大限制" prop="withdrawalMax">
          <el-input
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')"
            v-model="form.withdrawalMax"
            placeholder="请输入最大限制金额(0.001)"
          />
        </el-form-item>
        <el-form-item label="固定手续费" prop="fee">
          <el-input
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')"
            v-model="form.fee"
            placeholder="请输入固定手续费(0.001)"
          />
        </el-form-item>
        <el-form-item label="手续费率" prop="ratio">
          <el-input
            onkeyup="value=value.replace(/^\D*(\d*(?:\.\d{0,3})?).*$/g, '$1')"
            v-model="form.ratio"
            placeholder="请输入手续费率(0.001)"
          />
        </el-form-item>
        <el-form-item label="次数限制(日)" prop="dayWithdrawalNum">
          <el-input
            v-model.number="form.dayWithdrawalNum"
            placeholder="请输入每日可提现次数"
          />
        </el-form-item>

        <el-form-item label="免费提现次数" prop="freeNum">
          <el-input
            v-model.number="form.freeNum"
            placeholder="请输入免费提现次数"
          />
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
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  data() {
    var rechargeCoin = (rule, value, callback) => {
      if (value) {
        if (!/^[a-z]+$/.test(value)) {
          return callback(new Error("提现币种只能输入小写"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      loading: false,
      whithdrawChannelList: [],
      open: false,
      title: "",
      form: {},
      rules: {
        rechargeType: [
          { required: true, message: "提现币种不能为空", trigger: "blur" },
          { validator: rechargeCoin, trigger: "blur" },
        ],
        rechargeName: [
          { required: true, message: "展示名称不能为空", trigger: "blur" },
        ],
        type: [
          { required: true, message: "提现类型不能为空", trigger: "change" },
        ],
        withdrawalMix: [
          { required: true, message: "最小限制不能为空", trigger: "blur" },
        ],
        withdrawalMax: [
          { required: true, message: "最大限制不能为空", trigger: "blur" },
        ],
        fee: [
          { required: true, message: "固定手续费不能为空", trigger: "blur" },
        ],
        ratio: [
          { required: true, message: "手续费率不能为空", trigger: "blur" },
        ],
        dayWithdrawalNum: [
          { required: true, message: "每日提现次数不能为空", trigger: "blur" },
        ],
        freeNum: [
          { required: true, message: "免费提现次数不能为空", trigger: "blur" },
        ],
      },
      showTypeValue: "",
      showTypeIfndex: 0,
      showTypeList: ["数字货币", "银行卡"],
    };
  },
  methods: {
    close() {
      this.form = {};
      this.getList();
      this.reset();
      this.open = false;
    },
    handleSelectionChange() {},
    getList() {
      this.loading = true;
      getSettingConfig("WITHDRAWAL_CHANNEL_SETTING").then((res) => {
        if (res.code == "200") {
          this.loading = false;
          console.log(`数据列表`, res.data);
          this.whithdrawChannelList = res.data;
        }
      });
    },
    handleChange(item, index) {
      this.open = true;
      this.reset();
      this.title = "修改提现通道配置";
      this.form = this.whithdrawChannelList[index];
      this.form["index"] = index.toString();
      this.showTypeValue =
        this.showTypeList[this.whithdrawChannelList[index].type];
    },
    handleAdd() {
      this.form = {};
      this.reset();
      this.open = true;
      this.title = "添加提现通道配置";
    },
    //删除
    handleDelete(row) {
      let dataList = this.whithdrawChannelList.filter((item) => {
        return item.rechargeType != row.rechargeType;
      });
      saveSettingConfig(
        "WITHDRAWAL_CHANNEL_SETTING",
        JSON.stringify(dataList)
      ).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getList();
        }
      });
    },
    // 提交按钮
    submitForm() {
      let flag = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 修改
          if (this.form.index != undefined) {
            this.whithdrawChannelList[this.form.index] = this.form;

            saveSettingConfig(
              "WITHDRAWAL_CHANNEL_SETTING",
              JSON.stringify(this.whithdrawChannelList)
            ).then((res) => {
              if (res.code == "200") {
                this.$modal.msgSuccess("修改成功");
                this.reset();
                this.open = false;
                this.getList();
              } else {
                this.$modal.msgError(res.msg);
              }
            });
          } else {
            // 增加
            // alert("增加");

            this.whithdrawChannelList.forEach((item, index) => {
              if (item.rechargeName == this.form.rechargeName) {
                console.log(item.key, this.form.key);
                this.$modal.msgError("已存在重复币种");
                flag = false;
                return;
              }
            });
            this.whithdrawChannelList.push(this.form);
            if (flag == true) {
              // alert(flag)
              saveSettingConfig(
                "WITHDRAWAL_CHANNEL_SETTING",
                JSON.stringify(this.whithdrawChannelList)
              ).then((res) => {
                if (res.code == "200") {
                  this.$modal.msgSuccess("新增成功");
                  this.reset();
                  this.open = false;
                  this.getList();
                } else {
                  this.$modal.msgError(res.msg);
                }
              });
            }
          }
        }
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
  },
  mounted() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped></style>
