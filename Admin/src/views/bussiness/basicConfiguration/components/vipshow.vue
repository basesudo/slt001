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
        <el-table-column label="语言" align="center" prop="lang" width="120">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_app_language"
              :value="scope.row.lang"
            />
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" prop="info">
          <template slot-scope="scope">
            <div class="content">
              {{ scope.row.info }}
            </div>
          </template>
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
                  v-hasPermi="['bussiness:user:edit']"
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
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="语言" prop="lang" width="100%">
          <el-select v-model="form.lang" clearable>
            <el-option
              v-for="dict in dict.type.t_app_language"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="内容">
          <editor v-model="form.info" :min-height="150" />
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
  dicts: ["t_app_language"],
  data() {
    return {
      change: undefined,
      loading: true,
      index: "",
      // 总条数
      total: 0,
      orderList: [],
      // 是否显示弹出层
      open: false,
      // 弹出层标题
      title: "",

      form: {
        lang: "",
        info: "",
      },
      currentType: "",
      rules: {},
    };
  },
  mounted() {
    this.getRecharge();
  },
  methods: {
    reset() {
      this.form = {
        lang: "",
        info: "",
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
    /** 获取列表 */
    getRecharge() {
      getSettingConfig("VIP_DIRECTIONS_SETTING").then((res) => {
        this.orderList = res.data;
        this.loading = false;
      });
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        let flag = true;
        if (valid) {
          if (this.change != undefined) {
            let data = [];
            data = this.orderList.map((item, index) => {
              if (item.lang == this.currentType) {
                item = this.form;
              }
              return item;
            });
            saveSettingConfig("VIP_DIRECTIONS_SETTING", data).then((res) => {
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
              if (item.lang == this.form.lang) {
                this.$modal.msgSuccess("不能重复");
                flag = false;
              }
            });
            if (flag) {
              this.orderList.push(this.form);
              saveSettingConfig(
                "VIP_DIRECTIONS_SETTING",
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
        return item.lang != row.lang;
      });
      saveSettingConfig(
        "VIP_DIRECTIONS_SETTING",
        JSON.stringify(dataList)
      ).then((res) => {
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
      this.currentType = row.lang;
      this.change = true;
      this.open = true;
      this.type = 2;
      this.title = "修改VIP说明";
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
