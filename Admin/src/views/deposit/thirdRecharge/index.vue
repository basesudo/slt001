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
        <el-table-column label="名称" align="center" prop="name">
        </el-table-column>
        <el-table-column label="编码" align="center" prop="code">
        </el-table-column>
        <el-table-column label="地址" align="center" prop="url">
        </el-table-column>
        <!-- <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_second_coin_type"
              :value="scope.row.type"
            />
          </template>
        </el-table-column> -->
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.status == 1">关闭</el-tag>
            <el-tag type="primary" v-if="scope.row.status == 0">开启</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="三方充值通道"
          align="center"
          prop="thirdPayStatu"
        >
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.thirdPayStatu == '1'"
              >关闭</el-tag
            >
            <el-tag type="primary" v-if="scope.row.thirdPayStatu == '0'"
              >开启</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="三方提现通道"
          align="center"
          prop="thirdWithStatu"
        >
          <template slot-scope="scope">
            <el-tag type="info" v-if="scope.row.thirdWithStatu == '1'"
              >关闭</el-tag
            >
            <el-tag type="primary" v-if="scope.row.thirdWithStatu == '0'"
              >开启</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column label="APIKEY" align="center" prop="key">
        </el-table-column>
        <el-table-column label="方法名称" align="center" prop="companyName">
        </el-table-column
        ><el-table-column label="编号" align="center" prop="mechId">
        </el-table-column
        ><el-table-column label="回调地址" align="center" prop="returnUrl">
        </el-table-column>

        <el-table-column
          label="操作"
          fixed="right"
          width="80"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-popover
              class="popover-table-menu"
              placement="bottom"
              width="50"
              trigger="click"
            >
              <div class="popover-table-menu-btn-list">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  @click="handleChange(scope.row)"
                  >修改</el-button
                >

                <el-button
                  size="mini"
                  plain
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </div>
              <div class="menu" slot="reference">···</div>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>

    <!-- 添加或修改秒合约币种配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"
        /></el-form-item>
        <el-form-item label="编码" prop="code">
          <el-input v-model="form.code" />
        </el-form-item>

        <el-form-item label="地址" prop="url">
          <el-input v-model="form.url" />
        </el-form-item>
        <el-form-item label="APIKEY" prop="key">
          <el-input v-model="form.key" />
        </el-form-item>

        <el-form-item label="方法名称" prop="companyName">
          <el-input v-model="form.companyName" />
        </el-form-item>
        <el-form-item label="编号" prop="mechId">
          <el-input v-model="form.mechId" />
        </el-form-item>
        <el-form-item label="回调地址" prop="returnUrl">
          <el-input v-model="form.returnUrl" />
        </el-form-item>
        <div class="open">
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="form.status"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="充值通道" prop="thirdPayStatu">
            <el-switch
              v-model="form.thirdPayStatu"
              :active-value="'0'"
              :inactive-value="'1'"
            ></el-switch>
          </el-form-item>
          <el-form-item label="提现通道" prop="thirdWithStatu">
            <el-switch
              v-model="form.thirdWithStatu"
              :active-value="'0'"
              :inactive-value="'1'"
            ></el-switch>
          </el-form-item>
        </div>
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
  dicts: ["third_recharge_type"],
  data() {
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
      form: {
        name: "",
        code: "",
        status: 1,
        url: "",
        APIKEY: "",
        companyName: "",
        mechId: "",
        returnUrl: "",
        thirdPayStatu: "1",
        thirdWithStatu: "1",
      },
      currentType: "",
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        code: [{ required: true, message: "编码不能为空", trigger: "blur" }],
        url: [{ required: true, message: "地址不能为空", trigger: "blur" }],
        APIKEY: [
          { required: true, message: "APIKEY不能为空", trigger: "blur" },
        ],
        companyName: [
          { required: true, message: "方法名称不能为空", trigger: "blur" },
        ],
        mechId: [{ required: true, message: "编号不能为空", trigger: "blur" }],
        returnUrl: [
          { required: true, message: "回调地址不能为空", trigger: "blur" },
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
        name: "",
        code: "",
        status: 1,
        url: "",
        APIKEY: "",
        companyName: "",
        mechId: "",
        returnUrl: "",
        thirdPayStatu: "1",
        thirdWithStatu: "1",
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
      getSettingConfig("THIRD_CHANNL").then((res) => {
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
              if (item.code == this.currentType) {
                item = this.form;
              }
              return item;
            });
            saveSettingConfig("THIRD_CHANNL", data).then((res) => {
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
              if (item.code == this.form.code) {
                this.$modal.msgSuccess("编码不能重复");
                flag = false;
              }
            });
            if (flag) {
              this.orderList.push(this.form);
              saveSettingConfig(
                "THIRD_CHANNL",
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
        return item.code != row.code;
      });
      saveSettingConfig("THIRD_CHANNL", JSON.stringify(dataList)).then(
        (res) => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getRecharge();
          }
        }
      );
    },
    handleChange(row) {
      this.form = row;
      this.currentType = row.code;
      this.form["change"] = true;
      this.open = true;
      this.type = 2;
      this.title = "修改三方充提";
    },
  },
};
</script>
<style scoped lang="scss">
.open {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
