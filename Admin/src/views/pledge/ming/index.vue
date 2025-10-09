<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="68px"
      >
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >搜索</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </SearchFormBox>
    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:ming:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:ming:edit']"
            >修改</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:ming:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['bussiness:ming:export']"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 400px)"
        border
        v-loading="loading"
        :data="mingList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="图标" align="center" prop="icon">
          <template slot-scope="{ row }">
            <el-image
              v-if="row.icon"
              style="width: 50px; height: 50px"
              :src="row.icon"
              :preview-src-list="[row.icon]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="前端是否展示" align="center" prop="status">
          <template slot-scope="scope">
            <el-tag
              type="primary"
              size="mini"
              plain
              v-if="scope.row.status == 0"
              >是</el-tag
            >
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.status == 1"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center" prop="days" />
        <el-table-column label="违约利率" align="center" prop="defaultOdds" />
        <el-table-column
          label="最小/最大（日利率）"
          align="center"
          prop="minOdds"
          width="100"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.minOdds }}-{{ scope.row.maxOdds }}</div>
          </template>
        </el-table-column>
        <el-table-column label="限购次数" align="center" prop="timeLimit" />
        <el-table-column
          label="金额(最小/最大)"
          align="center"
          prop="limitMin"
          width="80"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.limitMin }}/{{ scope.row.limitMax }}</div>
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button plain size="small" type="success" @click="$router.push(`/pledge/ming/pledgeNum?productId=${scope.row.id}`)" v-if="['dev','trustwallet'].includes(VUE_APP_ENV)"
                >限购</el-button
              >
              <el-button
                plain
                size="small"
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:ming:edit']"
                >修改</el-button
              >
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:ming:remove']"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>
    <!-- 添加或修改mingProduct对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="图片" prop="icon">
          <ImageUpload ref="imgg" :limit="1" v-model="form.icon"></ImageUpload>
        </el-form-item>
        <el-form-item label="天数" prop="days">
          <el-input v-model="form.days" />
        </el-form-item>
        <el-form-item label="违约利率" prop="defaultOdds">
          <el-input v-model="form.defaultOdds" />
        </el-form-item>
        <el-form-item label="最小日利率%" prop="minOdds">
          <el-input v-model="form.minOdds" />
        </el-form-item>
        <el-form-item label="最大日利率%" prop="maxOdds">
          <el-input v-model="form.maxOdds" />
        </el-form-item>
        <el-form-item label="限购次数（0不限）" prop="timeLimit">
          <el-input v-model="form.timeLimit" />
        </el-form-item>
        <el-form-item label="最小金额" prop="limitMin">
          <el-input v-model="form.limitMin" />
        </el-form-item>
        <el-form-item label="最大金额" prop="limitMax">
          <el-input v-model="form.limitMax" />
        </el-form-item>
        <el-form-item label="前端是否展示" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="0"
            :inactive-value="1"
          ></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" />
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
import { listUserAll } from "@/api/bussiness/user.js";
import {
  listMing,
  getMing,
  delMing,
  addMing,
  updateMing,
  setPledge,
} from "@/api/bussiness/ming";

export default {
  name: "Ming",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // mingProduct表格数据
      mingList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        icon: null,
        status: null,
        days: null,
        defaultOdds: null,
        minOdds: null,
        maxOdds: null,
        timeLimit: null,
        limitMin: null,
        limitMax: null,
        sort: null,
        buyPurchase: null,
        coin: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        days: [
          {
            required: true,
            message: "天数(如 7,10,30)不能为空",
            trigger: "blur",
          },
        ],
        timeLimit: [
          {
            required: true,
            message: "每人限购次数，0表示不限不能为空",
            trigger: "blur",
          },
        ],
        limitMin: [
          { required: true, message: "最小金额不能为空", trigger: "blur" },
        ],
        limitMax: [
          { required: true, message: "最大金额不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询mingProduct列表 */
    getList() {
      this.loading = true;
      listMing(this.queryParams).then((response) => {
        this.mingList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        title: null,
        icon: null,
        status: null,
        days: null,
        defaultOdds: null,
        minOdds: null,
        maxOdds: null,
        timeLimit: null,
        limitMin: null,
        limitMax: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        buyPurchase: null,
        coin: null,
        remark: null,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加质押产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getMing(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改质押产品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateMing(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addMing(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal
        .confirm('是否确认删除编号为"' + ids + '"的数据项？')
        .then(function () {
          return delMing(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bussiness/ming/export",
        {
          ...this.queryParams,
        },
        `ming_${new Date().getTime()}.xlsx`
      );
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
