<template>
  <div class="app-container">
    <SearchFormBox>
      <el-form
        :model="queryParams"
        ref="queryForm"
        size="small"
        :inline="true"
        v-show="showSearch"
        label-width="100px"
      >
        <el-form-item label="币种" prop="symbol">
          <el-input
            v-model="queryParams.symbol"
            placeholder="请输入币种"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="最小兑换数量" prop="minChargeNum">
          <el-input
            v-model="queryParams.minChargeNum"
            placeholder="请输入最小兑换数量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="最大兑换数量" prop="maxChargeNum">
          <el-input
            v-model="queryParams.maxChargeNum"
            placeholder="请输入最大兑换数量"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="金额" prop="commission">
          <el-input
            v-model="queryParams.params.commissionMin"
            clearable
            placeholder="最小金额"
            @keyup.enter.native="handleQuery"
            class="amount"
          />
          <span> - </span>
          <el-input
            v-model="queryParams.params.commissionMax"
            clearable
            placeholder="最大金额"
            @keyup.enter.native="handleQuery"
            class="amount"
          />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="enable">
          <el-select
            v-model="queryParams.enable"
            style="width: 150px; margin-right: 10px"
          >
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item> -->
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
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleOneAdd"
            v-hasPermi="['bussiness:manage:add']"
            >一键新增</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:symbolmanage:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleUpdate"
            v-hasPermi="['bussiness:symbolmanage:edit']"
            >修改</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-minus"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:symbolmanage:remove']"
            >删除</el-button
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
            v-hasPermi="['bussiness:manage:export']"
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
        :data="manageList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="50" align="center" />
        <el-table-column label="图标" align="center" prop="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" style="width: 30px" />
          </template>
        </el-table-column>
        <!-- <el-table-column label="主键id" align="center" prop="id" /> -->
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column
          label="兑换数量(最小)"
          align="center"
          prop="minChargeNum"
          width="120px"
        />
        <el-table-column
          label="兑换数量(最大)"
          align="center"
          prop="maxChargeNum"
          width="120px"
        />
        <el-table-column label="手续费(%)" align="center" prop="commission" />
        <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.enable == 1"
            >
              启用
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.enable == 2"
            >
              禁用
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              plain
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:symbolmanage:edit']"
              >修改</el-button
            >

            <el-button
              size="small"
              plain
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:symbolmanage:remove']"
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
    /></TableContentBox>

    <!-- 添加或修改币种管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="币种" prop="currentId">
          <el-select
            v-model="form.currentId"
            filterable
            clearable
            style="width: 100%"
            @change="changeCoin"
          >
            <el-option
              v-for="coin in coinList"
              :key="coin.id"
              :label="coin.label"
              :value="coin.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="最小兑换数量" prop="minChargeNum">
          <el-input v-model="form.minChargeNum" />
        </el-form-item>
        <el-form-item label="最大兑换数量" prop="maxChargeNum">
          <el-input v-model="form.maxChargeNum" />
        </el-form-item>
        <el-form-item label="手续费(%)" prop="commission">
          <el-input v-model="form.commission" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item label="状态" prop="enable">
          <el-select v-model="form.enable" style="width: 100%">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="2"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态" prop="delFlag">
          <el-select v-model="form.delFlag" style="width: 100%">
            <el-option label="正常" value="0"></el-option>
            <el-option label="删除" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 一键新增币种 -->
    <el-dialog
      :title="title"
      :visible.sync="oneOpen"
      width="800px"
      append-to-body
    >
      <el-form label-width="80px">
        <el-row class="row">
          <el-col :span="20">
            <el-table
              v-loading="loading"
              :data="coinList"
              @selection-change="bindList"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column
                label="币种名称"
                align="center"
                key="symbol"
                prop="symbol"
              />
              <!-- v-if="columns[0].visible" -->
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <!-- <pagination
        v-show="adminTotal > 0"
        :total="adminTotal"
        :page.sync="queryParams1.pageNum"
        :limit.sync="queryParams1.pageSize"
        @pagination="getAdminUserList"
      /> -->
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitOneForm">确 定</el-button>
        <el-button @click="oneCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listManage,
  getManage,
  delManage,
  addManage,
  updateManage,
  getCoinList,
  addCoin,
} from "@/api/bussiness/manage";

export default {
  name: "Manage",
  data() {
    return {
      addCoinForm: { coin: undefined },
      oneOpen: false,
      //查询可添加币种
      coinList: [],
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
      // 币种管理表格数据
      manageList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: null,
        minChargeNum: null,
        maxChargeNum: null,
        // commission: null,
        params: { commissionMin: "", commissionMax: "" },
        sort: null,
        enable: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        minChargeNum: [
          { required: true, message: "最小兑换量不能为空", trigger: "blur" },
        ],
        maxChargeNum: [
          { required: true, message: "最大兑换量不能为空", trigger: "blur" },
        ],
        commission: [
          { required: true, message: "手续费不能为空", trigger: "blur" },
        ],
        enable: [{ required: true, message: "状态不能为空", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  methods: {
    changeCoin(e) {
      this.currentMarket = this.coinList.filter((item) => {
        return item.id == e;
      });
    },
    /**查询秒合约下面的币种 */
    getCoinList() {
      getCoinList().then((res) => {
        this.coinList = res.rows.map((elem) => {
          elem.label = `${elem.symbol}-${elem.market}`;
          return elem;
        });
      });
    },
    /** 查询币种管理列表 */
    getList() {
      this.loading = true;
      listManage(this.queryParams).then((response) => {
        this.manageList = response.rows;
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
        symbol: null,
        minChargeNum: null,
        maxChargeNum: null,
        commission: null,
        sort: null,
        enable: null,
        remark: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        delFlag: null,
        currentId: null,
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
      console.log(selection, "selection");
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getCoinList();
      this.open = true;
      this.title = "添加币种管理";
      console.log(this.form, "this.form this.form ");
    },
    /** 一键新增按钮操作 */
    handleOneAdd() {
      this.getCoinList();
      this.reset();
      this.oneOpen = true;
      this.title = "一键新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getManage(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改币种管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateManage(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form["market"] = this.currentMarket[0].market;
            this.form.symbol = this.currentMarket[0].symbol;
            addManage(this.form).then((response) => {
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
        .confirm("是否确认删除选中的币种？")
        .then(function () {
          return delManage(ids);
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
        "bussiness/manage/export",
        {
          ...this.queryParams,
        },
        `manage_${new Date().getTime()}.xlsx`
      );
    },
    /**获取新增币种 */
    bindList(selection) {
      let arr = selection.map((item) => item.symbol.toLowerCase());
      if (arr.length == 0) {
        this.addCoinForm.coin = "";
      } else if (arr.length == 1) {
        this.addCoinForm.coin = arr.join("");
      } else {
        this.addCoinForm.coin = arr.join(",");
      }
    },
    /**一键新增币种 */
    addCoin() {
      addCoin({ symbols: this.addCoinForm.coin }).then((res) => {
        this.getList();
        this.$modal.msgSuccess(res.msg);
      });
    },
    submitOneForm() {
      this.addCoin();
      this.oneOpen = false;
      this.getList();
    },
    oneCancel() {
      this.oneOpen = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.amount.el-input {
  width: 100px;
}
</style>
