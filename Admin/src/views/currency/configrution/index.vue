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
        <el-form-item label="交易对" prop="symbol">
          <el-input
            v-model="queryParams.symbol"
            placeholder="请输入交易对"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="交易币种" prop="coin">
          <el-input
            v-model="queryParams.coin"
            placeholder="请输入交易币种"
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
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="handleOneAdd"
            v-hasPermi="['bussiness:currency:symbol:add']"
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
            v-hasPermi="['bussiness:currency:symbol:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            size="mini"
            :disabled="single"
            @click="handleUpdate"
            v-hasPermi="['bussiness:currency:symbol:edit']"
            >修改</el-button
          >
        </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['bussiness:currency:symbol:remove']"
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
            v-hasPermi="['bussiness:currency:export']"
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
        :data="currencyList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="50" align="center" />
        <!-- <el-table-column label="id" align="center" prop="id" /> -->
        <el-table-column label="图标" align="center" prop="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" style="width: 30px" />
          </template>
        </el-table-column>
        <el-table-column
          label="交易对"
          align="center"
          prop="symbol"
          width="120"
        />
        <el-table-column
          label="前端展示交易对"
          align="center"
          prop="showSymbol"
          width="120"
        />

        <el-table-column label="交易 / 结算币种" width="120" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.coin }}<span> / </span>{{ scope.row.baseCoin }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="手续费(%)" align="center" prop="feeRate" />
        <el-table-column label="最小 / 最大下单量" width="90" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.orderMin }}<span> / </span>{{ scope.row.orderMax }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="最低卖出量"
          width="90"
          align="center"
          prop="minSell"
        >
        </el-table-column>

        <el-table-column label="启用禁用" align="center">
          <template slot-scope="scope">
            <el-tag
              type="primary"
              size="mini"
              plain
              v-if="scope.row.enable == 1"
              >启用</el-tag
            >
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.enable == 2"
              >禁用</el-tag
            >
          </template>
        </el-table-column>
        <!-- <el-table-column label="显示" align="center" prop="isShow" width="60">
          <template slot-scope="scope">
            <el-tag type="danger" size="mini" plain v-if="scope.row.isShow == 1"
              >显示</el-tag
            >
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.isShow == 2"
              >隐藏</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="可交易" align="center" width="60">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.isDeal == 1"
              >是
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.isDeal == 2"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="市价买" align="center" width="60">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.marketBuy == 1"
              >是
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.marketBuy == 2"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="市价卖" align="center" width="60">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.marketSell == 1"
              >是
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.marketSell == 2"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="限价买" align="center" width="60">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.limitedBuy == 1"
              >是
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.limitedBuy == 2"
              >否</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="限价卖" align="center" width="60">
          <template slot-scope="scope">
            <el-tag
              type="success"
              size="mini"
              plain
              v-if="scope.row.limitedSell == 1"
              >是
            </el-tag>
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.limitedSell == 2"
              >否</el-tag
            >
          </template>
        </el-table-column> -->

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
              v-hasPermi="['bussiness:currency:symbol:query']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:currency:symbol:remove']"
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
    <!-- 添加或修改币币交易币种配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="select">
          <el-form-item label="展示交易对" prop="showSymbol">
            <el-input v-model="form.showSymbol" />
          </el-form-item>
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
          <el-form-item label="手续费率" prop="feeRate">
            <el-input v-model="form.feeRate" />
          </el-form-item>
          <el-form-item label="最小下单量" prop="orderMin">
            <el-input type="number" v-model="form.orderMin" />
          </el-form-item>
          <el-form-item label="最大下单量" prop="orderMax">
            <el-input type="number" v-model="form.orderMax" />
          </el-form-item>
          <el-form-item label="最低卖出量" prop="minSell">
            <el-input v-model="form.minSell" />
          </el-form-item>
        </div>
        <!-- 1展示 2不展示 -->
        <el-form-item label="启用" prop="enable">
          <el-switch
            v-model="form.enable"
            :active-value="'1'"
            :inactive-value="'2'"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="submitForm"
          v-hasPermi="['bussiness:currency:symbol:edit']"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
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
              <el-table-column label="图标" align="center" prop="logo">
                <template slot-scope="scope">
                  <img :src="scope.row.logo" style="width: 30px" />
                </template>
              </el-table-column>
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
        <el-button
          type="primary"
          @click="submitOneForm"
          v-hasPermi="['bussiness:currency:symbol:add']"
          >确 定</el-button
        >
        <el-button @click="oneCancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listConfiguration,
  getCurrency,
  delCurrency,
  addCurrency,
  updateCurrency,
  addOneCurrency,
  getCoinList,
} from "@/api/bussiness/currency";

