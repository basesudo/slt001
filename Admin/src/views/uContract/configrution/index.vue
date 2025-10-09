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
        <el-form-item label="交易对" prop="symbol">
          <el-input
            v-model="queryParams.symbol"
            placeholder="请输入交易对"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="币种" prop="coin">
          <el-input
            v-model="queryParams.coin"
            placeholder="请输入币种"
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
            v-hasPermi="['bussiness:ucontract:add']"
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
            v-hasPermi="['bussiness:ucontract:export']"
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
        :data="ucontractList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="图标" align="center" prop="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" style="width: 30px" />
          </template>
        </el-table-column>

        <!-- <el-table-column label="主键" align="center" prop="id" /> -->

        <el-table-column label="交易对" align="center" prop="symbol" />
        <el-table-column
          label="前端展示交易对"
          align="center"
          prop="showSymbol"
          width="120"
        />
        <el-table-column
          label="合约面值"
          align="center"
          prop="shareNumber"
          width="120"
        >
          <template slot-scope="scope">
            <span v-if="['das'].includes(VUE_APP_ENV)">
              {{ scope.row.shareNumber }}/USDT</span
            >
            <span v-else
              >{{ scope.row.shareNumber }}/{{
                scope.row.coin.toUpperCase()
              }}</span
            >
          </template>
        </el-table-column>
        <el-table-column label="杠杆倍数" align="center" prop="leverage" />
        <el-table-column label="是否启用" align="center" prop="enable">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_enable"
              :value="scope.row.enable"
            />
          </template>
        </el-table-column>
        <el-table-column label="前端显示" align="center" prop="visible">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_show"
              :value="scope.row.visible"
            />
          </template>
        </el-table-column>
        <el-table-column label="是否可交易" align="center" prop="exchangeable">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_trade"
              :value="scope.row.exchangeable"
            />
          </template>
        </el-table-column>
        <el-table-column label="开空" align="center" prop="enableOpenSell"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_opensell"
              :value="scope.row.enableOpenSell"
            />
          </template>
        </el-table-column>
        <el-table-column label="开多" align="center" prop="enableOpenBuy"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_openbuy"
              :value="scope.row.enableOpenBuy"
            />
          </template>
        </el-table-column>
        <el-table-column label="市价开空" align="center" prop="enableMarketSell"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_marketsell"
              :value="scope.row.enableMarketSell"
            />
          </template>
        </el-table-column>
        <el-table-column label="市价开多" align="center" prop="enableMarketBuy"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.con_ucontract_marketbuy"
              :value="scope.row.enableMarketBuy"
            />
          </template>
        </el-table-column>
        <el-table-column label="开仓手续费" align="center" prop="openFee" />
        <el-table-column label="平仓手续费" align="center" prop="closeFee" />
        <el-table-column label="资金费率" align="center" prop="usdtRate" />
        <el-table-column label="资金周期" align="center" prop="intervalHour" />
        <el-table-column label="币种小数精度" align="center" prop="coinScale" />
        <el-table-column
          label="基础币小数精度"
          align="center"
          prop="baseScale"
        />
        <el-table-column label="最小数" align="center" prop="minShare" />
        <el-table-column label="最大数" align="center" prop="maxShare" />
        <!-- <el-table-column label="平台收益" align="center" prop="totalProfit" /> -->
        <el-table-column label="排序字段" align="center" prop="sort" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                v-if="['das'].includes(VUE_APP_ENV)"
                size="small"
                plain
                type="warning"
                @click="handleUpdateProfit(scope.row)"
                v-hasPermi="['bussiness:ucontract:edit']"
                >浮动盈利设置</el-button
              >
              <el-button
                size="small"
                plain
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:ucontract:edit']"
                >修改</el-button
              >
              <el-button
                size="small"
                plain
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:ucontract:remove']"
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
    <!-- 添加或修改U本位合约币种对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div class="dis">
          <el-form-item label="前端展示交易对" prop="showSymbol">
            <el-input v-model="form.showSymbol" />
          </el-form-item>
          <el-form-item label="交易对" prop="symbol">
            <el-input v-model="form.symbol" disabled />
          </el-form-item>
          <el-form-item label="交易币种" prop="currentId" v-if="change == 0">
            <el-select
              v-model="form.currentId"
              filterable
              clearable
              @change="changeCoin"
              style="width: 100%"
            >
              <el-option
                v-for="coin in coinList"
                :key="coin.id"
                :label="coin.label"
                :value="coin.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="交易币种" prop="coin" v-else-if="change == 1">
            <el-input v-model="form.coin" disabled />
          </el-form-item>
          <el-form-item label="图标" prop="logo">
            <ImageUpload :limit="1" v-model="form.logo"></ImageUpload>
          </el-form-item>
          <el-form-item label="结算币种" prop="baseCoin">
            <el-input v-model="form.baseCoin" />
          </el-form-item>
          <el-form-item label="杠杆倍数" prop="leverage">
            <el-input v-model="form.leverage" />
          </el-form-item>
          <el-form-item label="合约面值" prop="shareNumber">
            <el-input v-model="form.shareNumber" />
          </el-form-item>

          <el-form-item label="开仓手续费" prop="openFee">
            <el-input v-model="form.openFee" />
          </el-form-item>
          <el-form-item label="平仓手续费" prop="closeFee">
            <el-input v-model="form.closeFee" />
          </el-form-item>
          <el-form-item label="资金费率" prop="usdtRate">
            <el-input v-model="form.usdtRate" />
          </el-form-item>
          <el-form-item label="资金费率周期" prop="intervalHour">
            <el-input v-model="form.intervalHour" />
          </el-form-item>
          <el-form-item label="币种小数精度" prop="coinScale">
            <el-input v-model="form.coinScale" />
          </el-form-item>
          <el-form-item label="基础币小数精度" prop="baseScale">
            <el-input v-model="form.baseScale" />
          </el-form-item>
          <el-form-item label="最小数（手）" prop="minShare">
            <el-input v-model="form.minShare" />
          </el-form-item>
          <el-form-item label="最大数（手）" prop="maxShare">
            <el-input v-model="form.maxShare" />
          </el-form-item>
          <el-form-item label="排序字段" prop="sort">
            <el-input v-model="form.sort" />
          </el-form-item>
        </div>
        <div class="select">
          <!-- 1展示 2不展示 -->
          <el-form-item label="是否启用" prop="enable">
            <el-switch
              v-model="form.enable"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="前端显示" prop="visible">
            <el-switch
              v-model="form.visible"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="是否可交易" prop="exchangeable">
            <el-switch
              v-model="form.exchangeable"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="开空" prop="enableOpenSell">
            <el-switch
              v-model="form.enableOpenSell"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="开多" prop="enableOpenBuy">
            <el-switch
              v-model="form.enableOpenBuy"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="市价开空" prop="enableMarketSell">
            <el-switch
              v-model="form.enableMarketSell"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
          <el-form-item label="市价开多" prop="enableMarketBuy">
            <el-switch
              v-model="form.enableMarketBuy"
              :active-value="0"
              :inactive-value="1"
            ></el-switch>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 修改浮动盈利 -->
    <el-dialog
      :title="title"
      :visible.sync="openProfit"
      width="400px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rulesProfit"
        label-width="100px"
      >
        <div class="dis">
          <el-form-item label="交易对" prop="symbol">
            <el-input v-model="form.symbol" disabled />
          </el-form-item>
          <el-form-item label="浮动盈利点" prop="floatProfit">
            <el-input v-model="form.floatProfit" />
          </el-form-item>
          <el-form-item label="浮动盈亏" prop="profitLoss">
            <el-input v-model="form.profitLoss" />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormProfit">确 定</el-button>
        <el-button @click="cancelProfit">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUcontract,
  getUcontract,
  delUcontract,
  addUcontract,
  updateUcontract,
} from "@/api/bussiness/ucontract";
import { getCoinList } from "@/api/bussiness/currency";
export default {
  name: "Ucontract",
  dicts: [
    "con_ucontract_show",
    "con_ucontract_enable",
    "con_ucontract_trade",
    "con_ucontract_marketsell",
    "con_ucontract_marketbuy",
    "con_ucontract_opensell",
    "con_ucontract_openbuy",
  ],
  data() {
    return {
      coinList: [],
      //是否可以修改
      change: "",
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
      // U本位合约币种表格数据
      ucontractList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openProfit: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: null,
        coin: null,
        baseCoin: null,
        shareNumber: null,
        leverage: null,
        enable: null,
        visible: null,
        exchangeable: null,
        enableOpenSell: null,
        enableOpenBuy: null,
        enableMarketSell: null,
        enableMarketBuy: null,
        openFee: null,
        closeFee: null,
        usdtRate: null,
        intervalHour: null,
        coinScale: null,
        baseScale: null,
        minShare: null,
        maxShare: null,
        totalProfit: null,
        sort: null,
        showSymbol: null,
        currentId: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        symbol: [
          { required: true, message: "交易对不能为空", trigger: "blur" },
        ],
        coin: [{ required: true, message: "币种不能为空", trigger: "blur" }],
        enable: [
          {
            required: true,
            message: "0 启用  1 禁止不能为空",
            trigger: "change",
          },
        ],
        visible: [
          {
            required: true,
            message: "前端显示0启用 1 禁止不能为空",
            trigger: "change",
          },
        ],
        exchangeable: [
          { required: true, message: "是否可交易不能为空", trigger: "change" },
        ],
        enableOpenSell: [
          { required: true, message: "开空  不能为空", trigger: "change" },
        ],
        enableOpenBuy: [
          { required: true, message: "开多  不能为空", trigger: "change" },
        ],
        enableMarketSell: [
          { required: true, message: "市价开空不能为空", trigger: "change" },
        ],
        enableMarketBuy: [
          { required: true, message: "市价开多不能为空", trigger: "change" },
        ],
        openFee: [
          { required: true, message: "开仓手续费不能为空", trigger: "blur" },
        ],
        closeFee: [
          { required: true, message: "平仓手续费不能为空", trigger: "blur" },
        ],
        usdtRate: [
          { required: true, message: "资金费率不能为空", trigger: "blur" },
        ],
        intervalHour: [
          { required: true, message: "资金周期不能为空", trigger: "blur" },
        ],
        maxShare: [
          { required: true, message: "最大数不能为空", trigger: "blur" },
        ],
        minShare: [
          { required: true, message: "最小数不能为空", trigger: "blur" },
        ],
        baseScale: [
          {
            required: true,
            message: "基础币小数精度不能为空",
            trigger: "blur",
          },
        ],
        coinScale: [
          { required: true, message: "币种小数精度不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "币排序字段不能为空", trigger: "blur" },
        ],
        baseCoin: [
          { required: true, message: "结算币种不能为空", trigger: "blur" },
        ],
        leverage: [
          { required: true, message: "杠杆倍数不能为空", trigger: "blur" },
        ],
        shareNumber: [
          { required: true, message: "合约面值不能为空", trigger: "blur" },
        ],
        openFee: [
          { required: true, message: "开仓手续费不能为空", trigger: "blur" },
        ],
      },
      rulesProfit: {
        floatProfit: [
          { required: true, message: "浮动盈利点不能为空", trigger: "blur" },
        ],
        profitLoss: [
          { required: true, message: "浮动盈亏不能为空", trigger: "blur" },
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
      this.form.symbol = this.currentMarket[0].symbol.toLowerCase() + "usdt";
      console.log(
        this.currentMarket,
        e,
        "this.currentMarketthis.currentMarket"
      );
    },
    /** 查询新增币种列表 */
    getCoinList() {
      getCoinList().then((res) => {
        this.coinList = res.rows.map((elem) => {
          elem.label = `${elem.symbol}-${elem.market}`;
          return elem;
        });
      });
    },
    /** 查询U本位合约币种列表 */
    getList() {
      this.loading = true;
      listUcontract(this.queryParams).then((response) => {
        this.ucontractList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    cancelProfit() {
      this.openProfit = false;
      this.reset();
    },

    // 表单重置
    reset() {
      this.form = {
        id: null,
        symbol: null,
        coin: null,
        coin: null,
        baseCoin: null,
        shareNumber: null,
        leverage: null,
        enable: null,
        visible: null,
        exchangeable: null,
        enableOpenSell: null,
        enableOpenBuy: null,
        enableMarketSell: null,
        enableMarketBuy: null,
        openFee: null,
        closeFee: null,
        usdtRate: null,
        intervalHour: null,
        coinScale: null,
        baseScale: null,
        minShare: null,
        maxShare: null,
        totalProfit: null,
        sort: null,
        createTime: null,
        updateTime: null,
        showSymbol: null,
        currentId: null,
      };
      this.setForm = { deliveryDays: null, minMargin: null };
      this.resetForm("form");
      this.resetForm("setForm");
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
        shareNumber: null,
        leverage: null,
        enable: 0,
        visible: 0,
        exchangeable: 0,
        enableOpenSell: 0,
        enableOpenBuy: 0,
        enableMarketSell: 0,
        enableMarketBuy: 0,
        openFee: null,
        closeFee: null,
        usdtRate: null,
        intervalHour: null,
        coinScale: null,
        baseScale: null,
        minShare: null,
        maxShare: null,
        totalProfit: null,
        sort: null,
        createTime: null,
        updateTime: null,
        showSymbol: null,
      };
      this.change = 0;
      // this.change = true;
      this.open = true;
      this.title = "添加U本位合约币种";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.change = 1;
      const id = row.id || this.ids;
      // this.change = false;
      getUcontract(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改U本位合约币种";
      });
    },
    handleUpdateProfit(row) {
      this.reset();
      this.change = 1;
      const id = row.id || this.ids;
      // this.change = false;
      getUcontract(id).then((response) => {
        this.form = response.data;
        this.openProfit = true;
        this.title = "修改浮动盈利";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUcontract(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form["market"] = this.currentMarket[0].market;
            this.form.coin = this.currentMarket[0].symbol;
            addUcontract(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitFormProfit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUcontract(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.openProfit = false;
              this.getList();
            });
          } else {
            this.form["market"] = this.currentMarket[0].market;
            this.form.coin = this.currentMarket[0].symbol;
            addUcontract(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.openProfit = false;
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
        .confirm('是否确认删除U本位合约币种编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUcontract(ids);
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
        "bussiness/ucontract/export",
        {
          ...this.queryParams,
        },
        `ucontract_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.dis {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.select {
  display: flex;
  flex-wrap: wrap;
}
.btns {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  button {
    flex: 1;
    margin: 5px;
  }
}
</style>
