<template>
  <!-- 交易对 -->
  <div class="app-container">
    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="addBtn"
            v-hasPermi="['bussiness:currency:add']"
            >新增</el-button
          >
        </el-col>
      </el-row>
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="币种名称" align="center" prop="coinName">
        </el-table-column>
        <el-table-column label="币种类型" align="center" prop="coin" />
        <el-table-column label="充值最低额" align="center" prop="rechargeMin" />
        <el-table-column label="充值最大额" align="center" prop="rechargeMax" />
         <el-table-column
          label="充值地址"
          align="center"
          prop="coinAddress"
          width="200"
        >
        </el-table-column>
        <el-table-column label="充值次数" align="center" prop="rechargeNum" />

        <el-table-column
          label="操作"
          fixed="right"
          width="180"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              plain
              type="primary"
              @click="handleChange(scope.row)"
              v-hasPermi="['bussiness:user:edit']"
              >修改</el-button
            >

             <el-button
                  size="small"
                  plain
                  type="danger"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['bussiness:user:remove']"
                  >删除</el-button >
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>

    <!-- 添加或修改秒合约币种配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="币种名称" prop="coinName" v-if="type == 1">
          <el-input v-model="form.coinName"
        /></el-form-item>
        <el-form-item label="币种名称" prop="coinName" v-else-if="type === 2">
          <el-input v-model="form.coinName" disabled
        /></el-form-item>
        <el-form-item label="币种类型" prop="coin" v-if="type == 1">
          <el-input v-model="form.coin" />
        </el-form-item>
        <el-form-item label="币种类型" prop="coin" v-else-if="type === 2">
          <el-input v-model="form.coin" disabled />
        </el-form-item>
        <el-form-item label="充值最大额" prop="rechargeMax">
          <el-input type="number" v-model="form.rechargeMax" />
        </el-form-item>
        <el-form-item label="充值最低额" prop="rechargeMin">
          <el-input v-model="form.rechargeMin" />
        </el-form-item>
        <el-form-item label="充值地址" prop="coinAddress">
          <el-input v-model="form.coinAddress" />
        </el-form-item>
        <el-form-item label="充值次数" prop="rechargeNum">
          <el-input v-model="form.rechargeNum" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  name: "Config",
  dicts: ["def_status"],
  data() {
    var checkRechargeMax = (rule, value, callback) => {
      if (value) {
        if (
          !/^[1-9]\d*(\.\d{1,6})?$|^0(\.\d{1,6})?$/.test(value) ||
          Number(value) === 0
        ) {
          return callback(new Error("请输入最多保留6位小数的大于0的数字"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var compareMax = (rule, value, callback) => {
      if (value) {
        if (Number(value) <= Number(this.form.rechargeMin)) {
          return callback(new Error("充值最大额不能小于充值最低额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var compareMin = (rule, value, callback) => {
      if (value) {
        if (Number(value) >= Number(this.form.rechargeMax)) {
          return callback(new Error("充值最低额不大于充值最大额"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var rechargeNum = (rule, value, callback) => {
      if (value) {
        if (!/^\+?[1-9][0-9]*$/.test(value)) {
          return callback(new Error("只能输入非零的正整数"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var rechargeCoin = (rule, value, callback) => {
      if (value) {
        if (!/^[a-z]+$/.test(value)) {
          return callback(new Error("币种类型只能为小写"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      /**
       * 1为新增，2修改
       */
      type: 0,
      currentTypeList: {},
      index: "",
      // 总条数
      total: 0,
      orderList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",
      // 遮罩层
      loading: true,
      activeName: "second",
      // rechargeEth: "",
      //   rechargeUsdtTrc: "",
      //   rechargeUsdtErc: "",
      form: {
        coinName: "",
        coin: "",
        rechargeMax: "",
        rechargeMin: "",
        coinAddress: "",

        rechargeNum: "",
      },
      currentType: "",
      rules: {
        coinName: [
          { required: true, message: "币种名称不能为空", trigger: "blur" },
        ],
        coin: [
          { required: true, message: "币种类型不能为空", trigger: "blur" },
          { validator: rechargeCoin, trigger: "blur" },
        ],
        rechargeMax: [
          { required: true, message: "请输入充值最大额", trigger: "blur" },

          { validator: checkRechargeMax, trigger: "blur" },
          { validator: compareMax, trigger: "blur" },
        ],
        rechargeMin: [
          { required: true, message: "请输入充值最低额", trigger: "blur" },

          { validator: checkRechargeMax, trigger: "blur" },
          { validator: compareMin, trigger: "blur" },
        ],
        coinAddress: [
          { required: true, message: "请输入Btc充值地址", trigger: "blur" },
        ],
        rechargeNum: [
          { required: true, message: "请输入充值次数", trigger: "blur" },

          { validator: rechargeNum, trigger: "blur" },
        ],
      },
      currencyForm: {
        currencyList: [],
      },
    };
  },
  mounted() {
    this.getRecharge();
  },
  methods: {
    reset() {
      this.form = {
        coinName: "",
        coin: "",
        rechargeMax: "",
        rechargeMin: "",
        coinAddress: "",
        rechargeNum: "",
      };
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    /** 获取充值列表 */
    getRecharge() {
      getSettingConfig("ASSET_COIN").then((res) => {
        this.orderList = res.data;
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        let flag = true;
        if (valid) {
          if (this.form.change != undefined) {
            let data = [];
            data = this.orderList.map((item, index) => {
              if (item.coinName == this.currentType) {
                item = this.form;
              }
              return item;
            });
            saveSettingConfig("ASSET_COIN", data).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getRecharge();
                this.open = false;
                this.reset();
              }
            });
          } else {
            this.orderList.filter((item) => {
              if (item.coinName == this.form.coinName) {
                this.$modal.msgSuccess("充值类型不能重复");
                flag = false;
              }
            });
            if (flag) {
              this.orderList.push(this.form);
              saveSettingConfig(
                "ASSET_COIN",
                JSON.stringify(this.orderList)
              ).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.getRecharge();
                  this.open = false;
                  this.reset();
                }
              });
            }
          }
        }
      });
    },
    addBtn() {
      this.type = 1;
      this.open = true;
    },
    handleDelete(row) {
      let dataList = this.orderList.filter((item) => {
        return item.coinName != row.coinName;
      });
      saveSettingConfig("ASSET_COIN", JSON.stringify(dataList)).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.getRecharge();
        }
      });
    },
    handleChange(row) {
      this.form = row;
      this.currentType = row.coinName;
      this.form["change"] = true;
      this.open = true;
      this.type = 2;
      this.title = "修改充值通道";
    },
  },
};
</script>
