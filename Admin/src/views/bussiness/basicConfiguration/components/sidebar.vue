<template>
  <div>
    <TableContentBox>
      <!-- 工具栏 -->
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd()"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            >删除</el-button
          >
        </el-col> -->
        <right-toolbar :search="false" @queryTable="getList"></right-toolbar>
      </el-row>
      <el-table
        :data="sidebarList"
        @selection-change="handleSelectionChange"
        height="calc(100vh - 360px)"
        style="overflow: auto"
        border
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="名称" align="center" prop="name" />
        <el-table-column label="键名" align="center" prop="key" />
        <el-table-column label="图标" align="center" prop="logoUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: auto"
              :src="scope.row.logoUrl"
              :preview-src-list="[scope.row.logoUrl]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="跳转地址" align="center" prop="jumpUrl" />
        <el-table-column label="跳转类型" align="center" prop="jumpType">
          <template slot-scope="scope">
            <p v-if="scope.row.jumpType == 'link'">超链接</p>
            <p v-if="scope.row.jumpType == 'path'">路由跳转</p>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="isOpen">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.isOpen == '1'"
              >开启</el-tag
            >
            <el-tag type="info" size="mini" plain v-if="scope.row.isOpen == '0'"
              >关闭</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="150"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="small"
                type="primary"
                plain
                @click="handleUpdate(scope.row, scope.$index)"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.key == 'primary'"
                size="small"
                type="primary"
                plain
                @click="handleLimitA('primaryLimitDialog')"
                >初级限额</el-button
              >
              <el-button
                v-else-if="scope.row.key == 'advanced'"
                size="small"
                type="primary"
                plain
                @click="handleLimitB('seniorLimitDialog')"
                >高级限额</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>
    <!-- 添加或修改侧边栏 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="600px"
      append-to-body
      @close="close"
    >
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="键名" prop="key">
          <el-input v-model="form.key" v-if="!form.index" />
          <el-input v-model="form.key" v-else disabled />
        </el-form-item>
        <el-form-item label="图标" prop="logoUrl">
          <ImageUpload :limit="1" v-model="form.logoUrl"></ImageUpload>
        </el-form-item>
        <el-form-item label="跳转地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" />
        </el-form-item>
        <el-form-item label="跳转类型" prop="jumpType">
          <el-select v-model="form.jumpType" clearable>
            <el-option key="0" label="路由跳转" value="path" />
            <el-option key="1" label="超链接" value="link" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
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
    <PrimaryLimit v-model="primaryLimitDialog"></PrimaryLimit>
    <SeniorLimit v-model="seniorLimitDialog"></SeniorLimit>
  </div>
</template>

<script>
import {
  getSettingConfig,
  saveSettingConfig,
  getTimezone,
} from "@/api/public.js";
import PrimaryLimit from "./primaryLimit";
import SeniorLimit from "./seniorLimit.vue";
export default {
  data() {
    return {
      open1: false,
      form1: {},
      primaryLimitDialog: false,
      seniorLimitDialog: false,

      currentForm: {},
      loading: true,
      sidebarList: [], //侧边栏数据
      open: false, // 是否显示弹出层
      title: "", // 弹出层标题
      ids: [], // 选中数组
      single: true, // 非单个禁用
      multiple: true, // 非多个禁用
      form: {}, //表单参数
      // 表单校验
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        key: [{ required: true, message: "键名不能为空", trigger: "blur" }],
        jumpUrl: [
          { required: true, message: "跳转地址不能为空", trigger: "blur" },
        ],
        jumpType: [
          { required: true, message: "跳转类型不能为空", trigger: "change" },
        ],
        sort: [
          {
            type: "number",
            required: true,
            message: "排序不能为空",
            trigger: "blur",
          },
        ],
        // isOpen: [
        //   { required: true, message: "状态不能为空", trigger: "change" },
        // ],
        logoUrl: [{ required: true, message: "图标不能为空", trigger: "blur" }],
      },
    };
  },
  components: {
    PrimaryLimit,
    SeniorLimit,
  },
  mounted() {
    this.getList();
    // this.getLimit();
  },
  methods: {
    close() {
      this.getList();
      this.reset();
      this.open = false;
    },
    getDataList() {
      this.getList();
    },
    // 获取侧边栏配置
    async getList() {
      this.loading = true;
      try {
        const res = await getSettingConfig("APP_SIDEBAR_SETTING");
        if (res.code === 200) {
          setTimeout(() => {
            this.loading = false;
          }, 300);
          const result = res.data;
          this.sidebarList = result;
        }
      } catch (e) {
        console.log("请求失败");
      }
    },
    // 获取侧边栏配置
    // async getLimit() {
    //   this.loading = true;
    //   try {
    //     const res = await getSettingConfig("AUTH_LIMIT");
    //     if (res.code === 200) {
    //       setTimeout(() => {
    //         this.loading = false;
    //       }, 300);
    //       const result = res.data;
    //       console.log(result.seniorLimit)
    //       this.form1=result
    //       // this.form1.seniorLimit = result.seniorLimit==null ? '' : result.seniorLimit;
    //     }
    //   } catch (e) {
    //     console.log("请求失败");
    //   }
    // },
    /** 新增按钮操作 */
    handleAdd() {
      this.form = {};
      this.reset();
      this.open = true;
      this.title = "添加侧边栏";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.noticeId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    // 提交表单
    submitForm() {
      let flag = true;
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.index) {
            console.log(this.form);
            // 修改
            if (flag == true) {
              // alert(flag)
              saveSettingConfig(
                "APP_SIDEBAR_SETTING",
                JSON.stringify(this.form)
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
            }
          } else {
            // console.log(this.form)
            console.log(this.form, this.form.isOpen);
            this.form.isOpen = this.form.isOpen || false;
            // 新增
            this.sidebarList.forEach((item, index) => {
              if (item.key == this.form.key) {
                console.log(item.key, this.form.key);
                this.$modal.msgError("已存在重复键名");
                flag = false;
                return;
              }
            });
            if (flag == true) {
              // alert(flag)
              saveSettingConfig(
                "APP_SIDEBAR_SETTING",
                JSON.stringify(this.form)
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
      this.reset();
    },
    // 表单重置
    reset() {
      this.resetForm("form");
    },
    // 修改
    handleUpdate(item, index) {
      console.log(item, index);
      this.open = true;
      this.form = item;
      this.form["index"] = index.toString();
    },
    // 删除
    handleDelete(item) {
      this.$modal
        .confirm('是否确认删除侧边栏"' + item.name + '"？')
        .then(function () {
          item.name = "";
          return saveSettingConfig("APP_SIDEBAR_SETTING", JSON.stringify(item));
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /**
     * 打开限额弹窗
     */
    handleLimitA(key) {
      this[key] = true;
    },
    /**
     * 打开限额弹窗
     */
    handleLimitB(key) {
      this[key] = true;
      this.open1 = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  button {
    // width: 60px;
    flex: 1;
    margin: 5px;
  }
}
</style>
