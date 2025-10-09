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
        <el-form-item label="用户ID" prop="userId">
          <el-input
            v-model="queryParams.userId"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="初级认证状态" prop="auditStatusPrimary">
          <el-select v-model="queryParams.auditStatusPrimary" clearable>
            <el-option
              v-for="dict in dict.type.audit_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="高级认证状态" prop="auditStatusAdvanced">
          <el-select v-model="queryParams.auditStatusAdvanced" clearable>
            <el-option
              v-for="dict in dict.type.audit_status"
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
            @click="handleAdd"
            v-hasPermi="['bussiness:detail:add']"
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
            v-hasPermi="['bussiness:detail:edit']"
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
            v-hasPermi="['bussiness:detail:edit']"
            >删除</el-button
          >
        </el-col> -->
        <!-- <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            :disabled="multiple"
            @click="handleExport"
            v-hasPermi="['bussiness:detail:export']"
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
        :data="detailList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="用户ID" align="center" prop="userId" />
        <el-table-column label="姓名" align="center" prop="realName" />
        <el-table-column label="证件号" align="center" prop="idCard" />
        <el-table-column label="国家" align="center" prop="country">
          <template slot-scope="scope">
            {{
              scope.row.country == "undefined" || scope.row.country == null
                ? "暂无"
                : scope.row.country
            }}
          </template>
        </el-table-column>
        <el-table-column label="正面照片" align="center" prop="frontUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.frontUrl"
              :preview-src-list="[scope.row.frontUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="反面照片" align="center" prop="backUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.backUrl"
              :preview-src-list="[scope.row.backUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="手持照片" align="center" prop="handelUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 50px; height: 50px"
              :src="scope.row.handelUrl"
              :preview-src-list="[scope.row.handelUrl]"
              fit="contain"
              class="img-box"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="初级验证状态"
          align="center"
          prop="auditStatusPrimary"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.audit_status"
              :value="scope.row.auditStatusPrimary"
            />
          </template>
          <template slot-scope="scope">
            <el-tag
              type="success"
              plain
              v-if="scope.row.auditStatusPrimary == 1"
              >已审核</el-tag
            >
            <el-tag
              type="danger"
              plain
              v-else-if="scope.row.auditStatusPrimary == 2"
              >拒绝</el-tag
            >
            <el-tag
              type="info"
              plain
              v-else-if="scope.row.auditStatusPrimary == 3"
              >待审核</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="高级验证状态"
          align="center"
          prop="auditStatusAdvanced"
        >
          <template slot-scope="scope">
            <el-tag
              type="success"
              plain
              v-if="scope.row.auditStatusAdvanced == 1"
              >已审核</el-tag
            >
            <el-tag
              type="danger"
              plain
              v-else-if="scope.row.auditStatusAdvanced == 2"
              >拒绝</el-tag
            >
            <el-tag
              type="info"
              plain
              v-else-if="scope.row.auditStatusAdvanced == 3"
              >待审核</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="150px"
        >
          <template slot-scope="scope">
            <!-- <el-popover
              class="popover-table-menu"
              placement="bottom"
              width="50"
              trigger="click"
            > 
              <div class="popover-table-menu-btn-list">-->
            <div v-if="scope.row.auditStatusPrimary == 3" class="operate">
              <p>初级审核：</p>
              <div>
                <el-button
                  type="primary"
                  plain
                  @click="primaryReview(scope.row, 1)"
                  v-hasPermi="['bussiness:user:realName']"
                  size="small"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  plain
                  @click="primaryReview(scope.row, 2)"
                  v-hasPermi="['bussiness:detail:edit']"
                  size="small"
                  >拒绝</el-button
                >
              </div>
            </div>
            <div v-if="scope.row.auditStatusAdvanced == 3">
              <p>高级审核：</p>
              <div>
                <el-button
                  type="primary"
                  plain
                  @click="dvancedReview(scope.row, 3)"
                  v-hasPermi="['bussiness:user:realName']"
                  size="small"
                  >通过</el-button
                >
                <el-button
                  type="danger"
                  plain
                  @click="dvancedReview(scope.row, 4)"
                  v-hasPermi="['bussiness:detail:edit']"
                  size="small"
                  >拒绝</el-button
                >
              </div>
            </div>

            <!-- </div>
                <div class="menu" slot="reference">···</div> -->
            <!-- </el-popover> -->
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
    <!-- 添加或修改用户详细信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="form.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="身份证号码" prop="idCard">
          <el-input v-model="form.idCard" placeholder="请输入身份证号码" />
        </el-form-item>
        <el-form-item label="身份证正面照片" prop="frontUrl">
          <el-input
            v-model="form.frontUrl"
            placeholder="请输入身份证正面照片"
          />
        </el-form-item>
        <el-form-item label="国际" prop="country">
          <el-input v-model="form.country" placeholder="请输入国际" />
        </el-form-item>
        <el-form-item label="手持身份证照片" prop="handelUrl">
          <el-input
            v-model="form.handelUrl"
            placeholder="请输入手持身份证照片"
          />
        </el-form-item>
        <el-form-item label="身份证反面照片" prop="backUrl">
          <el-input v-model="form.backUrl" placeholder="请输入身份证反面照片" />
        </el-form-item>
        <el-form-item label="用户交易密码" prop="userTardPwd">
          <el-input
            v-model="form.userTardPwd"
            placeholder="请输入用户交易密码"
          />
        </el-form-item>
        <el-form-item label="" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="" prop="searchValue">
          <el-input
            v-model="form.searchValue"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="初级验证状态" prop="auditStatusPrimary">
          <el-input
            v-model="form.auditStatusPrimary"
            placeholder="请输入初级验证状态"
          />
        </el-form-item>
        <el-form-item label="高级验证状态" prop="auditStatusAdvanced">
          <el-input
            v-model="form.auditStatusAdvanced"
            placeholder="请输入高级验证状态"
          />
        </el-form-item>
        <el-form-item label="信用分" prop="credits">
          <el-input v-model="form.credits" placeholder="请输入信用分" />
        </el-form-item>
        <el-form-item label="用户充值地址" prop="userRechargeAddress">
          <el-input
            v-model="form.userRechargeAddress"
            placeholder="请输入用户充值地址"
          />
        </el-form-item>
        <el-form-item label="连赢场次" prop="winNum">
          <el-input v-model="form.winNum" placeholder="请输入连赢场次" />
        </el-form-item>
        <el-form-item label="连输场次" prop="loseNum">
          <el-input v-model="form.loseNum" placeholder="请输入连输场次" />
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
import { mapGetters } from "vuex";
import {
  listDetail,
  getDetail,
  delDetail,
  addDetail,
  updateDetail,
  review,
} from "@/api/system/certified";

