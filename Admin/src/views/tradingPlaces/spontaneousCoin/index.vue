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
        <el-form-item label="币种" prop="coin">
          <el-input
            v-model="queryParams.coin"
            placeholder="请输入币种"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="参考币种" prop="referCoin">
          <el-input
            v-model="queryParams.referCoin"
            placeholder="请输入参考币种"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <!-- <el-form-item label="开始时间" prop="beginTime">
            <el-date-picker
              clearable
              v-model="queryParams.beginTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择开始时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="结束时间" prop="endTime">
            <el-date-picker
              clearable
              v-model="queryParams.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择结束时间"
            >
            </el-date-picker>
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
        <el-col :span="1.5">
          <el-button
            type="primary"
            plain
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd"
            v-hasPermi="['bussiness:spontaneousCoin:add']"
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
              v-hasPermi="['bussiness:coin:edit']"
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
              v-hasPermi="['bussiness:coin:remove']"
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
              v-hasPermi="['bussiness:coin:export']"
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
        :data="ownCoinList"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键ID" align="center" prop="id" />
        <el-table-column label="图标" align="center" prop="logo">
          <template slot-scope="scope">
            <el-image
              style="width: 30px; height: auto"
              :src="scope.row.logo"
              :preview-src-list="[scope.row.logo]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="币种" align="center" prop="coin" />
        <el-table-column label="参考币种" align="center" prop="referCoin" />

        <el-table-column
          label="参考币种交易所"
          align="center"
          prop="referMarket"
        />
        <!-- <el-table-column label="展示名称" align="center" prop="showSymbol" /> -->
        <el-table-column label="初始价格" align="center" prop="price" />
        <!-- <el-table-column
            label="私募发行量"
            align="center"
            prop="raisingAmount"
          />
          <el-table-column label="总发行量" align="center" prop="totalAmount" />
          <el-table-column label="预购上限" align="center" prop="purchaseLimit" />
          <el-table-column label="介绍说明" align="center" prop="introduce" />
          <el-table-column
            label="已筹集额度"
            align="center"
            prop="raisedAmount"
          />
          <el-table-column
            label="参与人数"
            align="center"
            prop="participantsNum"
          />
          <el-table-column label="筹集期限" align="center" prop="raisingTime" /> -->
        <!-- <el-table-column
            label="开始时间"
            align="center"
            prop="createTime"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column> -->
        <!-- <el-table-column
            label="结束时间"
            align="center"
            prop="endTime"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.endTime, "{y}-{m}-{d}") }}</span>
            </template>
          </el-table-column> -->
        <el-table-column label="价格百分比" align="center" prop="proportion" />
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                size="small"
                type="primary"
                plain
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:spontaneousCoin:edit']"
                >修改</el-button
              >
              <el-button
                plain
                size="small"
                type="warning"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:spontaneousCoin:remove']"
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

    <!-- 添加或修改发币对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      width="800px"
      :append-to-body="false"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item label="币种" prop="coin">
          <el-input v-model="form.coin" />
        </el-form-item>
        <el-form-item label="参考币种" prop="referCoin">
          <el-select
            v-model="form.referCoin"
            filterable
            placeholder="请选择币种"
            style="width: 100%"
            @change="changeCoin"
          >
            <el-option
              v-for="coin in coinList"
              :key="coin.label"
              :label="coin.label"
              :value="coin.coin"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="参考币种交易所" prop="referMarket">
          <el-input v-model="form.referMarket" disabled />
        </el-form-item>

        <el-form-item label="图标" prop="logo">
          <ImageUpload :limit="1" v-model="form.logo"></ImageUpload>
        </el-form-item>
        <el-form-item label="初始价格" prop="price">
          <el-input v-model="form.price" disabled />
          <div class="slider-box" v-if="form.referMarket">
            <div class="slider">
              <el-slider
                :popper-append-to-body="false"
                v-model="sliderValue"
                @input="sliderChange"
                @change="sliderChange"
                :min="-500"
                :max="500"
                :step="50"
                :marks="sliderMarks"
                :format-tooltip="formatTooltip"
              >
              </el-slider>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item label="价格百分比" prop="proportion">
          <el-input v-model="form.proportion" />
        </el-form-item> -->
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
  listCoin,
  getCoin,
  delCoin,
  addCoin,
  updateCoin,
} from "@/api/bussiness/spontaneousCoin";
import { getSelectList } from "@/api/system/type";
import {
  _mul,
  _div,
  _toFixed,
  _SN2D,
  _add,
} from "../../bussiness/trade-robot/decimal";
export default {
  name: "Coin",
  dicts: ["lssue_coins_status"],
  data() {
    var percent = (rule, value, callback) => {
      if (value) {
        if (
          !/^((?:0|[1-9][0-9]?|100)|(([0]\.\d{1,4}|[1-9][0-9]*\.\d{1,4})))$/.test(
            value
          )
        ) {
          return callback(new Error("支持0到100,小数四位"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var compareMin = (rule, value, callback) => {
      if (value) {
        if (Number(value) >= Number(this.form.raisingAmount)) {
          return callback(new Error("已筹集额度不大于私募发行量"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var moneyShow = (rule, value, callback) => {
      if (value) {
        if (Number(value) == 0) {
          return callback(new Error("价格不能为0"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    var timeer = (rule, value, callback) => {
      let date1 = new Date(this.form.beginTime).getTime();
      let date2 = new Date(this.form.endTime).getTime();
      if (value) {
        if (date2 < date1) {
          return callback(new Error("结束时间需大于开始时间"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      /**
       * 表单
       */
      sliderForm: {
        price: "",
        count: "",
        turnover: "",
      },
      amountAvailable: "",
      /**
       * 进度条 比例
       */
      sliderValue: 0,
      /**
       * 刻度标记
       */
      sliderMarks: {
        "-500": {
          label: "-500%",
          style: {
            width: "50px",
          },
        },
        "-375": "-375%",
        "-250": "-250%",
        "-125": "-125%",
        0: "0",
        125: "125%",
        250: "250%",
        375: "375%",
        500: {
          label: "500%",
          style: {
            width: "50px",
          },
        },
      },
      /**
       * 临时标记key
       */
      tempChangeKey: "",
      //币种交易所
      coinList: [],
      currentMarket: {},
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
      // 发币表格数据
      ownCoinList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        coin: null,
        referCoin: null,
        referMarket: null,

        price: null,
        raisingAmount: null,
        raisedAmount: null,
        participantsNum: null,
        raisingTime: null,
        beginTime: null,
        endTime: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        // proportion: [
        //   {
        //     required: true,
        //     message: "百分比",
        //     trigger: "blur",
        //   },
        //   { validator: percent, trigger: "blur" },
        // ],
        raisedAmount: [
          {
            required: true,
            message: "已筹集额度不大于筹集额度",
            trigger: "blur",
          },
          { validator: compareMin, trigger: "blur" },
        ],
        raisingAmount: [
          {
            required: true,
            message: "私募发行量不为空",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            message: "价格不为0",
            trigger: "blur",
          },
          { validator: moneyShow, trigger: "blur" },
        ],
        raisingTime: [
          {
            required: true,
            message: "参与人数不为空",
            trigger: "blur",
          },
        ],
        participantsNum: [
          {
            required: true,
            message: "筹集期限不为空",
            trigger: "blur",
          },
        ],

        coin: [
          {
            required: true,
            message: "币种不为空",
            trigger: "blur",
          },
        ],
        beginTime: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
          { validator: timeer, trigger: "blur" },
        ],
        endTime: [
          {
            required: true,
            message: "必填",
            trigger: "blur",
          },
          { validator: timeer, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
    this.getSelectList();
  },
  // watch: {
  //   currentMarket: {
  //     handler(newVal) {
  //       this.changeCoin(newVal.coin ? newVal.coin : "");
  //     },
  //     deep: true,
  //     immediate: true,
  //   },
  // },

  methods: {
    /** 获取币种交易所 */
    getSelectList() {
      getSelectList().then((res) => {
        this.coinList = res.data?.map((elem) => {
          elem.label = `${elem.coin}-${elem.market}`;
          return elem;
        });
      });
    },
    /**币种交易所 */
    changeCoin(e) {
      let list = this.coinList.filter((item) => {
        if (item.coin == e) {
          return item;
        }
      });
      this.currentMarket = list[0];
      this.form.referMarket = this.currentMarket?.market; //交易所
      this.amountAvailable = this.currentMarket?.price;
      this.form.price = this.currentMarket?.price; //初始价格
    },

    formatTooltip(val) {},
    //滑块监听

    sliderChange(val) {
      if (this.tempChangeKey) {
        this.tempChangeKey = "";
        return;
      }
      // 使用可用金额 百分比 计算交易金额
      if (this.amountAvailable && Number(val) !== 0) {
        //百分之一对应的钱
        if (Number(val) > 0) {
          let percentPrice = _toFixed(_div(this.amountAvailable, 100), 6);
          this.form.price = _toFixed(_mul(percentPrice, val), 6);
          this.sliderValue = Number(val);
          // this.form.proportion = Number(val);
          this.form.proportion = _mul(
            _div(this.form.price, this.amountAvailable),
            100
          );
          console.log(this.form.proportion, "999");
        } else if (val < 0) {
          // 百分之一
          let x = _div(_add(500, val), 500);
          this.form.price = _toFixed(_mul(this.amountAvailable, x), 6);
          this.sliderValue = Number(val);
          if (val == -500) {
            this.form.proportion = 0;
            console.log(this.form.proportion, "999");
          } else {
            this.form.proportion = _mul(
              _div(this.form.price, this.amountAvailable),
              100
            );
            console.log(this.form.proportion, "999");
          }
        }
      } else {
        this.sliderValue = 0;
        this.form.price = this.amountAvailable;
        this.form.proportion = 100;
        this.sliderForm.count = "0";
        this.sliderForm.turnover = "0";
        console.log(this.form.proportion, "999");
      }
    },
    /** 查询发币列表 */
    getList() {
      this.loading = true;
      listCoin(this.queryParams).then((response) => {
        this.ownCoinList = response.rows;
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
        coin: null,
        referCoin: null,
        referMarket: null,

        price: null,
        raisingAmount: null,
        raisedAmount: null,
        participantsNum: null,
        raisingTime: null,
        beginTime: null,
        endTime: null,
        status: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        proportion: null,
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
      this.title = "添加发币";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids;
      getCoin(id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改发币";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.id != null) {
            updateCoin(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addCoin(this.form).then((response) => {
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
        .confirm('是否确认删除发币编号为"' + ids + '"的数据项？')
        .then(function () {
          return delCoin(ids);
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
        "bussiness/coin/export",
        {
          ...this.queryParams,
        },
        `coin_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>
<style scoped lang="scss">
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
.slider-box {
  width: 100%;
  margin: 0 0 15px 0;
  .slider {
    width: 99%;
    padding: 0 5px;
    :deep(.el-slider) {
      .el-slider__stop {
        width: 10px;
        height: 10px;
        background: #fafbfe;
        border: 1px solid #cecece;
        position: absolute;
        top: -4px;
      }
      .el-slider__button {
        width: 10px;
        height: 10px;
        background: #ffffff;
        border: none;
        position: absolute;
        top: 11px;
        left: 13px;
      }
      .el-slider__runway {
        height: 2px;
        background: #505360;
      }
      .el-slider__bar {
        height: 2px;
        background: #536fff;
      }
      :deep(.el-slider__marks-text) {
        width: 50px !important;
      }
      // div.el-slider__marks-text {
      //   width: 50px!important;
      //   font-size: 14px;
      //   margin-top: 10px;
      //   color: #ffffff;
      // }
    }
  }
}
</style>
