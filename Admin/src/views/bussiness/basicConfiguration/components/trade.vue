<template>
  <!-- 交易对 -->
  <div class="app-container">
    <TableContentBox>
      <!-- <el-row :gutter="10" class="mb8">
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
      </el-row> -->
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="orderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="排序" align="center" prop="sort" />

        <el-table-column label="状态" align="center" prop="isOpen">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.isOpen == true"
              >开启</el-tag
            >
            <el-tag
              type="info"
              size="mini"
              plain
              v-if="scope.row.isOpen == false"
              >关闭</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          width="150"
          align="center"
          class-coin="small-padding fixed-width"
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

    <!-- 添加或修改金刚区-->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="500px"
      append-to-body
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item
          label="名称"
          prop="name"
          :rules="[{ required: true, message: '币种不能为空' }]"
        >
          <el-input v-model="form.name" disabled
        /></el-form-item>

        <el-form-item
          label="排序"
          prop="sort"
          :rules="[
            { required: true, message: '排序不能为空' },
            { type: 'number', message: '排序必须为数字值' },
          ]"
        >
          <el-input v-model.number="form.sort" />
        </el-form-item>

        <el-form-item label="状态" prop="isOpen">
          <el-switch
            v-model="form.isOpen"
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
    <router-view></router-view>
  </div>
</template>

<script>
import { getSettingConfig, saveSettingConfig } from "@/api/public.js";
export default {
  coin: "Config",
  data() {
    return {
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
      activecoin: "second",
      form: {},
      currentType: "",
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        sort: [
          {
            type: "number",
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
      },
      currencyForm: {
        currencyList: [],
      },
    };
  },
  mounted() {
    this.getJinGangList();
  },
  methods: {
    close() {
      this.getJinGangList();
      this.reset();
    },
    reset() {
      this.resetForm("form");
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

    async getJinGangList() {
      try {
        const res = await getSettingConfig("PLAYING_SETTING");
        if (res.code === 200) {
          const result = res.data;
          this.orderList = res.data;
          this.loading = false;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    submitForm() {
      this.$refs["form"].validate((valid) => {
        let flag = true;
        if (valid) {
          if (this.form.change != undefined) {
            let data = [];
            data = this.orderList.map((item, index) => {
              if (item.name == this.currentType) {
                item = this.form;
              }
              return item;
            });
            saveSettingConfig("PLAYING_SETTING", data).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getJinGangList();
                this.open = false;
                this.reset();
              }
            });
          } else {
            this.form.isOpen = this.form.isOpen || "false";
            this.orderList.filter((item) => {
              if (item.name == this.form.name) {
                this.$modal.msgSuccess("不能重复");
                flag = false;
              }
            });
            if (flag) {
              this.orderList.push(this.form);
              saveSettingConfig(
                "PLAYING_SETTING",
                JSON.stringify(this.orderList)
              ).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.getJinGangList();
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
      this.open = true;
      this.title = "新增玩法配置";
      this.form = {};
      this.reset();
    },
    handleDelete(row) {
      let dataList = this.orderList.filter((item) => {
        return item.name != row.name;
      });
      saveSettingConfig("PLAYING_SETTING", JSON.stringify(dataList)).then(
        (res) => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getJinGangList();
          }
        }
      );
    },
    handleChange(row) {
      this.form = row;
      this.form.sort = row.sort * 1;
      this.currentType = row.name;
      this.form["change"] = true;
      this.open = true;
      this.title = "修改玩法配置";
    },
  },
};
</script>
