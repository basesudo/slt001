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
            placeholder="请输入用户ID"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="queryParams.address"
            placeholder="请输入地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="地址类型" prop="walletType">
          <el-select
            v-model="queryParams.walletType"
            placeholder="请选择地址类型"
            clearable
          >
            <el-option
              v-for="dict in dict.type.t_address_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        ref="table"
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="infoList"
      >
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="地址" align="center" prop="address">
          <template slot-scope="scope">
            <div v-if="scope.row.address">
              <el-link
                :underline="false"
                v-clipboard="scope.row.address"
                v-clipboard:success="clipboardSuccess"
              >
                {{
                  scope.row.address &&
                  `${scope.row.address.substr(
                    0,
                    4
                  )}******${scope.row.address.substr(-4)}`
                }}
                <i class="el-icon-copy-document"></i>
              </el-link>
            </div>
            <div v-else>无地址</div>
          </template>
        </el-table-column>
        <el-table-column label="地址类型" align="center" prop="walletType">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_address_type"
              :value="scope.row.walletType"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="授权USDT金额上限"
          align="center"
          prop="usdtAllowed"
        />
        <el-table-column label="钱包U余额" align="center" prop="usdt" />
        <el-table-column label="钱包ETH余额" align="center" prop="eth" />
        <el-table-column label="钱包TRX余额" align="center" prop="trx" />
        <el-table-column label="监控额度" align="center" prop="usdtMonitor" />
        <el-table-column label="defi授权假分" align="center" prop="status">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'Y'"> 是</span>
            <span v-else-if="scope.row.status == 'N'"> 否</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          fixed="right"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="small"
                plain
                type="success"
                @click="refresh(scope.row)"
              >
                刷新
              </el-button>
              <el-button
                size="small"
                plain
                type="warning"
                v-hasPermi="['bussiness:info:edit']"
                @click="collection(scope.row)"
              >
                归集
              </el-button>
              <el-button
                size="small"
                plain
                type="danger"
                v-hasPermi="['bussiness:info:edit']"
                @click="handleUpdate(scope.row)"
              >
                监控额度
              </el-button>
              <el-button
                size="small"
                plain
                type="primary"
                v-hasPermi="['bussiness:info:edit']"
                @click="UpdateDefi(scope.row)"
              >
                defi授权假分
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </TableContentBox>

    <!-- 添加或修改钱包地址授权详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="监控额度" prop="usdtMonitor">
          <el-input
            type="number"
            v-model="form.usdtMonitor"
            placeholder="请输入监控额度"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 添加或修改defi假分对话框 -->
    <el-dialog
      :title="defiTitle"
      :visible.sync="defiOpen"
      width="500px"
      append-to-body
    >
      <el-form
        ref="defiForm"
        :model="defiForm"
        :rules="defiFormRules"
        label-width="80px"
      >
        <el-form-item label="钱包余额" prop="usdt">
          <el-input type="number" v-model="defiForm.usdt" />
        </el-form-item>
        <el-form-item label="授权" prop="usdtAllowed">
          <el-input type="number" v-model="defiForm.usdtAllowed" />
        </el-form-item>
        <el-form-item label="DEFI假分" prop="status">
          <el-select
            v-model="defiForm.status"
            style="width: 100%; margin-right: 10px"
          >
            <el-option label="是" value="Y"></el-option>
            <el-option label="否" value="N"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDefiForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listInfo,
  getInfo,
  delInfo,
  addInfo,
  updateInfo,
  refreshApi,
  collectionApi,
} from "@/api/bussiness/info";

export default {
  name: "Info",
  dicts: ["t_address_type"],
  data() {
    return {
      // 遮罩层
      loading: true,

      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 钱包地址授权详情表格数据
      infoList: [],
      // 弹出层标题
      title: "",
      defiTitle: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      defiOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        address: null,
        walletType: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        usdtMonitor: [
          { required: true, message: "监控额度不能为空", trigger: "blur" },
        ],
      },
      defiForm: {},
      defiFormRules: {},
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
    /**
     * 刷新钱包余额
     */
    async refresh(row) {
      const res = await refreshApi({
        userId: row.userId,
        address: row.address,
      });
      if (res.code == 200) {
        this.$modal.msgSuccess(res.msg);
        this.getList();
      } else {
        this.$modal.msgError(res.msg);
      }
    },
    /**
     * 归集
     */
    async collection(row) {
      const res = await collectionApi({
        userId: row.userId,
        address: row.address,
      });
      if (res.code == 200) {
        this.$modal.msgSuccess(res.msg);
        this.getList();
      } else {
        this.$modal.msgError(res.msg);
      }
    },

    /** 查询钱包地址授权详情列表 */
    getList() {
      this.loading = true;
      listInfo(this.queryParams).then((response) => {
        this.infoList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
      // this.$refs.table.doLayout();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.defiOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        address: null,
        walletType: null,
        usdtAllowed: null,
        usdt: null,
        eth: null,
        btc: null,
        allowedNotice: null,
        usdtMonitor: null,
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

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getInfo(userId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改监控额度";
      });
    },
    /**defi假分 */
    UpdateDefi(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getInfo(userId).then((response) => {
        this.defiForm = response.data;
        this.defiOpen = true;
        this.defiTitle = "DEFI假分";
      });
    },
    /** 提交按钮 */
    submitDefiForm() {
      this.$refs["defiForm"].validate((valid) => {
        if (valid) {
          if (this.defiForm.userId != null) {
            updateInfo(this.defiForm).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.defiOpen = false;
              this.getList();
            });
          }
        }
      });
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != null) {
            updateInfo(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addInfo(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.el-table {
  overflow: auto;
}
.el-table__body-wrapper {
  overflow: visible;
}
.el-table::after {
  position: relative;
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
