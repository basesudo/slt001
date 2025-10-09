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
        <el-form-item label="用户ID" prop="appUserId">
          <el-input
            v-model="queryParams.appUserId"
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
            v-hasPermi="[
              'bussiness:productUser:add',
              'bussiness:user:getListByPledge',
            ]"
            >新增</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="success"
            plain
            size="mini"
            @click="$router.push(`/pledge/ming`)"
            >返回</el-button
          >
        </el-col>
        <right-toolbar :showSearch.sync="showSearch" @queryTable="getList">
        </right-toolbar>
      </el-row>
      <el-table
        height="calc(100vh - 400px)"
        border
        v-loading="loading"
        :data="mingList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column type="index" width="55" align="center" />
        <el-table-column label="ID" align="center" width="80" prop="id" />
        <el-table-column
          label="用户ID"
          align="center"
          width="80"
          prop="appUserId"
        />
        <el-table-column
          label="登录名"
          align="center"
          prop="tappUser.loginName"
        />
        <el-table-column label="测试用户" width="100" align="center">
          <template slot-scope="scope">
            <el-tag
              type="primary"
              size="mini"
              plain
              v-if="scope.row.tappUser.isTest == 0"
              >否</el-tag
            >
            <el-tag
              type="info"
              size="mini"
              plain
              v-else-if="scope.row.tappUser.isTest == 1"
              >是</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          label="限购产品ID"
          width="100"
          align="center"
          prop="productId"
        />
        <el-table-column
          label="限购产品标题"
          width="100"
          align="center"
          prop="title"
        />
        <el-table-column
          label="限购次数"
          width="100"
          align="center"
          prop="pledgeNum"
        />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          width="220"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                plain
                size="small"
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:productUser:edit']"
                >修改</el-button
              >
              <el-button
                plain
                size="small"
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:productUser:remove']"
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
    <!-- 限购设置 -->
    <el-dialog
      :title="titlePledge"
      :visible.sync="openPledge"
      width="800px"
      append-to-body
      @close="close"
    >
      <el-form
        ref="formPledge"
        :model="formPledge"
        :rules="rulesPledge"
        label-width="120px"
        style="min-height: 200px"
      >
        <el-form-item label="限购次数" prop="pledgeNum">
          <el-input v-model="formPledge.pledgeNum" />
        </el-form-item>
        <el-form-item label="用户" prop="id" v-if="showDisabled">
          <el-input v-model="userMsg" disabled />
        </el-form-item>
        <el-form-item label="用户" prop="appUserId" v-else>
          <el-select
            :default-first-option="false"
            v-model="formPledge.appUserId"
            placeholder="请选择用户或搜索用户id/名称"
            style="width: 100%"
            filterable
            clearable
          >
            <el-option
              v-for="item in userOptions"
              :key="item.userId"
              :label="`id:${item.userId}   登录名：${item.loginName}`"
              :value="item.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm2">确 定</el-button>
        <el-button @click="cancel2">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  pledgeList,
  listUserAll,
  addPledge,
  updatePledge,
  delPledge,
} from "@/api/bussiness/ming.js";
export default {
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        appUserId: "",
      },
      // 显示搜索条件
      showSearch: true,
      mingList: [],
      userOptions: [],
      productId: this.$route.query.productId,

      openPledge: false,
      userMsg: {},
      titlePledge: "",
      pledgemainId: "",
      formPledge: {
        appUserId: "",
        pledgeNum: 0,
      },
      rulesPledge: {
        appUserId: [
          { required: true, message: "请选择用户", trigger: "change" },
        ],
        pledgeNum: [
          { required: true, message: "限购次数不能为空", trigger: "blur" },
        ],
      },
      showDisabled: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleAdd() {
      this.openPledge = true;
      this.titlePledge = "限购设置";
      this.formPledge.appUserId = "";
      this.formPledge.pledgeNum = "";
      this.showDisabled = false;
      listUserAll(this.productId).then((res) => {
        this.userOptions = res.rows;
      });
    },
    submitForm2() {
      this.$refs["formPledge"].validate((valid) => {
        if (valid) {
          let params = {};

          // 新增
          if (!this.showDisabled) {
            params = {
              appUserId: this.formPledge.appUserId,
              pledgeNum: this.formPledge.pledgeNum,
              productId: this.productId,
            };
            addPledge(params).then((res) => {
              if (res.code == "200") {
                this.$modal.msgSuccess("设置成功");
                this.openPledge = false;
                this.formPledge.appUserId = "";
                this.formPledge.pledgeNum = 0;
                this.getList();
              }
            });
          } else {
            // 修改
            params = {
              appUserId: this.formPledge.appUserId,
              pledgeNum: this.formPledge.pledgeNum,
              productId: this.productId,
              id: this.pledgemainId,
            };
            updatePledge(params).then((res) => {
              if (res.code == "200") {
                this.$modal.msgSuccess("设置成功");
                this.openPledge = false;
                this.formPledge.appUserId = "";
                this.formPledge.pledgeNum = 0;
                this.getList();
              }
            });
          }
        }
      });
    },
    cancel2() {
      this.openPledge = false;
    },
    handleSelectionChange() {},
    getList() {
      this.queryParams["productId"] = this.productId;
      pledgeList(this.queryParams).then((res) => {
        if (res.code == "200") {
          this.mingList = res.rows;
          this.total = res.total;
        }
      });
    },
    handleDelete(item) {
      delPledge(item.id).then((res) => {
        if (res.code == "200") {
          this.getList();
        }
      });
    },
    handleUpdate(item) {
      this.openPledge = true;
      // this.formPledge=item
      this.formPledge.appUserId = item.appUserId;
      this.formPledge.pledgeNum = item.pledgeNum;
      this.userMsg = `id:${item.tappUser.appUserId} 登录名：${item.tappUser.loginName}`;
      this.showDisabled = true;
      this.pledgemainId = item.id;
    },
    close() {
      this.formPledge.appUserId = null;
      this.formPledge.pledgeNum = null;
      this.resetForm("formPledge");
    },
  },
};
</script>

<style lang="scss" scoped></style>