export default {
  name: "Detail",
  dicts: ["audit_status"],
  computed: {
    ...mapGetters(["verifiedNum", "rechargeNum", "withdrawNum"]),
  },
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
        realName: null,
        idCard: null,
        frontUrl: null,
        country: null,
        cardType: null,
        handelUrl: null,
        backUrl: null,
        userTardPwd: null,
        searchValue: null,
        auditStatusPrimary: null,
        auditStatusAdvanced: null,
        credits: null,
        userRechargeAddress: null,
        winNum: null,
        loseNum: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {},
    };
  },
  watch: {
    verifiedNum() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询用户详细信息列表 */
    getList() {
      this.loading = true;
      listDetail(this.queryParams).then((response) => {
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
        realName: null,
        idCard: null,
        frontUrl: null,
        country: null,
        cardType: null,
        handelUrl: null,
        backUrl: null,
        userTardPwd: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        auditStatusPrimary: null,
        auditStatusAdvanced: null,
        credits: null,
        userRechargeAddress: null,
        winNum: null,
        loseNum: null,
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
      this.title = "添加用户详细信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getDetail(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户详细信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateDetail(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDetail(this.form).then((response) => {
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
        .confirm('是否确认删除用户详细信息编号为"' + ids + '"的数据项？')
        .then(function () {
          return delDetail(ids);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    /** 审核按钮操作 */
    primaryReview(row, value) {
      let data = { userId: row.userId, flag: value, id: row.id };
      this.$modal
        .confirm("确定审核通过？")
        .then(function () {
          return review(data);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("审核通过");
        })
        .catch(() => {});
    },
    dvancedReview(row, value) {
      let data = { userId: row.userId, flag: value, id: row.id };
      this.$modal
        .confirm("确定审核通过？")
        .then(function () {
          return review(data);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("审核通过");
        })
        .catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/detail/export",
        {
          ...this.queryParams,
        },
        `detail_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped lang="scss">
.img-box {
  width: 100%;
  height: 100px;
}
</style>
