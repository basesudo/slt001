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

        <el-form-item label="仓位编号" prop="orderNo">
          <el-input
            v-model="queryParams.orderNo"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="queryParams.status" clearable>
            <el-option
              v-for="dict in dict.type.sys_contract_status"
              :key="dict.label"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
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
        :data="positionList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="主键" align="center" prop="id" /> -->
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="用户名" align="center" prop="userName" />
        <el-table-column
          label="仓位编号"
          align="center"
          prop="orderNo"
          width="120"
        >
          <template slot-scope="scope">
            <el-link
              :underline="false"
              v-clipboard="scope.row.orderNo"
              v-clipboard:success="clipboardSuccess"
              >{{ scope.row.orderNo }} <i class="el-icon-copy-document"></i>
            </el-link>
          </template>
        </el-table-column>

        <el-table-column label="交易类型" align="center" prop="type" width="120"
          ><template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_ucontract_tradetype"
              :value="scope.row.type"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="委托类型"
          align="center"
          prop="delegateType"
          width="120"
        >
          <template slot-scope="scope">
            <dict-tag
              size="mini"
              :options="dict.type.sys_ucontract_delegatetype"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column label="状态 " align="center" prop="status" width="120">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.sys_contract_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          align="center"
          prop="auditStatus"
          width="120"
        >
          <template slot-scope="scope">
            <dict-tag
              size="mini"
              :options="dict.type.positon_audit_status"
              :value="scope.row.auditStatus"
            />
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" prop="symbol" />
        <el-table-column label="保证金" align="center" prop="amount" />
        <el-table-column label="杠杆" align="center" prop="leverage" />
        <el-table-column label="当前收益" align="center" prop="ureate" />
        <el-table-column label="收益" align="center" prop="earn" />
        <el-table-column label="持仓数量" align="center" prop="openNum" />
        <el-table-column label="开仓均价" align="center" prop="openPrice" />
        <el-table-column label="预计强平价" align="center" prop="closePrice" />

        <el-table-column label="开仓手续费" align="center" prop="openFee" />

        <el-table-column
          label="调整保证金"
          align="center"
          prop="adjustAmount"
        />
        <el-table-column label="成交价" align="center" prop="dealPrice" />
        <el-table-column label="成交量" align="center" prop="dealNum">
          <template slot-scope="scope">
            <span>{{ scope.row.dealNum }} </span>
          </template>
        </el-table-column>
        <el-table-column
          label="成交时间"
          align="center"
          prop="dealTime"
          width="150"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.dealTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卖出手续费" align="center" prop="sellFee" />
        <el-table-column
          fixed="right"
          label="操作"
          width="150"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns" v-if="!['rxce'].includes(VUE_APP_ENV)">
              <el-button
                size="small"
                plain
                type="primary"
                @click="lookFor(scope.row)"
                v-hasPermi="['bussiness:position:query']"
                >止盈止损</el-button
              >
              <el-button
                v-if="scope.row.auditStatus === 3"
                size="small"
                plain
                type="primary"
                @click="positionReview(scope.row)"
                v-hasPermi="['bussiness:position:pass']"
                >平仓审核</el-button
              >
            </div>
            <div class="btns" v-else>
              <el-button
                v-if="scope.row.auditStatus != 1"
                size="small"
                plain
                type="warning"
                @click="positionReview(scope.row)"
                v-hasPermi="['bussiness:position:pass']"
                >平仓审核</el-button
              >
              <el-button
                v-if="scope.row.status != 1"
                size="small"
                plain
                type="danger"
                @click="stopPositon(scope.row)"
                v-hasPermi="['bussiness:position:stopPosition']"
                >平仓</el-button
              >
              <el-button
                size="small"
                plain
                type="primary"
                @click="handleSetUp(scope.row)"
                v-hasPermi="['bussiness:position:edit']"
                >开启平仓设置</el-button
              >
              <el-button
                v-if="scope.row.status != 1"
                size="small"
                plain
                type="success"
                @click="baoPositon(scope.row)"
                v-hasPermi="['bussiness:position:stopAll']"
                >一键爆仓</el-button
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
    <!-- 添加或修改用户充值对话框 -->
    <el-dialog
      :title="'平仓审核'"
      :visible.sync="reviewOpen"
      width="800px"
      append-to-body
    >
      <el-form
        ref="form"
        :model="reviewForm"
        :rules="reviewFormRules"
        label-width="80px"
      >
        <el-form-item label="仓位编号" prop="orderNo">
          <el-input v-model="reviewForm.orderNo" disabled />
        </el-form-item>
        <el-form-item label="交易类型" prop="type">
          <el-select v-model="reviewForm.type" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.sys_ucontract_tradetype"
              :key="dict.label"
              :label="dict.label"
              :value="Number(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="委托类型" prop="status">
          <el-select v-model="reviewForm.status" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.sys_ucontract_delegatetype"
              :key="dict.label"
              :label="dict.label"
              :value="Number(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="币种" prop="symbol">
          <el-input v-model="reviewForm.symbol" />
        </el-form-item>
        <el-form-item label="持仓数量" prop="openNum">
          <el-input v-model="reviewForm.openNum" />
        </el-form-item>
        <el-form-item label="开仓均价" prop="openPrice">
          <el-input v-model="reviewForm.openPrice" />
        </el-form-item>
        <el-form-item label="成交价" prop="dealPrice">
          <el-input v-model="reviewForm.dealPrice" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="pass">通过</el-button>
        <el-button @click="canceled">关闭</el-button>
        <el-button @click="close" type="warning">不通过</el-button>
      </div>
    </el-dialog>
    <!-- 编辑合约设置 -->
    <el-dialog
      :title="'合约设置'"
      :visible.sync="setUpOpen"
      width="600px"
      append-to-body
    >
      <el-form
        ref="setForm"
        :model="setForm"
        :rules="setFormRules"
        label-width="120px"
      >
        <el-form-item label="平仓天数" prop="deliveryDays">
          <el-input v-model.number="setForm.deliveryDays" />
        </el-form-item>
        <!-- <el-form-item label="最小保证金" prop="minMargin">
          <el-input v-model="setForm.minMargin" />
        </el-form-item> -->
        <el-form-item label="止盈率" prop="earnRate">
          <el-input v-model="setForm.earnRate" />
        </el-form-item>
        <el-form-item label="止损率" prop="lossRate">
          <el-input v-model="setForm.lossRate" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitSetForm">确 定</el-button>
        <el-button @click="cancelSet">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listPosition,
  passReview,
  reject,
  updatePosition,
  stopPositon,
  getPosition,
  stopAllPositon,
} from "@/api/bussiness/position";

