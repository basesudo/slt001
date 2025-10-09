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
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
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
            v-hasPermi="['bussiness:userBank:list']"
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
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(scope.row)"
            v-hasPermi="['system:config:add']"
            >新增</el-button
          >
        </el-col> -->

        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:config:remove']"
            >删除</el-button
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
        :data="configList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="姓名" align="center" prop="userName" />
        <el-table-column label="银行卡号" align="center" prop="cardNumber" />
        <el-table-column label="开户银行名称" align="center" prop="bankName" />
        <el-table-column label="开户省市" align="center" prop="bankAddress" />
        <el-table-column label="开户网点" align="center" prop="bankBranch">
        </el-table-column>

        <el-table-column label="银行编码" align="center" prop="bankCode" />
        <el-table-column label="用户地址" align="center" prop="userAddress" />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="pramiary"
              plain
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:userBank:query']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:userBank:remove']"
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
    <!-- 修改银行卡信息 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" disabled />
        </el-form-item>
        <el-form-item label="姓名" prop="userName">
          <el-input v-model="form.userName" />
        </el-form-item>
        <el-form-item label="银行卡号" prop="cardNumber">
          <el-input type="cardNumber" v-model="form.cardNumber" />
        </el-form-item>
        <el-form-item label="开户银行名称" prop="bankName">
          <el-input v-model="form.bankName" />
        </el-form-item>
        <el-form-item label="开户省市" prop="bankAddress">
          <el-input v-model="form.bankAddress" />
        </el-form-item>
        <el-form-item label="开户网点" prop="bankBranch">
          <el-input v-model="form.bankBranch" />
        </el-form-item>

        <el-form-item label="银行编码" prop="bankCode">
          <el-input v-model="form.bankCode" />
        </el-form-item>
        <el-form-item label="用户地址" prop="userAddress">
          <el-input v-model="form.userAddress" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          v-hasPermi="['bussiness:userBank:edit']"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listBank,
  getBank,
  delBank,
  addBank,
  updateBank,
} from "@/api/bussiness/bank.js";

export default {
  name: "",
  dicts: ["def_status"],
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
      // 银行卡列表
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        userName: null,
        cardNumbe: null,
        bankName: null,
        bankAddress: null,
        bankBranch: null,
        bankCode: null,
        userAddress: null,
      },
      // 表单参数
      form: {},
      rules: {
        period: [{ required: true, message: "请输入周期", trigger: "blur" }],

        minAmount: [
          { required: true, message: "请输入最小金额", trigger: "blur" },
        ],
        maxAmount: [
          { required: true, message: "请输入最大金额", trigger: "blur" },
        ],
      },
    };
  },

  mounted() {
    this.getList();
  },
  methods: {
    /** 查询秒合约币种周期配置列表 */
    getList() {
      this.loading = true;
      listBank(this.queryParams).then((response) => {
        this.configList = response.rows;
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
        userName: null,
        cardNumbe: null,
        bankName: null,
        bankAddress: null,
        bankBranch: null,
        bankCode: null,
        userAddress: null,
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

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getBank(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改银行卡信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateBank(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
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
        .confirm('是否确认"' + ids + '"的数据项？')
        .then(function () {
          return delBank(ids);
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
        "system/config/export",
        {
          ...this.queryParams,
        },
        `config_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
