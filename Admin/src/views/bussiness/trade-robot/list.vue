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
        <el-form-item label="交易对" prop="symbol">
          <el-input
            v-model="queryParams.symbol"
            placeholder="请输入交易对"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="控制粒度 (分钟)" prop="granularity">
          <el-input
            v-model="queryParams.granularity"
            placeholder="请选择控制粒度"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="状态" prop="walletType">
          <el-select
            v-model="queryParams.walletType"
            placeholder="请选择状态"
            clearable
          >
            <el-option
              v-for="dict in dict.type.t_address_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
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
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="dataList"
      >
        <el-table-column label="交易对" align="center" prop="symbol" />
        <el-table-column label="控盘策略" align="center" prop="model">
          <template slot-scope="scope">
            {{ getModelName(scope.row.model) }}
          </template>
        </el-table-column>
        <el-table-column
          label="控制粒度 (分钟)"
          align="center"
          prop="granularity"
        />
        <el-table-column
          label="浮动比例 (%)"
          align="center"
          prop="pricePencent"
        />

        <el-table-column label="最大涨幅" align="center" prop="increase" />
        <el-table-column label="最大跌幅" align="center" prop="decline" />
        <el-table-column label="开始时间" align="center" prop="beginTime">
          <template slot-scope="scope">
            {{ TimeFormater(scope.row.beginTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" prop="endTime">
          <template slot-scope="scope">
            {{ TimeFormater(scope.row.endTime).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态" align="center" prop="usdtMonitor" /> -->
        <el-table-column
          label="操作"
          align="center"
          width="80"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-popover
              class="popover-table-menu"
              placement="bottom"
              width="50"
              trigger="click"
              v-model="scope.row.popoverShow"
            >
              <div class="popover-table-menu-btn-list">
                <el-button
                  size="mini"
                  plain
                  type="success"
                  v-hasPermi="['bussiness:trade-robot:detail']"
                  @click="handlePriview(scope.row)"
                >
                  预览
                </el-button>
                <el-button
                  size="mini"
                  plain
                  type="warning"
                  v-hasPermi="['bussiness:trade-robot:edit']"
                  @click="handleUpdate(scope.row)"
                >
                  修改
                </el-button>
                <el-button
                  size="mini"
                  plain
                  type="danger"
                  v-hasPermi="['bussiness:trade-robot:remove']"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </div>

              <div class="menu" slot="reference">···</div>
            </el-popover>
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
  </div>
</template>

<script>
import {
  getDataListApi,
  deleteDetailApi,
} from "@/api/bussiness/trade-robot.js";
import TimeFormater from "time-formater";

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
      dataList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        address: null,
      },
      // 表单参数
      form: {},
      // 控盘策略列表
      modelList: [
        { value: 0, label: "跟随型趋势" },
        // { value: 1, label: "自定义趋势" },
        { value: 2, label: "秒杀型趋势" },
      ],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    TimeFormater: TimeFormater,
    /**
     * 获取策略名
     * @param {*} val
     */
    getModelName(val) {
      return this.modelList.find((elem) => elem.value == val)?.label || "";
    },
    /** 查询钱包地址授权详情列表 */
    getList() {
      this.loading = true;
      getDataListApi(this.queryParams).then((response) => {
        this.dataList = response.rows.map((elem) => {
          elem.popoverShow = false;
          return elem;
        });
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {};
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

    /** 预览 */
    handlePriview(row) {
      row.popoverShow = false;
      this.$router.push({
        path: "/bot/trade-robot",
        query: { id: row.id, type: "priview" },
      });
    },
    /** 修改 */
    handleUpdate(row) {
      row.popoverShow = false;
      this.$router.push({
        path: "/bot/trade-robot",
        query: { id: row.id, type: "update" },
      });
    },
    /** 删除 */
    async handleDelete(row) {
      row.popoverShow = false;
      const res = await deleteDetailApi(row.id);
      if (res.code == 200) {
        this.$modal.msgSuccess(res.msg);
        this.resetQuery();
      } else {
        this.$modal.msgError(res.msg);
      }
    },
  },
};
</script>
