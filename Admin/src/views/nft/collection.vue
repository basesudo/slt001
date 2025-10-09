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
        <el-form-item label="id" prop="id">
          <el-input
            v-model="queryParams.id"
            placeholder="请输入id"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="合集id" prop="seriesId">
          <el-input
            v-model="queryParams.seriesId"
            placeholder="请输入合集id"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="图片路径" prop="imgUrl">
          <el-input
            v-model="queryParams.imgUrl"
            placeholder="请输入图片路径"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="所属id" prop="userId">
          <el-input
            v-model="queryParams.userId"
            placeholder="请输入所属id"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input
            v-model="queryParams.price"
            placeholder="请输入价格"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input
            v-model="queryParams.author"
            placeholder="请输入作者"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="持有者地址" prop="holdAddress">
          <el-input
            v-model="queryParams.holdAddress"
            placeholder="请输入持有者地址"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手续费" prop="handlingFee">
          <el-input
            v-model="queryParams.handlingFee"
            placeholder="请输入手续费"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="版权费" prop="copyrightFee">
          <el-input
            v-model="queryParams.copyrightFee"
            placeholder="请输入版权费"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="上架结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="queryParams.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择上架结束日期"
          >
          </el-date-picker>
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
            v-hasPermi="['bussiness:nftProduct:add']"
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
            v-hasPermi="['bussiness:nftProduct:edit']"
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
            v-hasPermi="['bussiness:nftProduct:remove']"
            >删除</el-button
          >
        </el-col>
        <el-col :span="1.5">
          <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="mini"
            @click="handleExport"
            v-hasPermi="['bussiness:nftProduct:export']"
            >导出</el-button
          >
        </el-col>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        border
        v-loading="loading"
        :data="nftProductList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="id" align="center" prop="id" />
        <el-table-column label="合集id" align="center" prop="seriesId" />
        <el-table-column label="图片路径" align="center" prop="imgUrl">
          <template slot-scope="scope">
            <el-image
              style="width: 80px; height: auto"
              :src="scope.row.imgUrl"
              :preview-src-list="[scope.row.imgUrl]"
            >
            </el-image>
          </template>
        </el-table-column>

        <el-table-column label="所属id" align="center" prop="userId" />
        <el-table-column label="价格" align="center" prop="price" />
        <el-table-column label="所属链" align="center" prop="chainType" />
        <el-table-column label="作者" align="center" prop="author" />
        <el-table-column label="持有者地址" align="center" prop="holdAddress" />
        <el-table-column label="手续费" align="center" prop="handlingFee" />
        <el-table-column label="版权费" align="center" prop="copyrightFee" />
        <el-table-column label="描述" align="center" prop="des" />
        <el-table-column label="商品状态" align="center" prop="status">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              plain
              v-if="scope.row.status == 2"
            >
              已上架
            </el-button>
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.status == 1"
            >
              未上架
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="销售状态" align="center" prop="saleStatus">
          <template slot-scope="scope">
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.status == 0"
            >
              待审核
            </el-button>
            <el-button
              type="success"
              size="mini"
              plain
              v-if="scope.row.status == 2"
            >
              持有
            </el-button>
            <el-button
              type="info"
              size="mini"
              plain
              v-if="scope.row.status == 1"
            >
              待售
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          label="上架结束日期"
          align="center"
          prop="endDate"
          width="180"
        >
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.endDate, "{y}-{m}-{d}") }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
          width="150"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status == 1"
              size="mini"
              type="text"
              icon="el-icon-top"
              @click="handleGrounding(scope.row)"
              >上架</el-button
            >
            <el-button
              v-if="scope.row.status == 2"
              size="mini"
              type="text"
              icon="el-icon-bottom"
              @click="handleGrounding(scope.row)"
              >下架</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['bussiness:nftProduct:edit']"
              >修改</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['bussiness:nftProduct:remove']"
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
    <!-- 添加或修改nft详情对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="合集id" prop="seriesId">
          <el-select
            v-model="form.seriesId"
            filterable
            placeholder="请输入合集id"
          >
            <el-option
              v-for="item in idList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="图片路径" prop="imgUrl">
          <ImageUpload :limit="1" v-model="form.imgUrl"></ImageUpload>
        </el-form-item>
        <el-form-item label="所属id" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入所属id" />
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格" />
        </el-form-item>
        <el-form-item label="作者" prop="author">
          <el-input v-model="form.author" placeholder="请输入作者" />
        </el-form-item>
        <el-form-item label="持有者地址" prop="holdAddress">
          <el-input v-model="form.holdAddress" placeholder="请输入持有者地址" />
        </el-form-item>
        <el-form-item label="手续费" prop="handlingFee">
          <el-input v-model="form.handlingFee" placeholder="请输入手续费" />
        </el-form-item>
        <el-form-item label="版权费" prop="copyrightFee">
          <el-input v-model="form.copyrightFee" placeholder="请输入版权费" />
        </el-form-item>
        <el-form-item label="描述" prop="des">
          <el-input
            v-model="form.des"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
        <el-form-item label="上架结束日期" prop="endDate">
          <el-date-picker
            clearable
            v-model="form.endDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择上架结束日期"
          >
          </el-date-picker>
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
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listNftProduct,
  getNftProduct,
  delNftProduct,
  addNftProduct,
  updateNftProduct,
  addNftProductList,
} from "@/api/nft/nftProduct";

