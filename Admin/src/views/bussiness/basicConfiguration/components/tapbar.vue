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
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="键名" align="center" prop="key" />
        <el-table-column label="图标" align="center" prop="imgUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: auto"
              :src="scope.row.imgUrl"
              :preview-src-list="[scope.row.imgUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="选中图标" align="center" prop=" checkedImgUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: auto"
              :src="scope.row.checkedImgUrl"
              :preview-src-list="[scope.row.checkedImgUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" align="center" prop="linkUrl" />
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
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>

    <!-- 添加或修改底部栏 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="close">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name"
        /></el-form-item>

        <el-form-item label="键名" prop="key">
          <el-input v-model="form.key" />
        </el-form-item>

        <el-form-item label="图标" prop="imgUrl">
          <ImageUpload :limit="1" v-model="form.imgUrl"></ImageUpload>
        </el-form-item>

        <el-form-item label="选中图标" prop="checkedImgUrl">
          <ImageUpload :limit="1" v-model="form.checkedImgUrl"></ImageUpload>
        </el-form-item>
        <el-form-item label="跳转地址" prop="linkUrl">
          <el-input v-model="form.linkUrl" />
        </el-form-item>
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
  name: "Config",
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
      activeName: "second",
      form: {
        name: "",
        key: "",
        imgUrl: "",
        checkedImgUrl: "",
        linkUrl: "",
      },
      currentType: "",
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        key: [{ required: true, message: "键名不能为空", trigger: "blur" }],
        imgUrl: [{ required: true, message: "请上传图标", trigger: "blur" }],
        linkUrl: [
          { required: true, message: "请输入跳转地址", trigger: "blur" },
        ],
        checkedImgUrl: [
          { required: true, message: "请上传选中图标", trigger: "blur" },
        ],
      },
      currencyForm: {
        currencyList: [],
      },
    };
  },
  mounted() {
    this.getTabarList();
  },
  methods: {
    close(){
      this.getTabarList();
      this.reset()
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

    /** 获取交易玩法配置 */
    async getTabarList() {
      try {
        const res = await getSettingConfig("BOTTOM_MENU_SETTING");
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
      // this.form.imgUrl='https://echo-res.oss-cn-hongkong.aliyuncs.com/echo2.0d2dcc84c36494678b47956abe16c2438.png';
      // this.form.checkedImgUrl='https://echo-res.oss-cn-hongkong.aliyuncs.com/echo2.084346b6510854f4690233072f56ac1e1.png';
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
            saveSettingConfig("BOTTOM_MENU_SETTING", data).then((res) => {
              if (res.code === 200) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.getTabarList();
                this.open = false;
                this.reset();
              }
            });
          } else {
            this.form.isOpen = this.form.isOpen==null?false:this.form.isOpen;
            this.orderList.filter((item) => {
              if (item.key == this.form.key) {
                this.$modal.msgSuccess("不能重复");
                flag = false;
              }
            });
            if (flag) {
              this.orderList.push(this.form);
              saveSettingConfig(
                "BOTTOM_MENU_SETTING",
                JSON.stringify(this.orderList)
              ).then((res) => {
                if (res.code === 200) {
                  this.$message({
                    message: "保存成功",
                    type: "success",
                  });
                  this.getTabarList();
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
      this.title = "新增底部栏";
      this.form = {};
      this.reset();
    },
    handleDelete(row) {
      let dataList = this.orderList.filter((item) => {
        return item.name != row.name;
      });
      saveSettingConfig("BOTTOM_MENU_SETTING", JSON.stringify(dataList)).then(
        (res) => {
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getTabarList();
          }
        }
      );
    },
    handleChange(row) {
      this.form = row;
      this.currentType = row.name;
      this.form["change"] = true;
      this.open = true;
      this.title = "修改底部栏";
    },
  },
};
</script>
