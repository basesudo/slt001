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
        <el-form-item label="贷款额度" prop="amount">
          <!-- <el-input
            v-model="queryParams.amount"
            placeholder="请输入贷款额度"
            clearable
            @keyup.enter.native="handleQuery"
          /> -->
          <el-input
            v-model="queryParams.params.amountMin"
            clearable
            placeholder="最小金额"
            @keyup.enter.native="handleQuery"
            class="amount"
          />
          <span> - </span>
          <el-input
            v-model="queryParams.params.amountMax"
            clearable
            placeholder="最大金额"
            @keyup.enter.native="handleQuery"
            class="amount"
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
            v-hasPermi="['bussiness:load:product:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:load:product:export']"
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
        :data="productList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" />
        <!-- <el-table-column label="贷款额度" align="center" prop="amount" /> -->
        <el-table-column
          label="最小贷款额度(USDT)"
          align="center"
          prop="amountMin"
        />
        <el-table-column
          label="最大贷款额度(USDT)"
          align="center"
          prop="amountMax"
        />
        <el-table-column label="周期类型" align="center" prop="cycleType" />
        <el-table-column label="还款类型" align="center" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.repayType == 0">到期一次还本息</span>
          </template></el-table-column
        >
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.status == '0'"
              >未开启</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              v-else-if="scope.row.status == '1'"
              >已开启</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="日利率" align="center" prop="odds" />
        <el-table-column label="还款机构" align="center" prop="repayOrg" />
        <el-table-column label="是否冻结" align="center" prop="isFreeze">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.isFreeze == '2'"
              >是</el-button
            >
            <el-button
              type="primary"
              size="mini"
              plain
              v-else-if="scope.row.isFreeze == '1'"
              >否</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              plain
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:load:product:edit']"
              >修改</el-button
            >
            <el-button
              plain
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:load:product:remove']"
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
    <!-- 添加或修改借贷产品对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!-- <el-form-item label="贷款额度" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入贷款额度" />
        </el-form-item> -->
        <el-form-item label="最小贷款额度" prop="amountMin">
          <el-input v-model="form.amountMin" placeholder="请输入贷款额度" />
        </el-form-item>
        <el-form-item label="最大贷款额度" prop="amountMax">
          <el-input v-model="form.amountMax" placeholder="请输入贷款额度" />
        </el-form-item>
        <!-- <el-form-item label="${comment}" prop="searchValue">
          <el-input v-model="form.searchValue" type="textarea" placeholder="请输入内容" />
        </el-form-item> -->
        <el-form-item label="日利率" prop="odds">
          <el-input v-model="form.odds" placeholder="请输入日利率" />
        </el-form-item>
        <el-form-item label="还款类型" prop="repayType">
          <el-select
            v-model="form.repayType"
            style="width: 150px; margin-right: 10px"
          >
            <el-option
              v-for="dict in dict.type.t_repay_type"
              :key="dict.label"
              :label="dict.label"
              :value="dict.raw.dictValue"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="还款机构" prop="repayOrg">
          <el-input
            v-model="form.repayOrg"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <!-- 贷款周期 -->
        <el-form-item label="贷款周期" prop="cycleType">
          <el-input v-model="form.cycleType" placeholder="请输入贷款周期" />
        </el-form-item>
        <!-- 开启关闭 -->
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- 是否冻结 -->
        <el-form-item label="是否冻结" prop="isFreeze">
          <el-switch
            v-model="form.isFreeze"
            :active-value="'2'"
            :inactive-value="'1'"
          ></el-switch>
        </el-form-item>
        <el-form-item label="用户备注" prop="remark">
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
  listProduct,
  getProduct,
  delProduct,
  addProduct,
  updateProduct,
} from "@/api/bussiness/product";

export default {
  name: "Product",
  dicts: ["t_repay_type"],
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
      // 借贷产品表格数据
      productList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // amount: null,
        params: { amountMin: "", amountMax: "" },
        cycleType: null,
        repayType: null,
        searchValue: null,
        odds: null,
        repayOrg: null,
        status: null,
        isFreeze: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        amount: [
          { required: true, message: "请输入贷款额度", trigger: "blur" },
        ],
        odds: [{ required: true, message: "请输入日利率", trigger: "blur" }],
        repayType: [
          { required: true, message: "请选择还款类型", trigger: "change" },
        ],
        repayOrg: [
          { required: true, message: "请输入还款机构", trigger: "blur" },
        ],
        cycleType: [
          { required: true, message: "请输入还款周期", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询借贷产品列表 */
    getList() {
      this.loading = true;
      listProduct(this.queryParams).then((response) => {
        this.productList = response.rows;
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
        cycleType: null,
        repayType: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        odds: null,
        repayOrg: null,
        isFreeze: null,
        status: null,
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
      this.queryParams.params.amountMin = "";
      this.queryParams.params.amountMax = "";
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
      this.title = "添加借贷产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getProduct(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改借贷产品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        this.form.status = this.form.status == true ? 1 : 0;
        if (valid) {
          // if(this.form.repayType==null){
          //   this.$message({ message: '请选择还款类型', type: 'error' })
          //   return false
          // }
          if (this.form.id != null) {
            updateProduct(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addProduct(this.form).then((response) => {
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
        .confirm('是否确认删除借贷产品编号为"' + ids + '"的数据项？')
        .then(function () {
          return delProduct(ids);
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
        "bussiness/product/export",
        {
          ...this.queryParams,
        },
        `product_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.amount.el-input {
  width: 100px;
}
</style>
