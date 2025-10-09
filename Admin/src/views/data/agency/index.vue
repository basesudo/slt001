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
        <el-form-item label="下级代理ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
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
      <el-table
        height="calc(100vh - 360px)"
        border
        v-loading="loading"
        :data="detailList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column label="用户ID" align="center" prop="userId" /> -->
        <!-- <el-table-column label="用户名" align="center" prop="userName" /> -->
        <el-table-column label="下级代理id" align="center" prop="agencyId" />
        <el-table-column
          label="下级代理名称"
          align="center"
          prop="agencyUserName"
        />
        <el-table-column
          label="下级所有玩家ids"
          align="center"
          prop="appAllUserId"
        />
        <el-table-column label="充值总额" align="center" prop="recharge" />
        <el-table-column label="提现总额" align="center" prop="withdraw" />
        <el-table-column
          label="总归集金额"
          align="center"
          prop="collectionAmount"
        />
        <el-table-column label="总赠送彩金" align="center" prop="sendBonus" />
        <el-table-column label="总扣减彩金" align="center" prop="subBonus" />
        <!-- <el-table-column
          label="总人工上分"
          align="center"
          prop="totalAddAmount"
        /> -->
        <el-table-column label="人工上分总额" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.subAmount +
                scope.row.btcManualScoring +
                scope.row.ethManualScoring
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="人工下分总额" align="center">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.subAmount +
                scope.row.btcManualSubdivision +
                scope.row.ethManualSubdivision
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="80"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="mini"
                plain
                type="primary"
                @click="Check(scope.row)"
                v-hasPermi="['bussiness:userStatistics:agencyAppUserList']"
                >下级用户</el-button
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
  </div>
</template>

<script>
import { agencyList } from "@/api/bussiness/data";

export default {
  name: "Detail",
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
      // 用户详细信息表格数据
      detailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        agencyId: null,
        agencyUserName: null,
        appAllUserId: null,
        recharge: null,
        withdraw: null,
        sendBonus: null,
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
    /**查看下级用户 */
    Check(row) {
      this.$router.push(`/platform/subordinate?id=${row.agencyId}`);
    },
    /** 查询用户详细信息列表 */
    getList() {
      this.loading = true;
      agencyList(this.queryParams).then((response) => {
        this.detailList = response.rows;
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
        userId: null,
        agencyId: null,
        agencyUserName: null,
        appAllUserId: null,
        recharge: null,
        withdraw: null,
        sendBonus: null,
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
  },
};
</script>
<style scoped lang="scss">
.img-box {
  width: 100%;
  height: 100px;
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
