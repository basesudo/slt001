<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="80px"
      >
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入用户ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="金额" class="priceFormItem">
          <el-col :span="11">
            <el-input
              v-model="queryParams.minAmount"
              style="width: 130px; margin-right: 30px"
            />
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-input
              v-model="queryParams.maxAmount"
              class="priceInput"
              style="width: 130px; margin-left: 30px"
          /></el-col>
        </el-form-item>

        <el-form-item label="创建时间">
          <div class="picker">
            <el-date-picker
              clearable
              v-model="queryParams.params.beginTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="开始时间"
              class="amount"
            >
            </el-date-picker>
            &nbsp;至&nbsp;
            <el-date-picker
              clearable
              v-model="queryParams.params.endTime"
              type="date"
              value-format="yyyy-MM-dd HH:mm:ss"
              placeholder="结束时间"
              class="amount"
            >
            </el-date-picker>
          </div>
        </el-form-item>

        <el-form-item label="账变类型" prop="type">
          <el-select
            v-model="queryParams.type"
            placeholder="请选择账变类型"
            clearable
          >
            <el-option
              v-for="dict in typeList"
              :key="dict.value"
              :label="dict.type.value"
              :value="dict.type.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="isTest">
          <el-select v-model="queryParams.isTest" clearable style="width: 100%">
            <el-option :label="'正常用户'" :value="0" />
            <el-option :label="'测试用户'" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            v-hasPermi="['bussiness:record:query']"
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
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:record:export']"
            >导出</el-button
          >
        </el-col> -->
        <el-col>
          <div>当页金额:{{ pageTotalMoney }}</div>
          <div>总计金额:{{ totalMoney }}</div>
        </el-col>

        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        show-summary
        :summary-method="getSummaries"
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="recordList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户类型" align="center" prop="isTest">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isTest == 0">正常用户</el-tag>
            <el-tag v-if="scope.row.isTest == 1" type="success"
              >测试用户</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="折合U" align="center" prop="uamount" />
        <el-table-column label="金额" align="center" prop="amount" />
        <el-table-column label="前值" align="center" prop="beforeAmount" />
        <el-table-column label="后值" align="center" prop="afterAmount" />
        <el-table-column label="账变类型" align="center" prop="type">
          <template slot-scope="scope">
            <span
              v-for="item in typeList"
              v-if="scope.row.type == parseInt(item.type.key)"
              >{{ item.type.value }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" prop="symbol">
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime">
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>
    <!-- 添加或修改用户信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="${comment}" prop="serialId">
          <el-input v-model="form.serialId" placeholder="请输入${comment}" />
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
const dayjs = require("dayjs");
import {
  listRecord,
  getRecord,
  delRecord,
  addRecord,
  updateRecord,
  getType,
  getTotalMoney,
} from "@/api/bussiness/record";
import { _toFixed } from "../trade-robot/decimal";
export default {
  name: "Record",
  dicts: ["t_app_record", "t_symbol"],
  data() {
    return {
      pageTotalMoney: "",
      totalMoney: "",
      typeList: [],
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
      // 用户信息表格数据
      recordList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        amount: null,
        createTime: null,
        params: {
          beginTime: "",
          endTime: "",
        },
        remark: null,
        userId: null,
        type: null,
        symbol: null,
        maxAmount: null,
        minAmount: null,
        startTime: null,
        endTime: null,
        startTime: null,
        endTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        amount: [{ required: true, message: "余额不能为空", trigger: "blur" }],
        type: [
          { required: true, message: "账变类型不能为空", trigger: "change" },
        ],
      },
    };
  },

  created() {
    this.getList();
    getType().then((res) => {
      let arr = [];
      let obj = res.data;
      for (var index in obj) {
        let a = index;
        let b = obj[index];
        let objj = {
          label: a,
          type: b,
        };
        arr.push(objj);
      }

      this.typeList = arr;
    });

    getTotalMoney().then((res) => {
      this.totalMoney = res.data.statisticsAmount;
    });
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (column.property === "amount") {
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += 0;
            // this.pageTotalMoney = parseFloat(sums[2]);
            this.pageTotalMoney = _toFixed(sums[index], 6);
          } else {
            sums[index] = "N/A";
          }
        }
      });

      return sums;
    },

    /** 查询用户信息列表 */
    getList() {
      this.loading = true;
      if (this.queryParams.params.endTime) {
        const date = new Date(this.queryParams.params.endTime);
        date.setHours(23);
        date.setMinutes(59);
        date.setSeconds(59);
        const modifiedDateString = date.toISOString();
        this.queryParams.params.endTime = dayjs(modifiedDateString).format(
          "YYYY-MM-DD HH:mm:ss"
        );
      }
      listRecord(this.queryParams).then((response) => {
        this.recordList = response.rows;
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
        amount: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        userId: null,
        searchValue: null,
        beforeAmount: null,
        afterAmount: null,
        serialId: null,
        type: null,
        symbol: null,
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
      this.queryParams.params.beginTime = "";
      this.queryParams.params.endTime = "";
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
      this.title = "添加用户信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getRecord(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateRecord(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addRecord(this.form).then((response) => {
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
        .confirm('是否确认删除用户信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delRecord(ids);
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
        "bussiness/record/export",
        {
          ...this.queryParams,
        },
        `record_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.picker {
  display: flex;
  justify-content: space-between;
}
</style>
