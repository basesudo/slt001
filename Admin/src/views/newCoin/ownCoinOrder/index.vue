<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="120px"
      >
        <el-form-item label="订单ID" prop="orderId">
          <el-input
            v-model="queryParams.orderId"
            placeholder="请输入订单ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申购币种ID" prop="ownId">
          <el-input
            v-model="queryParams.ownId"
            placeholder="请输入申购币种ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申购币种" prop="ownCoin">
          <el-input
            v-model="queryParams.ownCoin"
            placeholder="请输入申购币种"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申购额" prop="amount">
          <el-input
            v-model="queryParams.amount"
            placeholder="请输入申购额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申购数量" prop="number">
          <el-input
            v-model="queryParams.number"
            placeholder="请输入申购数量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="申购价" prop="price">
          <el-input
            v-model="queryParams.price"
            placeholder="请输入申购价"
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
            v-hasPermi="['bussiness:ownCoinOrder:add']"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:ownCoinOrder:edit']"
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
            v-hasPermi="['bussiness:ownCoinOrder:remove']"
            >删除</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['bussiness:ownCoinOrder:export']"
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
        :data="ownCoinOrderList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="ID" align="center" prop="id" />
        <el-table-column label="订单号" align="center" prop="orderId"
          ><template slot-scope="scope">
            <el-link
              :underline="false"
              v-clipboard="scope.row.orderId"
              v-clipboard:success="clipboardSuccess"
              >{{ scope.row.orderId }} <i class="el-icon-copy-document"></i>
            </el-link>
          </template>
        </el-table-column>
        <el-table-column label="申购币种ID" align="center" prop="ownId" />
        <el-table-column label="申购币种" align="center" prop="ownCoin" />
        <el-table-column label="申购额" align="center" prop="amount" />
        <el-table-column label="申购数量" align="center" prop="number" />
        <el-table-column label="申购价" align="center" prop="price" />
        <el-table-column label="状态" align="center" prop="status" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="small"
                type="primary"
                plain
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:ownCoinOrder:edit']"
                >修改</el-button
              >
              <el-button
                plain
                size="small"
                type="warning"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:ownCoinOrder:remove']"
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

    <!-- 添加或修改申购订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="申购币种ID" prop="ownId">
          <el-input v-model="form.ownId" placeholder="请输入申购币种ID" />
        </el-form-item>
        <el-form-item label="申购币种" prop="ownCoin">
          <el-input v-model="form.ownCoin" placeholder="请输入申购币种" />
        </el-form-item>
        <el-form-item label="申购额" prop="amount">
          <el-input v-model="form.amount" placeholder="请输入申购额" />
        </el-form-item>
        <el-form-item label="申购数量" prop="number">
          <el-input v-model="form.number" placeholder="请输入申购数量" />
        </el-form-item>
        <el-form-item label="申购价" prop="price">
          <el-input v-model="form.price" placeholder="请输入申购价" />
        </el-form-item>
        <el-form-item label="上级用户IDS" prop="adminUserIds">
          <el-input
            v-model="form.adminUserIds"
            placeholder="请输入上级用户IDS"
          />
        </el-form-item>
        <el-form-item label="上级后台用户IDS" prop="adminParentIds">
          <el-input
            v-model="form.adminParentIds"
            placeholder="请输入上级后台用户IDS"
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
  listOwnCoinOrder,
  getOwnCoinOrder,
  delOwnCoinOrder,
  addOwnCoinOrder,
  updateOwnCoinOrder,
} from "@/api/bussiness/ownCoinOrder";

export default {
  name: "OwnCoinOrder",
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
      // 申购订单表格数据
      ownCoinOrderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderId: null,
        ownId: null,
        ownCoin: null,
        amount: null,
        number: null,
        price: null,
        status: null,
        adminUserIds: null,
        adminParentIds: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    /** 查询申购订单列表 */
    getList() {
      this.loading = true;
      listOwnCoinOrder(this.queryParams).then((response) => {
        this.ownCoinOrderList = response.rows;
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
        orderId: null,
        ownId: null,
        ownCoin: null,
        amount: null,
        number: null,
        price: null,
        status: null,
        adminUserIds: null,
        adminParentIds: null,
        createTime: null,
        updateTime: null,
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
      this.title = "添加申购订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getOwnCoinOrder(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改申购订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateOwnCoinOrder(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOwnCoinOrder(this.form).then((response) => {
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
        .confirm('是否确认删除申购订单编号为"' + ids + '"的数据项？')
        .then(function () {
          return delOwnCoinOrder(ids);
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
        "bussiness/ownCoinOrder/export",
        {
          ...this.queryParams,
        },
        `ownCoinOrder_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped lang="scss">
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