export default {
  name: "Position",
  dicts: [
    "sys_contract_status",
    "sys_ucontract_tradetype",
    "sys_ucontract_delegatetype",
    "positon_audit_status",
  ],
  data() {
    return {
      /**合约设置 */
      setUpOpen: false,
      reviewOpen: false,
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
      // U本位持仓表表格数据
      positionList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        type: null,
        delegateType: null,
        status: null,
        amount: null,
        openNum: null,
        openPrice: null,
        closePrice: null,
        orderNo: null,
        userId: null,
        openFee: null,
        leverage: null,
        symbol: null,
        adjustAmount: null,
        earn: null,
        dealPrice: null,
        dealNum: null,
        dealTime: null,
        sellFee: null,
        remainMargin: null,
        assetFee: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        type: [
          { required: true, message: "购买类型不能为空", trigger: "change" },
        ],
        delegateType: [
          { required: true, message: "委托类型不能为空", trigger: "change" },
        ],
        status: [
          { required: true, message: "状态  0 不能为空", trigger: "change" },
        ],
        amount: [
          { required: true, message: "保证金不能为空", trigger: "blur" },
        ],
        openNum: [
          { required: true, message: "持仓数量不能为空", trigger: "blur" },
        ],
        openPrice: [
          { required: true, message: "开仓均价不能为空", trigger: "blur" },
        ],
        closePrice: [
          { required: true, message: "预计强平价不能为空", trigger: "blur" },
        ],
        orderNo: [
          { required: true, message: "仓位编号不能为空", trigger: "blur" },
        ],
        userId: [
          { required: true, message: "用户ID不能为空", trigger: "blur" },
        ],
        openFee: [
          { required: true, message: "开仓手续费不能为空", trigger: "blur" },
        ],
        leverage: [
          { required: true, message: "杠杆不能为空", trigger: "blur" },
        ],
        symbol: [
          { required: true, message: "交易对不能为空", trigger: "blur" },
        ],
        createTime: [
          { required: true, message: "创建时间不能为空", trigger: "blur" },
        ],
      },
      reviewForm: {},
      reviewFormRules: {},
      // 表单参数
      setForm: {},
      // 表单校验
      // deliveryDays: [
      //   { required: true, message: "交割时间不能为空", trigger: "blur" },
      // ],
      // minMargin: [
      //   { required: true, message: "最小保证金不能为空", trigger: "blur" },
      // ],
      setFormRules: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    stopPositon(row) {
      let data = {
        id: row.id,
      };
      stopPositon(data).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$modal.msgSuccess("平仓成功");
        } else {
          this.$modal.msgSuccess("平仓失败");
        }
      });
    },
    baoPositon(row) {
      let data = {
        id: row.id,
      };
      stopAllPositon(data).then((res) => {
        if (res.code == 200) {
          this.getList();
          this.$modal.msgSuccess("爆仓成功");
        } else {
          this.$modal.msgSuccess("爆仓失败");
        }
      });
    },
    /**合约设置 */
    handleSetUp(row) {
      getPosition(row.id).then((res) => {
        if (res.code == 200) {
          this.setForm = res.data;
          this.setUpOpen = true;
        }
      });
    },
    // 取消按钮
    cancelSet() {
      this.setUpOpen = false;
      this.reset();
    },
    submitSetForm() {
      let data = {
        id: this.setForm.id,
        deliveryDays: this.setForm.deliveryDays,
        earnRate: this.setForm.earnRate,
        lossRate: this.setForm.lossRate,
      };
      updatePosition(data).then((response) => {
        if (response.code == 200) {
          this.$modal.msgSuccess("设置成功");
          this.setUpOpen = false;
          this.getList();
        }
      });
    },
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    lookFor(row) {
      this.$router.push(`/uContract/orderList?id=${row.id}`);
    },
    positionReview(row) {
      this.reviewForm = row;
      this.reviewOpen = true;
    },
    /** 查询U本位持仓表列表 */
    getList() {
      this.loading = true;
      listPosition(this.queryParams).then((response) => {
        this.positionList = response.rows;
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
        type: null,
        delegateType: null,
        status: null,
        amount: null,
        openNum: null,
        openPrice: null,
        closePrice: null,
        orderNo: null,
        userId: null,
        openFee: null,
        leverage: null,
        symbol: null,
        createTime: null,
        adjustAmount: null,
        earn: null,
        dealPrice: null,
        dealNum: null,
        dealTime: null,
        sellFee: null,
        remainMargin: null,
        assetFee: null,
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

    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "bussiness/position/export",
        {
          ...this.queryParams,
        },
        `position_${new Date().getTime()}.xlsx`
      );
    },
    passReview() {
      passReview(this.reviewForm).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.getList();
        this.reviewOpen = false;
      });
    },
    unPassReview() {
      reject(this.reviewForm).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.getList();
        this.reviewOpen = false;
      });
    },
    pass() {
      this.passReview();
    },
    close() {
      this.unPassReview();
    },
    canceled() {
      this.reviewOpen = false;
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
    flex: 1;
    margin: 5px;
  }
}
</style>
