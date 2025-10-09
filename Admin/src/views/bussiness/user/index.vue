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
        <el-form-item label="用户Id" prop="userId">
          <el-input
            v-model="queryParams.userId"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="登录名" prop="loginName">
          <el-input
            v-model="queryParams.loginName"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="queryParams.phone"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="queryParams.email"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="用户类型" prop="isTest">
          <el-select v-model="queryParams.isTest" clearable>
            <el-option
              v-for="dict in dict.type.user_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input
            v-model="queryParams.address"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="冻结状态" prop="status">
          <el-select v-model="queryParams.status" clearable>
            <el-option
              v-for="dict in dict.type.app_user_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="玩家代理" prop="appParentIds">
          <el-input
            v-model="queryParams.appParentIds"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="注册域名" prop="host">
          <el-input
            v-model="queryParams.host"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="后台代理" prop="adminParentIds">
          <el-input
            v-model="queryParams.adminParentIds"
            clearable
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-row>
          <el-col :span="24">
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
          </el-col>
        </el-row>
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
            v-hasPermi="['bussiness:user:add']"
            >新增</el-button
          >
        </el-col>

        <right-toolbar
          :columns.sync="columns"
          :showSearch.sync="showSearch"
          pageName="bussinessUser"
          @queryTable="getList"
        ></right-toolbar>
      </el-row>

      <el-table
        height="calc(100vh - 360px)"
        border
        @sort-change="sortTableFun"
        v-loading="loading"
        :data="userList"
        :default-sort="{ prop: 'date', order: 'descending' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          label="用户ID"
          min-width="70"
          align="center"
          prop="userId"
          v-if="columns[0].visible"
        />
        <el-table-column
          label="用户类型"
          align="center"
          prop="isTest"
          v-if="columns[1].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.user_type"
              :value="scope.row.isTest"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="登录名"
          min-width="150"
          align="center"
          prop="loginName"
          v-if="columns[2].visible"
        />
        <el-table-column
          label="备注"
          min-width="180"
          align="center"
          prop="remark"
          v-if="columns[3].visible"
        />
        <el-table-column
          label="邮箱"
          min-width="150"
          align="center"
          prop="email"
          v-if="columns[4].visible"
        />

        <el-table-column
          label="地址"
          min-width="130"
          align="center"
          prop="address"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.address">
              <el-link
                :underline="false"
                v-clipboard="scope.row.address"
                v-clipboard:success="clipboardSuccess"
              >
                {{
                  scope.row.address &&
                  `${scope.row.address.substr(
                    0,
                    4
                  )}******${scope.row.address.substr(-4)}`
                }}
                <i class="el-icon-copy-document"></i>
              </el-link>
            </div>
            <div v-else>无地址</div>
          </template>
        </el-table-column>
        <el-table-column
          label="地址类型"
          align="center"
          prop="walletType"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.user_address_type"
              :value="scope.row.walletType"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="是否冻结"
          align="center"
          prop="status"
          v-if="columns[7].visible"
        >
          <template slot-scope="scope">
            <dict-tag
              :options="dict.type.app_user_status"
              :value="scope.row.status"
            />
          </template>
        </el-table-column>

        <el-table-column
          label="玩家代理"
          min-width="130"
          align="center"
          prop="appParentIds"
          v-if="columns[8].visible"
        />
        <el-table-column
          label="玩家代理用户名"
          min-width="130"
          align="center"
          prop="appParentNames"
          v-if="columns[9].visible"
        />
        <el-table-column
          label="后台代理"
          min-width="130"
          align="center"
          prop="adminParentIds"
          v-if="columns[10].visible"
        />
        <el-table-column
          label="后台代理用户名"
          min-width="130"
          align="center"
          prop="adminParentNames"
          v-if="columns[11].visible"
        />
        <el-table-column
          label="注册IP"
          min-width="130"
          align="center"
          prop="registerIp"
          v-if="columns[12].visible"
        />
        <el-table-column
          label="注册域名"
          min-width="180"
          align="center"
          prop="host"
          v-if="columns[13].visible"
        />
        <el-table-column
          label="手机号"
          min-width="150"
          align="center"
          prop="phone"
          v-if="columns[14].visible"
        />
        <el-table-column
          label="注册时间"
          sortable
          min-width="180"
          align="center"
          prop="createTime"
          v-if="columns[15].visible"
        />

        <el-table-column
          fixed="right"
          min-width="220"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <div class="btns">
              <el-button
                v-if="['rxce', 'dev'].includes(VUE_APP_ENV)"
                size="mini"
                plain
                type="danger"
                @click="setBlack(scope.row)"
                v-hasPermi="['bussiness:user:updateBlackStatus']"
                >{{ scope.row.isBlack == 2 ? "移除黑名单" : "拉黑" }}</el-button
              >
              <el-button
                size="mini"
                plain
                type="info"
                @click="getDetail(scope.row)"
                >详情</el-button
              >
              <el-button
                size="mini"
                plain
                type="primary"
                @click="winorLose(scope.row)"
                v-hasPermi="['bussiness:user:buff']"
                >输赢</el-button
              >
              <el-button
                size="mini"
                plain
                type="primary"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['bussiness:user:edit']"
                >修改</el-button
              >
              <el-button
                size="mini"
                plain
                type="success"
                v-hasPermi="['bussiness:user:sendBous']"
                @click="openDialogKey('showWinningsDialog', scope.row)"
                >彩金</el-button
              >
              <el-button
                size="mini"
                plain
                type="warning"
                v-hasPermi="['bussiness:user:subAmount']"
                @click="openDialogKey('showDMoneyDialog', scope.row)"
                >人工上下分</el-button
              >
              <el-button
                size="mini"
                plain
                type="warning"
                v-hasPermi="['bussiness:user:updatePwd']"
                @click="resetPwd(scope.row)"
                >重置密码</el-button
              >
              <el-button
                size="mini"
                plain
                type="warning"
                v-hasPermi="['bussiness:user:updatePwd']"
                @click="recharge(scope.row)"
                >充值地址配置</el-button
              >
              <el-button
                size="mini"
                plain
                type="success"
                v-hasPermi="['system:user:selectAllAgentUser']"
                @click="updataAgency(scope.row)"
                >修改上级代理</el-button
              >
              <el-button
                size="mini"
                plain
                type="danger"
                @click="handleDelete(scope.row)"
                v-hasPermi="['bussiness:user:remove']"
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
    <!-- 添加或修改玩家用户对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="后台代理ID" prop="adminParentIds">
          <el-input
            disabled
            v-model="form.adminParentIds"
            placeholder="请输入后台代理ID"
          />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input disabled v-model="form.userId" />
        </el-form-item>
        <el-form-item label="账号" prop="loginName">
          <el-input
            disabled
            v-model="form.loginName"
            placeholder="请输入登录名"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input disabled v-model="form.phone" placeholder="请输入手机号" />
        </el-form-item>

        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入地址" />
        </el-form-item>

        <el-form-item label="地址类型" prop="walletType">
          <el-select v-model="form.walletType" placeholder="请选择地址类型">
            <el-option
              v-for="dict in dict.type.user_address_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="isTest">
          <el-select v-model="form.isTest" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.user_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否冻结" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <!-- <el-form-item label="是否冻结" prop="isFreeze">
          <el-select v-model="form.isFreeze" placeholder="请选择是否冻结">
            <el-option
              v-for="dict in dict.type.user_freeze"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="秒合约打码量" prop="totleAmont">
          <el-input
            v-model="form.totleAmont"
            placeholder="请输入秒合约打码量"
          />
        </el-form-item>
        <el-form-item label="秒合约包赢状态" prop="buff">
          <el-select v-model="form.buff" placeholder="请选择包赢状态">
            <el-option
              v-for="dict in dict.type.user_buff_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="玩家代理" prop="appParentIds">
          <el-input v-model="form.appParentIds" disabled />
        </el-form-item>
        <el-form-item label="邀请码" prop="activeCode">
          <el-input
            disabled
            v-model="form.activeCode"
            placeholder="请输入邀请码"
          />
        </el-form-item>
        <el-form-item label="注册ip" prop="registerIp">
          <el-input
            disabled
            v-model="form.registerIp"
            placeholder="请输入注册ip"
          />
        </el-form-item>
        <el-form-item label="注册域名" prop="host">
          <el-input disabled v-model="form.host" placeholder="请输入注册域名" />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input disabled v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="vip等级 " prop="level">
          <el-input
            disabled
            v-model="form.level"
            placeholder="请输入vip等级 "
          />
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
    <!-- 添加玩家用户 -->
    <el-dialog
      :title="title"
      :visible.sync="addOpen"
      width="800px"
      append-to-body
    >
      <el-form
        ref="addForm"
        :model="addForm"
        :rules="addFormRules"
        label-width="120px"
      >
        <el-form-item label="后台代理ID" prop="adminParentIds">
          <el-select v-model="addForm.adminParentIds">
            <el-option
              v-for="dict in AgentInfoList"
              :key="dict.value"
              :label="dict.nickName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="账号" prop="loginName">
          <el-input v-model="addForm.loginName" placeholder="请输入登录名" />
        </el-form-item>
        <el-form-item label="密码" prop="loginPassword">
          <el-input v-model="addForm.loginPassword" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="地址类型" prop="walletType">
          <el-select v-model="addForm.walletType" placeholder="请选择地址类型">
            <el-option
              v-for="dict in dict.type.user_address_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户类型" prop="isTest">
          <el-select v-model="addForm.isTest" placeholder="请选择状态">
            <el-option
              v-for="dict in dict.type.user_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否冻结" prop="status">
          <el-select v-model="addForm.status" placeholder="请选择是否冻结">
            <el-option
              v-for="dict in dict.type.app_user_status"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="秒合约包赢状态" prop="buff">
          <el-select v-model="addForm.buff" placeholder="请选择包赢状态">
            <el-option
              v-for="dict in dict.type.user_buff_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitAddForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="detailTitle"
      :visible.sync="detailLog"
      width="900px"
      append-to-body
      @close="canced"
    >
      <div class="content-b">
        <div class="c">
          <div class="left">
            <div
              v-for="(item, index) in leftList"
              :class="[item.id == currentTab.id ? 'active' : '']"
              :key="index"
              @click="lookFor(item)"
            >
              {{ item.tittle }}
            </div>
          </div>
          <div class="right">
            <!-- <li>IP所属地: {{ userDetail. }}</li> -->
            <div class="content1" v-if="currentTab.id == 0">
              <ul>
                <li>用户名ID:{{ userDetail.userId }}</li>
                <li>手机号：{{ userDetail.phone }}</li>
                <li>登录名：{{ userDetail.loginName }}</li>
                <li>邮箱：{{ userDetail.email }}</li>
                <li>注册IP：{{ userDetail.registerIp }}</li>
                <li>地址类型：{{ userDetail.walletType }}</li>
                <li>注册域名：{{ userDetail.host }}</li>
                <li>上级ID：{{ userDetail.appParentIds }}</li>
                <li>
                  用户类型：{{
                    userDetail.isTest == 0 ? "正常用户" : "测试用户"
                  }}
                </li>
                <li>冻结状态：{{ userDetail.status ? "冻结" : "正常" }}</li>
                <li>后台代理：{{ userDetail.adminParentIds }}</li>
                <li>地址：{{ userDetail.address }}</li>
              </ul>
            </div>
            <div class="content2" v-if="currentTab.id == 1">
              <SearchFormBox>
                <el-input
                  style="width: 150px; margin-right: 15px"
                  v-model="symbol"
                  clearable
                />
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="serachAsset"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetAsset"
                  >重置</el-button
                >
              </SearchFormBox>
              <el-tabs v-model="navIndex" @tab-click="handleClick">
                <el-tab-pane
                  :label="item.type"
                  :name="item.name"
                  v-for="item in actionList"
                  :key="item.key"
                ></el-tab-pane>
              </el-tabs>
              <el-table
                border
                v-loading="loading"
                :data="assetList"
                @selection-change="handleSelectionChange"
              >
                <el-table-column label="资产" align="center" prop="symbol" />
                <el-table-column
                  label="资产总额"
                  width="150"
                  height="36"
                  align="center"
                  prop="amout"
                />
                <el-table-column
                  label="占用金额"
                  width="150"
                  align="center"
                  prop="occupiedAmount"
                />
                <el-table-column
                  label="可用金额"
                  width="150"
                  align="center"
                  prop="availableAmount"
                />
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="agencyOpen"
      width="600px"
      append-to-body
    >
      <el-form ref="agencyForm" :model="agencyForm" label-width="120px">
        <el-form-item label="后台代理ID" prop="agentUserId">
          <el-select v-model="agencyForm.agentUserId" filterable>
            <el-option
              v-for="dict in AgentInfoList"
              :key="dict.value"
              :label="dict.nickName"
              :value="dict.userId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="saveAgency"
          v-hasPermi="['bussiness:user:updateUserAppIds']"
          >确 定</el-button
        >
        <el-button @click="cancelAgency">取 消</el-button>
      </div>
    </el-dialog>
    <DMoney
      v-model="showDMoneyDialog"
      :user="currentUser"
      @getDataList="getDataList"
    ></DMoney>
    <Winnings
      v-model="showWinningsDialog"
      :user="currentUser"
      @getDataList="getDataList"
    ></Winnings>
    <WLControl v-model="showWLControlDialog" :user="currentUser"></WLControl>
    <RPwd v-model="showPwdDialog" :user="currentUser"> </RPwd>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  setUserBlack,
} from "@/api/bussiness/user";
import { listAsset } from "@/api/bussiness/asset";
import { getAdminUserList, updateUserAppIds } from "@/api/system/user";
import DMoney from "./components/DMoney.vue";
import Winnings from "./components/Winnings.vue";
import WLControl from "./components/WLControl.vue";
import RPwd from "./components/RPwd";

