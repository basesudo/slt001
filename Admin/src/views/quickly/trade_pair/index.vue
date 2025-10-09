<template>
  <!-- 交易对 -->
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
            placeholder="请输入合约交易对"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- <el-form-item label="显示" prop="showFlag">
          <el-select
            v-model="queryParams.showFlag"
            style="width: 150px; margin-right: 10px"
          >
            <el-option label="展示" value="1"></el-option>
            <el-option label="隐藏 " value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="币种" prop="coin">
          <el-input
            v-model="queryParams.coin"
            placeholder="请输入币种"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-row>
          <el-col :span="24">
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
          </el-col>
        </el-row>
      </el-form>
    </SearchFormBox>
    <TableContentBox>
      <el-row :gutter="10" class="mb8">
        <!-- <el-col :span="1.5">
          <el-button
            type="primary"
            size="mini"
            @click="handleOneAdd"
            v-hasPermi="['bussiness:coin:config:add']"
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
            v-hasPermi="['bussiness:coin:config:add']"
            >新增</el-button
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
            v-hasPermi="['bussiness:coin:config:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleCopy"
            v-hasPermi="['bussiness:coin:config:bathCopy']"
            >周期复制</el-button
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
        <el-table-column label="图标" align="center" prop="logo">
          <template slot-scope="scope">
            <img :src="scope.row.logo" style="width: 30px" />
          </template>
        </el-table-column>

        <el-table-column label="显示名称" align="center" prop="showSymbol" />

        <el-table-column label="交易对" align="center" prop="symbol" />
        <el-table-column label="币种" align="center" prop="coin" />
        <el-table-column label="结算币种" align="center" prop="baseCoin" />
        <el-table-column label="状态" align="center">
          <template slot-scope="scope" prop="status">
            <el-tag type="info" size="mini" plain v-if="scope.row.status == 0">
              关
            </el-tag>
            <el-tag
              type="warning"
              size="mini"
              plain
              v-else-if="scope.row.status == 1"
            >
              开
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="首屏是否显示" align="center">
          <template slot-scope="scope">
            <el-tag
              type="info"
              size="mini"
              plain
              v-if="scope.row.showFlag == 0"
            >
              否
            </el-tag>
            <el-tag
              type="success"
              size="mini"
              plain
              v-else-if="scope.row.showFlag == 1"
            >
              是
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.t_second_coin_type"
              :value="scope.row.type"
            />
          </template>
        </el-table-column>
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="操作"
          fixed="right"
          width="80"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-popover
              class="popover-table-menu"
              placement="bottom"
              width="50"
              trigger="click"
            >
              <div class="popover-table-menu-btn-list">
                <el-button
                  size="mini"
                  plain
                  type="primary"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['bussiness:coin:config:edit']"
                  >修改</el-button
                >
                <el-button
                  size="mini"
                  @click="configuration(scope.row)"
                  v-hasPermi="['period:config:list']"
                  plain
                  type="success"
                  >周期配置</el-button
                >

                <el-button
                  size="mini"
                  plain
                  type="danger"
                  v-hasPermi="['bussiness:coin:config:remove']"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </div>

              <div class="menu" slot="reference">···</div>
            </el-popover>
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

    <!-- 添加或修改秒合约币种配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="币种" prop="currentId" v-if="showChange === 0">
          <el-select
            v-model="form.currentId"
            filterable
            placeholder="请选择币种"
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
        <el-form-item label="币种" v-if="showChange === 1">
          <el-input v-model="nameCoin" disabled />
        </el-form-item>
        <el-form-item label="周期复制" prop="periodId" v-if="showChange != 1">
          <el-select
            v-model="form.periodId"
            filterable
            placeholder="请选择币种"
            clearable
            style="width: 100%"
            @change="changeCycleList"
          >
            <el-option
              v-for="coin in cycleList"
              :key="coin.id"
              :label="coin.showSymbol"
              :value="coin.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="显示名称" prop="showSymbol">
          <el-input v-model="form.showSymbol" placeholder="请输入显示名称" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <!-- 1展示 0不展示 -->
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="首屏展示" prop="showFlag">
          <!-- 1展示 0不展示 -->
          <el-switch
            v-model="form.showFlag"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="form.type" clearable style="width: 100%">
            <el-option
              v-for="dict in dict.type.t_second_coin_type"
              :key="dict.value"
              :label="dict.label"
              :value="Number(dict.value)"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input
            type="number"
            v-model="form.sort"
            placeholder="请输入排序"
          />
        </el-form-item>

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
          v-hasPermi="['bussiness:coin:config:edit']"
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
    <el-dialog
      :title="'币种周期'"
      :visible.sync="copyOpen"
      width="500px"
      append-to-body
    >
      <el-form label-width="80px">
        <el-form-item label="币种" prop="copyId">
          <el-select
            v-model="copyForm.copyId"
            filterable
            placeholder="请选择币种"
            clearable
            style="width: 100%"
            @change="changeCopyCoin"
          >
            <el-option
              v-for="coin in copyList"
              :key="coin.id"
              :label="coin.showSymbol"
              :value="coin.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="周期复制" prop="copyIds">
          <el-select
            multiple
            collapse-tags
            v-model="copyForm.copyIds"
            filterable
            placeholder="请选择币种"
            clearable
            style="width: 100%"
            @change="changeCopyCoinList"
          >
            <el-option
              v-for="coin in cycleList.filter((item) => {
                return item.id != this.copyForm.copyId;
              })"
              :key="coin.id"
              :label="coin.showSymbol"
              :value="coin.id"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveCopyCoin">确 定</el-button>
        <el-button @click="copyCancel">取 消</el-button>
      </div>
    </el-dialog>
    <router-view></router-view>
  </div>