export default {
  name: "NftProduct",
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
      // nft详情表格数据
      nftProductList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        id: null,
        seriesId: null,
        imgUrl: null,
        userId: null,
        price: null,
        chainType: null,
        author: null,
        holdAddress: null,
        handlingFee: null,
        copyrightFee: null,
        des: null,
        status: null,
        saleStatus: null,
        endDate: null,
        searchValue: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        seriesId: [
          { required: true, message: "请输入合集id", trigger: "blur" },
        ],
        imgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
        userId: [{ required: true, message: "请输入所属id", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        author: [{ required: true, message: "请输入作者", trigger: "blur" }],
        holdAddress: [
          { required: true, message: "请输入持有者地址", trigger: "blur" },
        ],
        handlingFee: [
          { required: true, message: "请输入手续费", trigger: "blur" },
        ],
        copyrightFee: [
          { required: true, message: "请输入版权费", trigger: "blur" },
        ],
        des: [{ required: true, message: "请输入内容", trigger: "blur" }],
        endDate: [
          { required: true, message: "请选择上架结束日期", trigger: "blur" },
        ],
        endDate: [
          { required: true, message: "请选择上架结束日期", trigger: "blur" },
        ],
        remark: [{ required: true, message: "请输入内容", trigger: "blur" }],
      },
      idList: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询nft详情列表 */
    getList() {
      this.loading = true;
      listNftProduct(this.queryParams).then((response) => {
        this.nftProductList = response.rows;
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
        seriesId: null,
        imgUrl: null,
        userId: null,
        price: null,
        chainType: null,
        author: null,
        holdAddress: null,
        handlingFee: null,
        copyrightFee: null,
        des: null,
        status: null,
        saleStatus: null,
        endDate: null,
        remark: null,
        createBy: null,
        updateBy: null,
        createTime: null,
        updateTime: null,
        searchValue: null,
        delFlag: null,
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
      this.getIdList();
      this.title = "添加nft详情";
    },
    // 获取合集id
    async getIdList() {
      let res = await addNftProductList();
      if (res.code === 200) {
        this.idList = res.data;
      }
    },
    /** 上下架 */
    handleGrounding(row) {
      this.getList();
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getNftProduct(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改nft详情";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateNftProduct(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addNftProduct(this.form).then((response) => {
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
        .confirm('是否确认删除nft详情编号为"' + ids + '"的数据项？')
        .then(function () {
          return delNftProduct(ids);
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
        "bussiness/nftProduct/export",
        {
          ...this.queryParams,
        },
        `nftProduct_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
