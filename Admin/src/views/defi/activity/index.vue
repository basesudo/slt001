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
        <el-form-item label="金额任务" prop="totleAmount">
          <el-input
            v-model="queryParams.totleAmount"
            placeholder="请输入需要金额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="奖励金额" prop="amount">
          <el-input
            v-model="queryParams.amount"
            placeholder="请输入奖励金额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="queryParams.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
          >
          </el-date-picker>
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
            v-hasPermi="['activitydefi:add']"
            >新增</el-button
          >
        </el-col>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="activitydefiList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="金额任务" align="center" prop="totleAmount" />

        <el-table-column label="奖励金额" align="center" prop="amount" />
        <el-table-column label="活动币种" align="center" prop="type">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.defi_activity_type"
              :value="scope.row.type"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="结束时间"
          align="center"
          prop="endTime"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endTime, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.defi_activity_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding "
        >
          <template slot-scope="scope">
            <!-- <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['activitydefi:edit']"
              >修改</el-button
            > -->
            <el-button
              size="mini"
              type="danger"
              plain
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['activitydefi:remove']"
              >删除</el-button
            >
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

    <!-- 添加或修改空投活动对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="用户ID" />
        </el-form-item>
        <el-form-item label="活动币种" prop="type">
          <el-select
            v-model="form.type"
            placeholder="请选择活动币种"
            style="width: 100%"
          >
            <el-option
              v-for="dict in dict.type.defi_activity_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额任务" prop="totleAmount">
          <el-input
            v-model="form.totleAmount"
            type="number"
            placeholder="请输入需要金额"
          />
        </el-form-item>
        <el-form-item label="奖励金额" prop="amount">
          <el-input
            v-model="form.amount"
            type="number"
            placeholder="请输入奖励金额"
          />
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            style="width: 100%"
            clearable
            v-model="form.endTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择结束时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
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
import {
  listActivitydefi,
  getActivitydefi,
  delActivitydefi,
  addActivitydefi,
  updateActivitydefi,
} from "@/api/defi/activity.js";

export default {
  name: "Activity",
  dicts: ["defi_activity_type"],
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
      // 空投活动表格数据
      activitydefiList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        totleAmount: null,
        endTime: null,
        amount: null,
        type: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        userId: { required: true, message: "用户ID不能为空", trigger: "blur" },
        totleAmount: {
          required: true,
          message: "金额任务不能为空",
          trigger: "blur",
        },
        amount: {
          required: true,
          message: "奖励金额不能为空",
          trigger: "blur",
        },
        type: { required: true, message: "活动币种不能为空", trigger: "blur" },
        endTime: {
          required: true,
          message: "结束时间不能为空",
          trigger: "blur",
        },
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询空投活动列表 */
    getList() {
      this.loading = true;
      listActivitydefi(this.queryParams).then((response) => {
        this.activitydefiList = response.rows;
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
        totleAmount: null,
        endTime: null,
        amount: null,
        type: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
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
      this.title = "添加空投活动";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getActivitydefi(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改空投活动";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateActivitydefi(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addActivitydefi(this.form).then((response) => {
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
        .confirm('是否确认删除空投活动编号为"' + ids + '"的数据项？')
        .then(function () {
          return delActivitydefi(ids);
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
        "bussiness/activitydefi/export",
        {
          ...this.queryParams,
        },
        `activitydefi_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