</template>

<script>
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
  getCoinList,
  addCoin,
  getCopyList,
  saveCopy,
  getcopyCoinlist,
} from "@/api/system/type";

export default {
  name: "Config",
  dicts: ["def_status", "t_second_coin_type"],
  data() {
    return {
      showChange: 0,
      nameCoin: "",
      copyOpen: false,
      currentMarket: "",

      //查询可添加币种
      coinList: [],
      //周期复制币种
      cycleList: [],
      copyList: [],
      periodId: "",
      copyForm: {},
      addCoinForm: { coin: undefined },
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
      // 秒合约币种配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否显示弹出层
      oneOpen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: null,
        status: null,
        showFlag: null,
        coin: null,
        sort: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        currentId: [{ required: true, message: "请输入币种", trigger: "blur" }],
        type: [{ required: true, message: "请输入类型", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
    this.getCoinList();
    getCopyList().then((res) => {
      this.copyList = res.data;
    });
    getcopyCoinlist().then((response) => {
      this.cycleList = response.data.map((elem) => {
        return {
          id: elem.id,
          symbol: elem.symbol,
          coin: elem.coin,
          showSymbol: elem.showSymbol,
        };
      });
    });
  },
  // computed: {
  //   copyCoinList() {
  //     let tempList = [];
  //     tempList = this.copyList.filter((item) => {
  //       return item.id != this.copyForm.copyId;
  //     });
  //     return tempList;
  //   },
  // },

  methods: {
    saveCopyCoin() {
      saveCopy(this.copyForm).then((res) => {
        if (res.code == 200) {
          this.copyOpen = false;
          this.$modal.msgSuccess("添加成功");
          this.getList();
          this.reset();
        }
      });
    },
    copyCancel() {
      this.copyOpen = false;
      this.reset();
    },
    /**周期复制币 */
    handleCopy() {
      this.copyOpen = true;
    },
    /**币种交易所 */
    changeCoin(e) {
      this.currentMarket = this.coinList.filter((item) => {
        return item.id == e;
      });
    },
    /**周期复制币 */
    changeCycleList(e) {
      this.form.periodId = e;
    },
    changeCopyCoin(e) {
      this.copyForm.copyId = e;
    },
    changeCopyCoinList(e) {},
    /** 查询秒合约币种配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.rows;
        this.configList.map((item) => {
          item.coin = item.coin;
        });

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
        status: null,
        showFlag: null,
        coin: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        currentId: null,
      };
      this.copyForm = {
        copyId: null,
        copyIds: null,
      };
      this.resetForm("form");
      this.resetForm("copyForm");
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
    getCoinList() {
      getCoinList().then((res) => {
        this.coinList = res.rows.map((elem) => {
          elem.label = `${elem.symbol}-${elem.market}`;
          return elem;
        });
      });
    },

    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.form = {
        id: null,
        symbol: null,
        status: 1,
        showFlag: 1,
        coin: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        currentId: null,
      };
      this.open = true;
      this.title = "添加秒合约交易对";
      this.form.sort = this.configList.length;
      this.showChange = 0;
    },
    handleOneAdd() {
      this.reset();
      this.oneOpen = true;
      this.title = "一键新增";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.showChange = 1;
      this.reset();
      const id = row.id || this.ids;
      this.open = true;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.form.coinLabel = `${this.form.symbol}-${this.form.market}`;
        this.nameCoin = `${this.form.coin.toUpperCase()}-${this.form.market}`;
        this.title = "修改秒合约交易对";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // if (this.form.coinLabel) {
          //   let tempObj = this.coinList.find(
          //     (elem) => elem.coinLabel == this.form.label
          //   );
          //   this.form.coin = tempObj.symbol;
          //   this.form.market = tempObj.market;
          // }
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.market = this.currentMarket[0].market;
            this.form.coin = this.currentMarket[0].symbol;
            addConfig(this.form).then((response) => {
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
        .confirm('是否确认删除秒合约币种配置编号为"' + ids + '"的数据项？')
        .then(function () {
          return delConfig(ids);
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
    /**秒合约币种周期配置 */
    configuration(row) {
      this.$router.push(`/quickly/cycle?id=${row.id}&coin=${row.coin}`);
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
      addCoin(this.addCoinForm.coin).then((res) => {
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
