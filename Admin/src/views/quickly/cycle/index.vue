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
        <el-form-item label="周期 (秒)" prop="period">
          <el-input
            v-model="queryParams.period"
            placeholder="请输入周期"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="最大金额" prop="maxAmount">
          <el-input
            v-model="queryParams.maxAmount"
            placeholder="请输入最大金额"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="最小金额" prop="minAmount">
          <el-input
            v-model="queryParams.minAmount"
            placeholder="请输入最小金额"
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
            v-hasPermi="['period:config:add']"
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
            v-hasPermi="['period:config:remove']"
            >删除</el-button
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
        <el-table-column label="币种" align="center"
          ><template slot-scope="scope">
            <p>{{ coin }}</p>
          </template>
        </el-table-column>
        <el-table-column label="周期 (秒)" align="center" prop="period" />
        <el-table-column label="最大金额" align="center" prop="maxAmount" />
        <el-table-column label="最小金额" align="center" prop="minAmount" />
        <el-table-column label="赔率" align="center" prop="odds" />
        <el-table-column label="状态" align="center" prop="flag">
          <template slot-scope="scope" prop="flag">
            <el-tag
              type="info"
              size="mini"
              plain
              v-if="scope.row.flag == false"
            >
              本金按比例输
            </el-tag>
            <el-tag
              type="warning"
              size="mini"
              plain
              v-else-if="scope.row.flag == true"
            >
              本金全输
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              size="small"
              type="pramiary"
              plain
              @click="handleUpdate(scope.row)"
              v-hasPermi="['period:config:edit']"
              >修改</el-button
            >
            <el-button
              size="small"
              type="danger"
              plain
              @click="handleDelete(scope.row)"
              v-hasPermi="['period:config:remove']"
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
    <!-- 添加或修改秒合约币种周期配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="周期 (秒)" prop="period">
          <el-input
            type="number"
            v-model="form.period"
            placeholder="请输入时间周期  单位：秒"
          />
        </el-form-item>

        <el-form-item label="最小金额" prop="minAmount">
          <el-input
            type="number"
            v-model="form.minAmount"
            placeholder="请输入最小金额"
          />
        </el-form-item>
        <el-form-item label="最大金额" prop="maxAmount">
          <el-input
            type="number"
            v-model="form.maxAmount"
            placeholder="请输入最大金额"
          />
        </el-form-item>
        <el-form-item label="赔率" prop="odds">
          <el-input
            type="number"
            v-model="form.odds"
            placeholder="请输入赔率"
          />
        </el-form-item>
        <el-form-item label="赔偿方式" prop="flag">
          <el-radio-group v-model="form.flag">
            <el-radio :label="true">本金全输</el-radio>
            <el-radio :label="false">本金按比例输</el-radio>
          </el-radio-group>
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
import {
  listConfig,
  getConfig,
  delConfig,
  addConfig,
  updateConfig,
} from "@/api/system/configrution.js";

export default {
  name: "",
  dicts: ["def_status"],
  data() {
    var checkPeriod = (rule, value, callback) => {
      if (["coolcoinex", "dev"].includes(this.VUE_APP_ENV)) {
        if (value >= 3600 && value % 3600 === 0) {
          callback();
        } else if (value < 3600) {
          callback();
        } else {
          callback(new Error("请输入3600的倍数"));
        }
      } else {
        callback();
      }
    };
    return {
      //当前币种
      coin: "",
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
      // 秒合约币种周期配置表格数据
      configList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        id: null,
        pageNum: 1,
        pageSize: 10,
        secondId: null,
        period: null,
        maxAmount: null,
        minAmount: null,
        status: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      // odds: [
      //     { required: true, message: "请输入赔率", trigger: "blur" },
      //     {
      //       min: 0,
      //       max: 1,
      //       message: "最大为1",
      //       trigger: "blur",
      //     },
      //   ],
      rules: {
        period: [
          { required: true, message: "请输入周期", trigger: "blur" },
          { validator: checkPeriod, trigger: "blur" },
        ],

        minAmount: [
          { required: true, message: "请输入最小金额", trigger: "blur" },
        ],
        maxAmount: [
          { required: true, message: "请输入最大金额", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.queryParams.secondId = this.$route.query.id;
    this.coin = this.$route.query.coin;
    this.getList();
  },
  mounted() {},
  methods: {
    /** 查询秒合约币种周期配置列表 */
    getList() {
      this.loading = true;
      listConfig(this.queryParams).then((response) => {
        this.configList = response.rows;
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
        secondId: null,
        period: null,
        maxAmount: null,
        minAmount: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        flag: null,
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
      this.form = {
        id: null,
        secondId: null,
        period: null,
        maxAmount: null,
        minAmount: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        flag: true,
      };
      this.open = true;
      this.title = "添加周期配置";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getConfig(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改周期配置";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.secondId = this.$route.query.id;
          if (this.form.id != null) {
            updateConfig(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let data = {
              flag: this.form.flag,
              maxAmount: this.form.maxAmount,
              minAmount: this.form.minAmount,
              odds: this.form.odds,
              period: this.form.period,
              secondId: this.$route.query.id,
            };
            addConfig(data).then((response) => {
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
        .confirm('是否确认删除秒合约币种周期配置编号为"' + ids + '"的数据项？')
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
  },
};
</script>
