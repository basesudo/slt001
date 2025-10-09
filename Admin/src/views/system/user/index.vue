<template>
  <div class="app-container">
    <el-row>
      <!-- <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="deptName"
            placeholder="请输入部门名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="deptOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col> -->

      <SearchFormBox>
        <el-form
          :model="queryParams"
          ref="queryForm"
          size="small"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="用户名称" prop="userName">
            <el-input
              v-model="queryParams.userName"
              placeholder="请输入用户名称"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="手机号码" prop="phonenumber">
            <el-input
              v-model="queryParams.phonenumber"
              placeholder="请输入手机号码"
              clearable
              style="width: 240px"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="用户状态"
              clearable
              style="width: 240px"
            >
              <el-option
                v-for="dict in dict.type.sys_normal_disable"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
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
              v-hasPermi="['system:user:add']"
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
              v-hasPermi="['system:user:edit']"
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
              v-hasPermi="['system:user:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="info"
              plain
              icon="el-icon-upload2"
              size="mini"
              @click="handleImport"
              v-hasPermi="['system:user:import']"
              >导入</el-button
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
              v-hasPermi="['system:user:export']"
              >导出</el-button
            >
          </el-col> -->
          <right-toolbar
            :showSearch.sync="showSearch"
            @queryTable="getList"
            :columns="columns"
          ></right-toolbar>
        </el-row>

        <el-table
          height="calc(100vh - 360px)"
          style="overflow: auto"
          border
          v-loading="loading"
          :data="userList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="用户编号"
            align="center"
            key="userId"
            prop="userId"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="用户名称"
            align="center"
            key="userName"
            prop="userName"
            v-if="columns[1].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="用户昵称"
            align="center"
            key="nickName"
            prop="nickName"
            v-if="columns[2].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="部门"
            align="center"
            key="deptName"
            prop="dept.deptName"
            v-if="columns[3].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            label="手机号码"
            align="center"
            key="phonenumber"
            prop="phonenumber"
            v-if="columns[4].visible"
            width="120"
          />
          <el-table-column
            label="状态"
            align="center"
            key="status"
            v-if="columns[5].visible"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.status"
                active-value="0"
                inactive-value="1"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="GoogleKey" width="160" align="center">
            <template slot-scope="scope">
              <el-button
                plain
                size="mini"
                type="primary"
                @click="lookFor(scope.row)"
                >查看</el-button
              >
              <el-button
                plain
                size="mini"
                type="primary"
                @click="upDate(scope.row)"
                >更新</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="createTime"
            v-if="columns[6].visible"
            width="160"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="用户类型"
            align="center"
            key="userType"
            prop="userType"
            v-if="columns[6].visible"
            width="160"
          >
            <template slot-scope="scope">
              <dict-tag
                :options="dict.type.sys_user_type"
                :value="scope.row.userType"
              />
              <!-- <span v-if="scope.row.userType == '0'">普通用户</span>
              <span v-else-if="scope.row.userType == '1'">组长</span>
              <span v-else-if="scope.row.userType == '2'">代理</span> -->
            </template>
          </el-table-column>
          <el-table-column
            label="绑定代理"
            align="center"
            key="scope.row.userType"
            prop="scope.row.userType"
            v-if="columns[6].visible"
            @click="bind(scope.row)"
            width="160"
          >
            <template slot-scope="scope" v-if="scope.row.userType == '1'">
              <el-button
                plain
                size="mini"
                type="primary"
                @click="saveBinding(scope.row)"
                v-hasPermi="['system:user:add']"
                >添加</el-button
              >
              <!-- <span @click="bindOpen == true">代理</span> -->
            </template>
          </el-table-column>
          <el-table-column
            label="玩家用户"
            align="center"
            prop="userType"
            v-if="columns[6].visible"
            width="160"
          >
            <template
              slot-scope="scope"
              v-if="scope.row.userType == '2' || scope.row.userType == '1'"
            >
              <el-button
                plain
                size="mini"
                type="primary"
                @click="saveGameBinding(scope.row)"
                v-hasPermi="['system:user:remove']"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            width="220"
            class-name="small-padding fixed-width"
            fixed="right"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.userId !== 1 && scope.row.userId !== 2"
                style="height: 35px"
              >
                <el-button
                  plain
                  size="small"
                  type="primary"
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                  >修改</el-button
                >
                <el-button
                  plain
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                  >删除</el-button
                >
                <el-dropdown
                  size="mini"
                  @command="(command) => handleCommand(command, scope.row)"
                  v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
                >
                  <el-button plain size="small" type="primary">更多</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      command="handleResetPwd"
                      icon="el-icon-key"
                      v-hasPermi="['system:user:resetPwd']"
                      >重置密码</el-dropdown-item
                    >
                    <!-- <el-dropdown-item
                      command="handleAuthRole"
                      icon="el-icon-circle-check"
                      v-hasPermi="['system:user:edit']"
                      >分配角色</el-dropdown-item
                    > -->
                  </el-dropdown-menu>
                </el-dropdown>
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
    </el-row>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input
                v-model="form.nickName"
                placeholder="请输入用户昵称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <treeselect
                v-model="form.deptId"
                :options="deptOptions"
                :show-count="true"
                placeholder="请选择归属部门"
              />
            </el-form-item>
          </el-col> -->
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户名称"
              prop="userName"
            >
              <el-input
                v-model="form.userName"
                placeholder="请输入用户名称"
                maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
                maxlength="20"
                show-password
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择性别">
                <el-option
                  v-for="dict in dict.type.sys_user_sex"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <!-- <el-col :span="12">
            <el-form-item label="岗位">
              <el-select
                v-model="form.postIds"
                multiple
                placeholder="请选择岗位"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                :default-first-option="false"
                v-model="form.roleIds"
                placeholder="请选择角色"
                multiple
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="类型" prop="userType">
              <el-select v-model="form.userType" placeholder="请选择类型">
                <el-option
                  v-for="dict in dict.type.sys_user_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 绑定代理 -->
    <el-dialog
      :title="'代理用户'"
      :visible.sync="bindOpen"
      width="1000px"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="80px">
        <el-row class="row">
          <el-col>
            <el-table
              style="width: 100%"
              max-height="484"
              v-loading="loading"
              :data="bindUserList"
              @selection-change="bindList"
            >
              <el-table-column type="selection" width="50" align="center" />
              <el-table-column
                label="用户编号"
                align="center"
                key="userId"
                prop="userId"
                v-if="columns[0].visible"
              />

              <el-table-column
                label="用户昵称"
                align="center"
                key="nickName"
                prop="nickName"
                v-if="columns[2].visible"
                :show-overflow-tooltip="true"
              />

              <el-table-column
                label="创建时间"
                align="center"
                key="createTime"
                prop="createTime"
                v-if="columns[0].visible"
              />
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <pagination
        v-show="adminTotal > 0"
        :total="adminTotal"
        :page.sync="queryParams1.pageNum"
        :limit.sync="queryParams1.pageSize"
        @pagination="getAdminUserList"
      />
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveBind">确 定</el-button>
        <el-button @click="cancelBind">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 绑定玩家 -->
    <el-dialog
      :title="'玩家用户'"
      :visible.sync="bindGameOpen"
      width="1000px"
      append-to-body
    >
      <div style="margin-bottom: 20px">
        用户ID：
        <el-input
          v-model="queryParams2.userId"
          clearable
          style="width: 240px"
        />
        用户名：
        <el-input
          v-model="queryParams2.loginName"
          clearable
          style="width: 240px"
        />

        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="searchSubmint"
          style="margin-left: 20px"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetSubmit"
          >重置</el-button
        >
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-row class="row">
          <el-col>
            <el-table
              style="width: 100%"
              max-height="484"
              ref="multipleTable"
              v-loading="loading"
              :data="gameList"
              @selection-change="bindGameList"
            >
              <el-table-column
                type="selection"
                aria-checked="flag =='true'?true:false"
                width="50"
                align="center"
              />
              <el-table-column
                label="用户编号"
                align="center"
                key="userId"
                prop="userId"
                v-if="columns[0].visible"
              />
              <el-table-column
                label="用户昵称"
                align="center"
                key="loginName"
                prop="loginName"
                v-if="columns[0].visible"
              />
              <el-table-column
                label="创建时间"
                align="center"
                key="updateTime"
                prop="updateTime"
                v-if="columns[0].visible"
              />
            </el-table>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveGameBind">确 定</el-button>
        <el-button @click="cancelGameBind">取 消</el-button>
      </div>
      <pagination
        class="pagination"
        v-show="gameTotal > 0"
        :total="gameTotal"
        :page.sync="queryParams2.pageNum"
        :limit.sync="queryParams2.pageSize"
        @pagination="getAppUserList"
      />
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      width="400px"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" />
            是否更新已经存在的用户数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link
            type="primary"
            :underline="false"
            style="font-size: 12px; vertical-align: baseline"
            @click="importTemplate"
            >下载模板</el-link
          >
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus,
  deptTreeSelect,
  bindActing,
  getAdminUserList,
  getAppUserList,
  bindGameUser,
  FundAdminUserList,
  updateCode,
  googleCode,
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  dicts: ["sys_normal_disable", "sys_user_sex", "sys_user_type"],
  components: { Treeselect },
  data() {
    return {
      bindForm: { userId: undefined, adminUserIds: undefined },
      bindGameForm: { userId: undefined, appUserIds: undefined },
      //代理
      bindOpen: false,
      //玩家用户
      bindGameOpen: false,
      bindIds: [],
      bindUserList: [],
      gameList: [],
      // 查询可绑定代理用户参数
      queryParams1: {
        pageNum: 1,
        pageSize: 10,
      },
      // 查询可绑定玩家用户参数
      queryParams2: {
        pageNum: 1,
        pageSize: 10,
        userId: undefined,
        loginName: undefined,
        adminParentIds: undefined,
      },
      // 总条数
      adminTotal: 0,
      // 总条数
      gameTotal: 0,
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
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: __config._BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        phonenumber: undefined,
        status: undefined,
        deptId: undefined,
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "用户名称长度必须介于 2 和 20 之间",
            trigger: "blur",
          },
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
          {
            min: 5,
            max: 20,
            message: "用户密码长度必须介于 5 和 20 之间",
            trigger: "blur",
          },
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
        roleIds: [
          { required: true, message: "用户角色不能为空", trigger: "blur" },
        ],
        userType: [
          { required: true, message: "用户类型不能为空", trigger: "blur" },
        ],
      },
      pageNum: 1,
      pageSize: 10,
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    },
  },
  mounted() {
    // this.FundAdminUserList();
    // console.log(this.$store.getters.name, "this.$store.user");
    // loginName: this.$store.getters.name,
  },
  created() {
    this.getList();
    this.getDeptTree();
    this.getConfigKey("sys.user.initPassword").then((response) => {
      this.initPassword = response.msg;
    });
  },
  methods: {
    //  更新googleKey
    upDate(row) {
      updateCode({ userId: row.userId }).then(() => {});
      // let url = location.href;
      // window.open(`${location.href}?userId=${row.userId}`);
    },

    //查询googleKey
    lookFor(row) {
      // googleCode({ userId: row.userId }).then(() => {});
      window.open(
        `${__config._BASE_API}/system/user/googleCode?userId=${row.userId}`
      );
    },

    /** 查询查询代理下的玩家用户列表 */
    FundAdminUserList() {
      FundAdminUserList({
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        // console.log(res);
      });
    },

    /** 查询可被绑定代理列表 */
    getAdminUserList() {
      getAdminUserList(this.queryParams1).then((res) => {
        console.log(res.rows);
        this.bindUserList = res.rows;
        this.adminTotal = res.total;
      });
    },

    /** 查询可被绑定用户列表 */
    getAppUserList() {
      this.loading = true;
      getAppUserList(this.queryParams2).then((res) => {
        this.gameList = res.rows;
        this.gameTotal = res.total;
        this.$nextTick(() => {
          this.gameList.forEach((elem) => {
            if (elem.flag == "true") {
              this.$refs.multipleTable.toggleRowSelection(elem, true);
            }
          });
        });
        this.loading = false;
      });
    },

    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      deptTreeSelect().then((response) => {
        this.deptOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    //添加代理
    saveBinding(row) {
      this.bindOpen = true;
      this.bindForm.userId = row.userId;
      this.getAdminUserList();
    },
    //添加玩家用户
    saveGameBinding(row) {
      this.bindGameForm.userId = row.userId;
      this.queryParams2.adminParentIds = row.userId;
      this.bindGameOpen = true;
      this.getAppUserList();
    },
    //获取代理userId
    bindList(selection) {
      let arr = selection.map((item) => item.userId);
      if (arr.length == 0) {
        this.bindForm.adminUserIds = "";
      } else if (arr.length == 1) {
        this.bindForm.adminUserIds = arr.join("");
      } else {
        this.bindForm.adminUserIds = arr.join(",");
      }
    },
    //获取玩家用户userId
    bindGameList(selection) {
      let arr = selection.map((item) => item.userId);
      if (arr.length == 0) {
        this.bindGameForm.appUserIds = "";
      } else if (arr.length == 1) {
        this.bindGameForm.appUserIds = arr.join("");
      } else {
        this.bindGameForm.appUserIds = arr.join(",");
      }
    },
    //绑定代理
    bindActing() {
      bindActing(this.bindForm).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.getAdminUserList();
      });
    },

    //绑定玩家用户
    bindGameUser() {
      bindGameUser(this.bindGameForm).then((res) => {
        this.$modal.msgSuccess(res.msg);
        this.getAppUserList();
      });
    },
    //代理对话框确定
    saveBind() {
      this.bindActing();
      this.bindOpen = false;
    },
    cancelBind() {
      this.bindOpen = false;
    },
    //玩家用户对话框确定
    saveGameBind() {
      this.bindGameUser();
      this.bindGameOpen = false;
    },
    cancelGameBind() {
      this.bindGameOpen = false;
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        deptId: null,
        userName: null,
        nickName: null,
        password: null,
        phonenumber: null,
        email: null,
        sex: null,
        userType: null,
        status: "0",
        remark: null,
        postIds: [],
        roleIds: [],
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    //搜索玩家用户,搜索条件 loginName
    searchSubmint() {
      this.getAppUserList();
    },
    //重置
    resetSubmit() {
      this.queryParams2.loginName = null;
      this.queryParams2.userId = null;
      // this.queryParams2.adminParentIds = null;
      this.getAppUserList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.queryParams.deptId = null;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    // 更多操作触发
    handleCommand(command, row) {
      switch (command) {
        case "handleResetPwd":
          this.handleResetPwd(row);
          break;
        // case "handleAuthRole":
        //   this.handleAuthRole(row);
        //   break;
        default:
          break;
      }
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      getUser().then((response) => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.$set(this.form, "postIds", response.postIds);
        this.$set(this.form, "roleIds", response.roleIds);
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        closeOnClickModal: false,
        inputPattern: /^.{5,20}$/,
        inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then((response) => {
            this.$modal.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },
    /** 分配角色操作 */
    // handleAuthRole: function (row) {
    //   const userId = row.userId;
    //   this.$router.push("/system/user-auth/role/" + userId);
    // },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then((response) => {
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
      const userIds = row.userId || this.ids;
      this.$modal
        .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
        .then(function () {
          return delUser(userIds);
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
        "system/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {},
        `user_template_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(
        "<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" +
          response.msg +
          "</div>",
        "导入结果",
        { dangerouslyUseHTMLString: true }
      );
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>
<style scoped>
.row {
  height: 484px;
}
/* .table {
  height: 484px;
  overflow: hidden;
} */
</style>
