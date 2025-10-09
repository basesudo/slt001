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
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资产类型" prop="type">
          <el-input
            v-model="queryParams.type"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input
            v-model="queryParams.symbol"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地址" prop="adress">
          <el-input
            v-model="queryParams.adress"
            placeholder="请输入地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="资产总额">
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.amountMin"
              clearable
              placeholder="最小金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.amountMax"
              clearable
              placeholder="最大金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="占用资产" prop="params.occupiedAmountMin">
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.occupiedAmountMin"
              clearable
              placeholder="最小金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.occupiedAmountMax"
              clearable
              placeholder="最大金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
        </el-form-item>
        <el-form-item label="可用资产" prop="params.availableAmountMin">
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.availableAmountMin"
              clearable
              placeholder="最小金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-input
              v-model="queryParams.params.availableAmountMax"
              clearable
              placeholder="最大金额"
              @keyup.enter.native="handleQuery"
              class="amount"
            />
          </el-col>
        </el-form-item>
        <!-- <el-form-item label="创建人" prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="请输入创建人"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="创建时间">
          <el-col :span="11">
            <el-date-picker
              clearable
              v-model="queryParams.params.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
              class="amount"
            >
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2">至</el-col>
          <el-col :span="11">
            <el-date-picker
              clearable
              v-model="queryParams.params.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
              class="amount"
            >
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-row type="flex" justify="center"
          ><el-form-item style="text-align: center">
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              v-hasPermi="['bussiness:asset:query']"
              >搜索</el-button
            >
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item></el-row
        >
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
            @click="handleAdd"
            v-hasPermi="['bussiness:asset:add']"
            >新增</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:asset:edit']"
            >修改</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:asset:remove']"
            >删除</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:asset:export']"
            >导出</el-button
          >
        </el-col> -->
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="assetList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="50" align="center" />
        <el-table-column
          label="用户ID"
          align="center"
          prop="userId"
          width="80"
        />
        <el-table-column label="地址" align="center" prop="adress" />
        <el-table-column label="币种" align="center" prop="symbol" width="80" />
        <el-table-column label="资产总额" align="center" prop="amout" />
        <el-table-column
          label="占用资产"
          align="center"
          prop="occupiedAmount"
        />
        <el-table-column
          label="可用资产"
          align="center"
          prop="availableAmount"
        />
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
        />
        <el-table-column label="备注" align="center" prop="remark" />
        <!-- <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="text"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:asset:query']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="text"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:asset:remove']"
              >删除</el-button
            >
          </template>
        </el-table-column> -->
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>
    <!-- 添加或修改玩家资产对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          v-hasPermi="['bussiness:asset:edit']"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listAsset,
  getAsset,
  delAsset,
  addAsset,
  updateAsset,
} from "@/api/bussiness/asset";

export default {
  name: "Asset",
  dicts: ["t_address_type"],
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
      // 玩家资产表格数据
      assetList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        params: {
          amountMin: "",
          amountMax: "",
          occupiedAmountMin: "",
          occupiedAmountMax: "",
          availableAmountMin: "",
          availableAmountMax: "",
          startTime: "",
          endTime: "",
        },
        pageNum: 1,
        pageSize: 10,
        userId: null,
        adress: null,
        amout: null,
        occupiedAmount: null,
        availableAmount: null,
        createBy: null,
        createTime: null,
        type: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        amout: [
          { required: true, message: "资产总额不能为空", trigger: "blur" },
        ],
        occupiedAmount: [
          { required: true, message: "占用资产不能为空", trigger: "blur" },
        ],
        availableAmount: [
          { required: true, message: "可用资产不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询玩家资产列表 */
    getList() {
      this.loading = true;
      listAsset(this.queryParams).then((response) => {
        this.assetList = response.rows;
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
        userId: null,
        adress: null,
        symbol: null,
        amout: null,
        occupiedAmount: null,
        availableAmount: null,
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
      this.queryParams.params.amountMin = "";
      this.queryParams.params.amountMax = "";
      this.queryParams.params.occupiedAmountMin = "";
      this.queryParams.params.occupiedAmountMax = "";
      this.queryParams.params.availableAmountMin = "";
      this.queryParams.params.availableAmountMax = "";
      this.queryParams.params.startTime = "";
      this.queryParams.params.endTime = "";
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加玩家资产";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getAsset(userId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改玩家资产";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != null) {
            updateAsset(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addAsset(this.form).then((response) => {
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
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除玩家资产编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delAsset(userIds);
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
        "bussiness/asset/export",
        {
          ...this.queryParams,
        },
        `asset_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.amount.el-input {
  max-width: 140px;
}
.line {
  text-align: center;
}
</style>