export default {
  name: "User",
  components: {
    DMoney,
    Winnings,
    WLControl,
    RPwd,
  },
  dicts: [
    "user_type", //用户类型
    "app_user_status", //账户是否冻结
    "user_address_type", //地址类型
    "user_buff_type", //包输赢
    "user_asset_type",
  ],
  data() {
    return {
      agencyOpen: false,
      order: "desc",
      // 当前选中
      navIndex: "",
      /**资产类型 */
      actionList: [
        {
          name: "1",
          type: "平台资产",
        },
        {
          name: "2",
          type: "理财资产",
        },
        {
          name: "3",
          type: "合约资产",
        },
      ],
      /**玩家资产 */
      symbol: "",
      userId: "",
      /**用户信息 */
      detailTitle: "",
      userDetail: {},
      assetList: [],
      // 当前的tab
      currentTab: {},
      //详情log
      detailLog: false,
      // 当前操作用户
      currentUser: {},
      // 人工上下分
      showDMoneyDialog: false,
      // 彩金
      showWinningsDialog: false,
      // 控制输赢
      showWLControlDialog: false,
      // 重置密码
      showPwdDialog: false,
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      addOpen: false,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 玩家用户表格数据
      userList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        loginName: null,
        phone: null,
        isTest: null,
        address: null,
        walletType: null,
        status: null,
        buff: null,
        fatherAddr: null,
        appParentIds: null,
        activeCode: null,
        host: null,
        adminParentIds: null,
        email: null,
        level: null,
        remark: null,
        userId: null,
        appParentIds: null,
      },
      // 表单参数
      form: {},
      // 表单参数
      addForm: {},
      agencyForm: {},
      AgentInfoList: [],
      addFormRules: {
        status: [
          { required: true, message: "是否冻结不能为空", trigger: "change" },
        ],
        walletType: [
          { required: true, message: "地址类型不能为空", trigger: "change" },
        ],
        isTest: [
          { required: true, message: "用户类型不能为空", trigger: "change" },
        ],
        buff: [
          {
            required: true,
            message: "秒合约包赢状态不能为空",
            trigger: "change",
          },
        ],
        loginPassword: [
          {
            required: true,
            message: "登陆密码不能为空",
            trigger: "blur",
          },
        ],
        loginName: [
          {
            required: true,
            message: "用户名不能为空",
            trigger: "blur",
          },
        ],
      },
      // 表单校验
      rules: {
        status: [
          { required: true, message: "是否冻结不能为空", trigger: "change" },
        ],
        activeCode: [
          { required: true, message: "邀请码不能为空", trigger: "blur" },
        ],
      },
      // 列信息
      columns: [
        { key: 0, label: `用户ID`, visible: true },
        { key: 1, label: `用户类型`, visible: true },
        { key: 2, label: `登录名`, visible: true },
        { key: 3, label: `备注`, visible: true },
        { key: 4, label: `邮箱`, visible: true },
        { key: 5, label: `地址`, visible: true },
        { key: 6, label: `地址类型`, visible: true },
        { key: 7, label: `是否冻结`, visible: true },
        { key: 8, label: `玩家代理`, visible: true },
        { key: 9, label: `玩家代理用户名`, visible: true },
        { key: 10, label: `后台代理`, visible: true },
        { key: 11, label: `后台代理用户名`, visible: true },
        { key: 12, label: `注册IP`, visible: true },
        { key: 13, label: `注册域名`, visible: true },
        { key: 14, label: `手机号`, visible: true },
        { key: 15, label: `注册时间`, visible: true },
      ],
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {
    leftList() {
      let tempList = [
        { id: 0, tittle: "用户详情" },
        { id: 1, tittle: "资产详情" },
      ];
      return tempList;
    },
  },
  methods: {
    setBlack(row) {
      let params = {
        userId: row.userId,
        isBlack: row.isBlack == 2 ? 1 : 2,
      };
      setUserBlack(params).then((res) => {
        if (res.code == "200") {
          this.$modal.msgSuccess("设置成功");
          this.getList();
        }
      });
    },
    getDataList() {
      this.getList();
    },
    /** 复制代码成功 */
    clipboardSuccess() {
      this.$modal.msgSuccess("复制成功");
    },
    sortTableFun(column) {
      this.column = column.prop;
      if (column.prop) {
        if (column.order == "ascending") {
          this.order = "asc";
        } else if (column.order == "descending") {
          this.order = "desc";
        }
        this.indexQueryListFun();
        // this.getList();
      }
    },

    indexQueryListFun() {
      //发起后端请求的接口
      this.queryParams["orderByColumn"] = "createTime";
      this.queryParams["isAsc"] = this.order;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    updataAgency(row) {
      this.agencyOpen = true;
      this.agencyForm.appUserId = row.userId;
      this.getAgencyList();
    },
    recharge(row) {
      this.$router.push(`/bussiness/userRecharge?userId=${row.userId}`);
    },
    /**保存代理 */
    saveAgency() {
      this.$refs["agencyForm"].validate((valid) => {
        if (valid) {
          updateUserAppIds(this.agencyForm).then((response) => {
            this.$modal.msgSuccess("修改成功");
            this.agencyOpen = false;
            this.getList();
          });
        }
      });
    },
    /**资产点击事件 */
    handleClick(e) {
      this.navIndex = e.name;
      this.getUserAsset();
    },
    canced() {
      this.detailLog = false;
    },
    /**重置密码设置 */
    resetPwd(user) {
      this.currentUser = user;
      this.showPwdDialog = true;
    },
    /**玩家用户输赢设置 */
    winorLose(user) {
      this.currentUser = user;
      this.showWLControlDialog = true;
    },
    /**搜索玩家资产 */
    serachAsset() {
      listAsset({ symbol: this.symbol }).then((res) => {
        this.assetList = res.rows;
      });
    },
    /**重置玩家资产 */
    resetAsset() {
      this.symbol = "";
      this.getUserAsset();
    },
    /**玩家用户详情 */
    getDetail(row) {
      this.detailLog = true;
      this.detailTitle = "用户信息";
      this.userId = row.userId;
      this.lookFor(this.leftList[0]);
    },
    lookFor(item) {
      this.currentTab = item;
      if (item.id == 0) {
        this.getUserDetail();
      } else if (item.id == 1) {
        this.handleClick(this.actionList[0]);
      }
    },
    getUserDetail() {
      listUser({ userId: this.userId }).then((res) => {
        this.userDetail = res.rows[0];
      });
    },
    getUserAsset() {
      listAsset({ userId: this.userId, type: this.navIndex }).then((res) => {
        this.assetList = res.rows;
      });
    },

    /**
     * 打开弹窗
     */
    openDialogKey(key, user) {
      this.currentUser = user;
      console.log(user);
      this[key] = true;
    },
    /** 查询玩家用户列表 */
    getList() {
      this.loading = true;
      this.queryParams["orderByColumn"] = "createTime";
      this.queryParams["isAsc"] = this.order;
      listUser(this.queryParams).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.addOpen = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: null,
        loginName: null,
        loginPassword: null,
        phone: null,
        isTest: null,
        salt: null,
        address: null,
        walletType: null,
        status: null,
        totleAmont: null,
        buff: null,
        tree: null,
        fatherAddr: null,
        appParentIds: null,
        activeCode: null,
        registerIp: null,
        host: null,

        email: null,
        level: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null,
        remark: null,
        searchValue: null,
        appParentIds: null,
        adminParentIds: null,
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
      this.ids = selection.map((item) => item.userId);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.addForm = {
        loginName: null,
        loginPassword: null,
        isTest: null,
        walletType: null,
        status: null,
        adminParentIds: null,
        buff: null,
      };
      this.getAgencyList();
      this.addOpen = true;
      this.title = "添加玩家用户";
    },
    /**查询上级代理 */
    getAgencyList() {
      getAdminUserList().then((res) => {
        this.AgentInfoList = res.rows;
      });
    },
    cancelAgency() {
      this.agencyOpen = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const userId = row.userId || this.ids;
      getUser(userId).then((response) => {
        this.form = response.data.user;
        this.open = true;
        this.title = "修改玩家用户";
      });
    },
    submitAddForm() {
      this.$refs["addForm"].validate((valid) => {
        if (valid) {
          addUser(this.addForm).then((response) => {
            this.$modal.msgSuccess("新增成功");
            this.addOpen = false;
            this.getList();
          });
        }
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != null) {
            updateUser(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
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
        .confirm('是否确认删除玩家用户编号为"' + userIds + '"的数据项？')
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
        "bussiness/user/export",
        {
          ...this.queryParams,
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
  },
};
</script>

<style scoped lang="scss">
ul li {
  list-style: none;
}
.content-b {
  min-height: 600px;
  width: 100%;
  display: flex;
  justify-content: center;
  border: 1px solid #ececec;
  .c {
    min-height: 500px;
    width: 100%;
    display: flex;
    justify-content: flex-start;
    border-left: 1px solid #ececec;
    border-right: 1px solid #ececec;
    .left {
      border-right: 1px solid #ececec;
      min-width: 160px;
      div {
        font-size: 14px;
        color: #1e2329;
        padding: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-bottom: 1px solid #ececec;
      }
      div:hover {
        cursor: pointer;
        background: #1890ff;
        color: #fff;
      }
      .active {
        background: #1890ff;
        color: #fff;
      }
    }
    .right {
      width: 100%;
      display: flex;
      justify-content: center;
      padding: 30px;
      .content1 {
        width: 100%;
        ul {
          width: 100%;
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          li {
            width: 50%;
            margin-bottom: 35px;
          }
        }
      }
    }
  }
}
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
</style>
