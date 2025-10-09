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
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="queryParams.title"
            placeholder="请输入标题"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="币种 " prop="coin">
          <el-input
            v-model="queryParams.coin"
            placeholder="请输入币种 "
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-input
            v-model="queryParams.classify"
            placeholder="请输入分类"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="VIP等级 " prop="level">
          <el-input
            v-model="queryParams.level"
            placeholder="请输入VIP等级 "
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
            v-hasPermi="['system:financial:add']"
            >新增</el-button
          >
        </el-col>
        <!-- <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:financial:edit']"
          >修改</el-button
        >
      </el-col> -->
        <el-col :span="1.5">
          <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="mini"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermi="['system:financial:remove']"
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
          v-hasPermi="['system:financial:export']"
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
        :data="financialList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <!-- <el-table-column type="index" width="50" align="center" /> -->
        <!-- <el-table-column label="ID" align="center" width="130" prop="id" /> -->
        <el-table-column label="标题" align="center" prop="title" />
        <el-table-column label="图标" align="center" prop="icon">
          <template slot-scope="{ row }">
            <el-image
              v-if="row.icon"
              style="width: 50px; height: 50px"
              :src="row.icon"
              :preview-src-list="[row.icon]"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="VIP等级 " align="center" prop="level" />
        <el-table-column
          label="启用/禁用"
          align="center"
          width="80px"
          prop="status"
        >
          <template slot-scope="{ row }">
            <el-tag type="success" size="mini" plain v-if="row.status == 1">
              启用
            </el-tag>
            <el-tag type="info" size="mini" plain v-else> 禁用 </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="天数" align="center" width="50" prop="days" />
        <el-table-column
          label="违约利率（%）"
          align="center"
          width="80"
          prop="defaultOdds"
        />
        <el-table-column label="日利率(最小/最大)%" width="150" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.minOdds }}<span> / </span>{{ scope.row.maxOdds }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="限购次数"
          align="center"
          width="80"
          prop="timeLimit"
        >
          <template slot-scope="{ row }">
            <div v-if="row.timeLimit">{{ row.timeLimit }}</div>
            <div v-else>不限</div>
          </template>
        </el-table-column>
        <el-table-column label="金额(最小/最大)" width="150" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.limitMin }}<span> / </span>{{ scope.row.limitMax }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="热销" align="center" width="50" prop="isHot">
          <template slot-scope="{ row }">
            <div v-if="row.isHot">是</div>
            <div v-else>否</div>
          </template>
        </el-table-column>
        <!-- <el-table-column label="排序" align="center" prop="sort" /> -->
        <el-table-column
          label=" 购买次数"
          align="center"
          prop="buyPurchase"
          width="80"
        />
        <el-table-column
          label="日平均利率（%）"
          align="center"
          width="100"
          prop="avgRate"
        />
        <el-table-column label="币种 " align="center" prop="coin" width="50" />
        <el-table-column label="分类" align="center" prop="classify">
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.financial_type"
              :value="scope.row.classify"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="项目进度(%)"
          align="center"
          prop="process"
          width="80"
        />
        <el-table-column
          label="平台基础投资金额"
          align="center"
          width="100"
          prop="basicInvestAmount"
        />
        <el-table-column
          label="平台总投资额"
          align="center"
          width="100"
          prop="totalInvestAmount"
        />
        <el-table-column label="剩余/已购金额" width="150" align="center">
          <template slot-scope="scope">
            <div>
              {{ scope.row.remainAmount }}<span> / </span
              >{{ scope.row.purchasedAmount }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="120px"
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="popover-table-menu-btn-list">
              <el-button
                size="mini"
                plain
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['system:financial:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                plain
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:financial:remove']"
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
    <!-- 添加或修改【请填写功能名称】对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="190px">
        <el-form-item label="图片" prop="icon">
          <ImageUpload ref="imgg" :limit="1" v-model="form.icon"></ImageUpload>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <!-- <el-form-item label="图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入图标" />
        </el-form-item> -->
        <el-form-item label="天数" prop="days">
          <el-input v-model="form.days" />
        </el-form-item>
        <el-form-item label="违约利率" prop="defaultOdds">
          <el-input v-model="form.defaultOdds" />
        </el-form-item>
        <el-form-item label="最小日利率百分比" prop="minOdds">
          <el-input v-model="form.minOdds" />
        </el-form-item>
        <el-form-item label="最大日利率百分比" prop="maxOdds">
          <el-input v-model="form.maxOdds" />
        </el-form-item>
        <el-form-item label="限购次数(0不限制)" prop="timeLimit">
          <el-input v-model="form.timeLimit" />
        </el-form-item>
        <el-form-item label="最小金额" prop="limitMin">
          <el-input v-model="form.limitMin" />
        </el-form-item>
        <el-form-item label="最大金额" prop="limitMax">
          <el-input v-model="form.limitMax" />
        </el-form-item>
        <el-form-item label="是否热销" prop="isHot">
          <el-select v-model="form.isHot">
            <el-option label="是" :value="1"> </el-option>
            <el-option label="否" :value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用" prop="status">
          <el-select v-model="form.status">
            <el-option label="是" :value="1"> </el-option>
            <el-option label="否" :value="0"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" />
        </el-form-item>
        <el-form-item label=" 购买次数" prop="buyPurchase">
          <el-input v-model="form.buyPurchase" />
        </el-form-item>
        <el-form-item label="日平均利率" prop="avgRate">
          <el-input v-model="form.avgRate" />
        </el-form-item>
        <el-form-item label="币种 " prop="coin">
          <el-input v-model="form.coin" disabled />
        </el-form-item>
        <el-form-item label="分类" prop="classify">
          <el-select v-model="form.classify">
            <el-option label="VIP" :value="'1'"> </el-option>
            <el-option label="普通" :value="'0'"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="平台基础投资金额" prop="basicInvestAmount">
          <el-input v-model="form.basicInvestAmount" />
        </el-form-item>
        <el-form-item label="平台总投资额" prop="totalInvestAmount">
          <el-input v-model="form.totalInvestAmount" />
        </el-form-item>
        <el-form-item label="VIP等级 " prop="level">
          <el-input v-model="form.level" />
        </el-form-item>
        <el-form-item label="项目进度" prop="process">
          <el-input v-model="form.process" />
        </el-form-item>
        <el-form-item label="剩余金额" prop="remainAmount">
          <el-input v-model="form.remainAmount" />
        </el-form-item>
        <el-form-item label="标签" prop="remark">
          <el-input v-model="form.remark" type="textarea" />
        </el-form-item>
        <el-form-item label="已购金额" prop="purchasedAmount">
          <el-input v-model="form.purchasedAmount" />
        </el-form-item>
        <el-form-item label="常见问题" prop="problem">
          <el-input v-model="form.problem" type="textarea" />
        </el-form-item>
        <el-form-item label="产品介绍" prop="prodectIntroduction">
          <el-input v-model="form.prodectIntroduction" type="textarea" />
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
  listFinancial,
  getFinancial,
  delFinancial,
  addFinancial,
  updateFinancial,
} from "@/api/financial/product.js";

export default {
  name: "Financial",
  dicts: ["financial_type"],
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
      // 【请填写功能名称】表格数据
      financialList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: null,
        icon: null,
        status: null,
        days: null,
        defaultOdds: null,
        minOdds: null,
        maxOdds: null,
        timeLimit: null,
        limitMin: null,
        limitMax: null,
        isHot: null,
        sort: null,
        buyPurchase: null,
        avgRate: null,
        coin: null,
        classify: null,
        basicInvestAmount: null,
        totalInvestAmount: null,
        level: null,
        process: null,
        remainAmount: null,
        purchasedAmount: null,
        problem: null,
        prodectIntroduction: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        title: [{ required: true, message: "标题不能为空", trigger: "blur" }],
        days: [
          {
            required: true,
            message: "天数(如 7,10,30)不能为空",
            trigger: "blur",
          },
        ],
        timeLimit: [
          {
            required: true,
            message: "每人限购次数，0表示不限不能为空",
            trigger: "blur",
          },
        ],
        limitMin: [
          { required: true, message: "最小金额不能为空", trigger: "blur" },
        ],
        limitMax: [
          { required: true, message: "最大金额不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询【请填写功能名称】列表 */
    getList() {
      this.loading = true;
      listFinancial(this.queryParams).then((response) => {
        this.financialList = response.rows;
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
        title: null,
        icon: null,
        status: null,
        days: null,
        defaultOdds: null,
        minOdds: null,
        maxOdds: null,
        timeLimit: null,
        limitMin: null,
        limitMax: null,
        isHot: null,
        sort: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        buyPurchase: null,
        avgRate: null,
        coin: "USDT",
        classify: null,
        basicInvestAmount: null,
        totalInvestAmount: null,
        level: null,
        process: null,
        remainAmount: null,
        remark: null,
        purchasedAmount: null,
        problem: null,
        prodectIntroduction: null,
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
      this.title = "添加理财产品";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getFinancial(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改理财产品";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateFinancial(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addFinancial(this.form).then((response) => {
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
        .confirm('是否确认删除【请填写功能名称】编号为"' + ids + '"的数据项？')
        .then(function () {
          return delFinancial(ids);
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
        "bussiness/financial/export",
        {
          ...this.queryParams,
        },
        `financial_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.formItem {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
</style>
