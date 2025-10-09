<template>
    <div>
      <SearchFormBox>
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="标题1" prop="noticeTitle">
            <el-input
              v-model="queryParams.noticeTitle"
              placeholder="请输入标题"
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
        <!-- 工具栏 -->
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd()"
              v-hasPermi="['bussiness:notice:add']"
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
              v-hasPermi="['bussiness:notice:remove']"
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
              v-hasPermi="['bussiness:notice:export']"
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
          style="overflow: auto"
          border
          v-loading="loading"
          :data="noticeList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column type="index" width="50" align="center" />
          <el-table-column label="编号" align="center" prop="noticeId" />
          <el-table-column label="标题" align="center" prop="noticeTitle" />
          <el-table-column
            label="语言"
            align="center"
            prop="languageId"
            width="120"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.t_app_language"
                :value="scope.row.languageId"
              />
            </template>
          </el-table-column>
          <el-table-column label="类型" align="center" prop="modelType">
          </el-table-column>
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                plain
                v-if="scope.row.status == '0'"
                >开启</el-button
              >
              <el-button
                type="warning"
                size="mini"
                plain
                v-if="scope.row.status == '1'"
                >关闭</el-button
              >
            </template>
          </el-table-column>
          <!-- <el-table-column label="内容" align="center" prop="noticeContent" /> -->
          <el-table-column label="图片" align="center" prop="imgUrl" width="100">
            <template slot-scope="scope">
              <el-image
                style="width: 60px; height: auto"
                :src="scope.row.imgUrl"
                :preview-src-list="[scope.row.imgUrl]"
              >
              </el-image>
            </template>
          </el-table-column>
          <el-table-column label="跳转页" align="center" prop="detailUrl" />
  
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
            width="150"
          >
            <template slot-scope="scope">
              <el-button
                size="small"
                type="primary"
                plain
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:notice:edit']"
                >修改</el-button
              >
              <el-button
                size="small"
                type="danger"
                plain
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:notice:remove']"
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
      <!-- 添加或修改弹窗公告对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <div>
            <el-form-item label="标题" prop="noticeTitle">
              <el-input v-model="form.noticeTitle" />
            </el-form-item>
  
            <el-form-item label="类型" prop="modelKey">
              <el-select v-model="form.modelKey" style="width: 100%">
                <el-option
                  v-for="item in selectList"
                  :key="item.code"
                  :label="item.value"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="内容"
              v-if="form.modelType == 'TEXT_INFORMATION'"
            >
              <editor v-model="form.noticeContent" :min-height="192" />
            </el-form-item>
            <el-form-item label="图片" prop="imgUrl">
              <ImageUpload
                :limit="1"
                v-model="form.imgUrl"
                class="img-list"
              ></ImageUpload>
            </el-form-item>
            <el-form-item label="跳转页" prop="detailUrl">
              <el-input v-model="form.detailUrl" placeholder="请输入内容" />
            </el-form-item>
            <el-form-item label="语言" prop="languageId">
              <el-select v-model="form.languageId" clearable style="width: 100%">
                <el-option
                  v-for="dict in dict.type.t_app_language"
                  :key="dict.label"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
  
            <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark" />
            </el-form-item>
            <!-- <el-form-item label="排序" prop="sort">
                <el-input v-model="form.sort" />
              </el-form-item> -->
            <el-form-item label="活动状态" prop="status" v-if="form.noticeId">
              <el-switch
                v-model="form.status"
                :active-value="'0'"
                :inactive-value="'1'"
              ></el-switch>
            </el-form-item>
            <el-form-item label="活动状态" prop="status" v-else>
              <el-switch
                v-model="status"
                :active-value="true"
                :inactive-value="false"
              ></el-switch>
            </el-form-item>
            <el-form-item
              label="链接地址"
              prop="chainedUrl"
              v-if="form.modelType == 'LINK_INFORMATION'"
            >
              <el-input v-model="form.chainedUrl" />
            </el-form-item>
          </div>
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
    listNotice,
    delNotice,
    addNotice,
    updateNotice,
    getNotice,
  } from "@/api/bussiness/notice";
  export default {
    name: "informationNotice",
    dicts: ["t_app_language"],
    props: ["selectList"],
    data() {
      return {
        status: true,
        navIndex: "",
        tabsArr: {}, // 总条数
        total: 0,
  
        noticeList: [], // 弹窗公告表格数据
  
        single: true, // 非单个禁用
        multiple: true, // 非多个禁用
  
        ids: [], // 选中数组
        loading: true, // 遮罩层
        showSearch: true, // 显示搜索条件
  
        open: false, // 是否显示弹出层
        title: "", // 弹出层标题
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          noticeTitle: null,
          noticeType: null,
          modelType: null,
          noticeContent: null,
          commentsNum: null,
          cover: null,
          viewNum: null,
          expireTime: null,
          imgUrl: null,
          chainedUrl: null,
          detailUrl: null,
          languageId: null,
          status: null,
          sort: null,
          source: null,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          noticeTitle: [
            { required: true, message: "标题不能为空", trigger: "blur" },
          ],
          modelType: [
            {
              required: true,
              message: "模块类型 1=公告信息 2=活动公告 3=首页滚动公告",
            },
          ],
          commentsNum: [
            { required: true, message: "评论数不能为空", trigger: "blur" },
          ],
          viewNum: [
            { required: true, message: "浏览数不能为空", trigger: "blur" },
          ],
          languageId: [
            { required: true, message: "语言不能为空", trigger: "blur" },
          ],
        },
      };
    },
    mounted() {
      this.getList();
    },
    methods: {
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
      /** 删除按钮操作 */
      handleDelete(row) {
        const noticeIds = row.noticeId || this.ids;
        this.$modal
          .confirm('是否确认删除弹窗公告编号为"' + noticeIds + '"的数据项？')
          .then(function () {
            return delNotice(noticeIds);
          })
          .then(() => {
            this.getList();
            this.$modal.msgSuccess("删除成功");
          })
          .catch(() => {});
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          noticeId: null,
          noticeTitle: null,
          noticeType: null,
          modelType: null,
          noticeContent: null,
          commentsNum: null,
          cover: null,
          viewNum: null,
          expireTime: null,
          imgUrl: null,
          chainedUrl: null,
          detailUrl: null,
          languageId: null,
          status: null,
          sort: null,
          remark: null,
          createBy: null,
          createTime: null,
          updateBy: null,
          updateTime: null,
          source: null,
        };
        this.resetForm("form");
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download(
          "bussiness/notice/export",
          {
            ...this.queryParams,
          },
          `notice_${new Date().getTime()}.xlsx`
        );
      },
      /** 查询弹窗公告列表 */
      getList() {
        this.loading = true;
        this.queryParams["key"] = "POP_UPS_NOTICE";
        listNotice(this.queryParams).then((response) => {
          // listNotice({ key: item }).then((response) => {
          if (response.code == "200") {
            this.noticeList = response.rows;
            this.total = response.total;
            setTimeout(() => {
              this.loading = false;
            }, 300);
          }
        });
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加弹窗公告";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const noticeId = row.noticeId || this.ids;
        getNotice(noticeId).then((response) => {
          this.form = response.data;
          this.open = true;
          this.title = "修改弹窗公告";
        });
      },
      // 多选框选中数据
      handleSelectionChange(selection) {
        this.ids = selection.map((item) => item.noticeId);
        this.single = selection.length !== 1;
        this.multiple = !selection.length;
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate((valid) => {
          if (valid) {
            if (this.form.noticeId != null) {
              (this.form.key = "POP_UPS_NOTICE"),
                updateNotice(this.form).then((response) => {
                  this.$modal.msgSuccess("修改成功");
                  this.open = false;
                  this.getList();
                });
            } else {
              let data = {};
              data = {
                noticeTitle: this.form.noticeTitle,
                modelKey: this.form.modelKey,
                key: "POP_UPS_NOTICE",
                languageId: this.form.languageId,
                remark: this.form.remark,
                status: this.status == true ? 0 : 1,
                imgUrl: this.form.imgUrl,
                sort: this.form.sort,
                expireTime: this.form.expireTime,
                detailUrl: this.form.detailUrl,
              };
              addNotice(data).then((response) => {
                this.$modal.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              });
            }
          }
        });
      },
    },
  };
  </script>
  
  <style lang="scss" scoped>
  ::v-deep .img-list {
    .el-upload--picture-card,
    .el-upload-list__item {
      width: 100%;
      img {
        object-fit: cover;
      }
    }
  }
  </style>
  