export default {
  name: "Currency",
  data() {
    return {
      currentMarket: "",
      coinList: [],
      addCoinForm: { symbols: undefined },
      oneOpen: false,
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
      // 币币交易币种配置表格数据
      currencyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: null,
        coin: null,
        baseCoin: null,
        feeRate: null,
        coinPrecision: null,
        basePrecision: null,
        sellMin: null,
        buyMax: null,
        orderMin: null,
        orderMax: null,
        minSell: null,
        enable: null,
        isShow: null,
        isDeal: null,
        marketBuy: null,
        marketSell: null,
        limitedBuy: null,
        limitedSell: null,
        createDate: null,
        updateDate: null,
        searchValue: null,
        showSymbol: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        coin: [
          { required: true, message: "交易币种不能为空", trigger: "blur" },
        ],
        feeRate: [
          { required: true, message: "手续费率不能为空", trigger: "blur" },
        ],
        orderMin: [
          { required: true, message: "最小下单量不能为空", trigger: "blur" },
        ],
        orderMax: [
          { required: true, message: "最大下单量不能为空", trigger: "blur" },
        ],
        minSell: [
          { required: true, message: "最低卖出量不能为空", trigger: "blur" },
        ],
      },
    };
  },

  created() {
    this.getList();
  },

  methods: {
    /**筛选当前交易所 */
    changeCoin(e) {
      this.currentMarket = this.coinList.filter((item) => {
        return item.id == e;
      });
    },
    getCoinList() {
      getCoinList().then((res) => {
        this.coinList = res.rows.map((elem) => {
          elem.label = `${elem.symbol}-${elem.market}`;
          return elem;
        });
      });
    },
    /** 查询币币交易币种配置列表 */
    getList() {
      this.loading = true;
      listConfiguration(this.queryParams).then((response) => {
        this.currencyList = response.rows;
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
        coin: null,
        baseCoin: null,
        feeRate: null,
        coinPrecision: null,
        basePrecision: null,
        sellMin: null,
        buyMax: null,
        orderMin: null,
        orderMax: null,
        minSell: null,
        enable: null,
        isShow: null,
        isDeal: null,
        marketBuy: null,
        marketSell: null,
        limitedBuy: null,
        limitedSell: null,
        createBy: null,
        createDate: null,
        updateBy: null,
        updateDate: null,
        searchValue: null,
        showSymbol: null,
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
      this.ids = selection.map((item) => item.id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.getCoinList();
      this.form = {
        id: null,
        symbol: null,
        coin: null,
        baseCoin: null,
        feeRate: null,
        coinPrecision: null,
        basePrecision: null,
        sellMin: null,
        buyMax: null,
        orderMin: null,
        orderMax: null,
        minSell: null,
        enable: "1",
        isShow: null,
        isDeal: null,
        marketBuy: null,
        marketSell: null,
        limitedBuy: null,
        limitedSell: null,
        createBy: null,
        createDate: null,
        updateBy: null,
        updateDate: null,
        searchValue: null,
        showSymbol: null,
        currentId: null,
      };
      this.open = true;
      this.title = "添加币币交易币种配置";
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
      this.form = row;
      this.open = true;
      this.title = "修改币币交易币种配置";
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCurrency(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form["market"] = this.currentMarket[0].market;
            this.form.coin = this.currentMarket[0].symbol;
            addCurrency(this.form).then((response) => {
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
        .confirm('是否确认删除币币交易币种配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCurrency(ids);
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
        "bussiness/currency/export",
        {
          ...this.queryParams,
        },
        `currency_${new Date().getTime()}.xlsx`
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
      addOneCurrency({ symbols: this.addCoinForm.coin }).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.getList();
      });
    },

    submitOneForm() {
      this.addCoin();
      this.oneOpen = false;
    },
    oneCancel() {
      this.oneOpen = false;
    },
  },
};
</script>
<style lang="scss" scoped></style>
