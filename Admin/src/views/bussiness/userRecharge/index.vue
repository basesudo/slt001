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
        <el-form-item label="币种名称" prop="symbol">
          <el-select v-model="queryParams.symbol" clearable style="width: 100%">
            <el-option
              v-for="coin in coinList"
              :key="coin.id"
              :label="coin.coinName"
              :value="coin.coinName"
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:symbol/address:add']"
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
          v-hasPermi="['bussiness:symbol/address:edit']"
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
          v-hasPermi="['bussiness:symbol/address:remove']"
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
          v-hasPermi="['bussiness:symbol/address:export']"
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
        :data="userRechargeList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="币种名称" align="center" prop="symbol" />
        <el-table-column label="充值地址" align="center" prop="address" />

        <el-table-column
          label="操作"
          align="center"
          fixed="right"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="mini"
                plain
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:symbol/address:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                plain
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:symbol/address:remove']"
                >删除</el-button
              >
            </div>
          </template>
        </el-table-column>
      </el-table>
    </TableContentBox>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改用户充值地址对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户ID">
          <el-input v-model="$route.query.userId" type="text" disabled />
        </el-form-item>
        <el-form-item label="充值类型" prop="symbol" v-if="!update">
          <el-select
            v-model="form.symbol"
            clearable
            style="width: 100%"
            @change="changeCoin"
          >
            <el-option
              v-for="coin in coinList"
              :key="coin.id"
              :label="coin.coinName"
              :value="coin.coinName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="充值类型" prop="symbol" v-if="update">
          <el-input v-model="form.symbol" type="text" disabled />
        </el-form-item>
        <el-form-item label="充值地址" prop="address">
          <!-- <div class="generate">
            <el-input
              v-model="form.address"
              type="text"
              placeholder="请输入内容"
            />
            <el-button type="primary" @click="generate">生成地址</el-button>
          </div> -->

          <el-input
            v-model="form.address"
            type="text"
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
  listUserRecharge,
  getUserRecharge,
  delUserRecharge,
  addUserRecharge,
  updateUserRecharge,
  getAdress,
} from "@/api/bussiness/userRecharge";
import { getSettingConfig } from "@/api/public.js";
export default {
  name: "UserRecharge",
  data() {
    return {
      //当前币种
      currentList: [],
      //是否是修改
      update: false,
      coinList: [],
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
      // 用户充值地址表格数据
      userRechargeList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        symbol: null,
        rechargeAdress: null,
        userId: null,
      },
      // 表单参数
      form: {},
      // 表单校验address: [{ required: true, message: "地址不能为空", trigger: "blur" }],
      rules: {
        symbol: [
          { required: true, message: "币种不能为空", trigger: "change" },
        ],
      },
    };
  },

  destroyed() {
    this.queryParams.userId = null;
  },
  created() {
    this.getList();
    this.form.userId = this.$route.query.userId;
    /** 获取充值列表 */
    getSettingConfig("ASSET_COIN").then((res) => {
      this.coinList = res.data;
    });
  },

  methods: {
    //当前选中
    changeCoin(e) {
      this.currentList = this.coinList.filter((item) => {
        if (item.coinName == e) {
          return item;
        }
      });
    },
    //生成地址
    generate() {
      getAdress({ coin: this.currentList[0].coin }).then((res) => {
        console.log(res.data);
      });
    },
    /** 查询用户充值地址列表 */
    getList() {
      this.loading = true;
      this.queryParams.userId = this.$route.query.userId;
      listUserRecharge(this.queryParams).then((response) => {
        this.userRechargeList = response.rows;
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
        rechargeAdress: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        userId: null,
        address: null,
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
      this.title = "添加用户充值地址";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      this.update = true;
      getUserRecharge(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改用户充值地址";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateUserRecharge(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
              this.update = false;
            });
          } else {
            let data = {
              userId: this.$route.query.userId,
              symbol: this.form.symbol,
              address: this.form.address,
              coin: this.currentList[0].coin,
            };

            addUserRecharge(data).then((response) => {
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
        .confirm('是否确认删除用户充值地址编号为"' + ids + '"的数据项？')
        .then(function () {
          return delUserRecharge(ids);
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
        "bussiness/userRecharge/export",
        {
          ...this.queryParams,
        },
        `userRecharge_${new Date().getTime()}.xlsx`
      );
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
    // width: 60px;
    flex: 1;
    margin: 5px;
  }
}
.generate {
  display: flex;
  justify-content: space-between;
}
</style>
