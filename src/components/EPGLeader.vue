<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>软件项目管理系统</span>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <div class="demo-basic--circle">
          <div class="block">
            <el-avatar
              shape="square"
              :size="60"
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            ></el-avatar>
          </div>
        </div>

        <p>昵称：{{personInfo.employeeName}}</p>
        <p>职位：{{personInfo.title}}</p>
        <p>部门：{{personInfo.department}}</p>
        <p>手机号：{{personInfo.telephone}}</p>
        <p>邮箱：{{personInfo.email}}</p>
      </el-aside>

      <!-- 内容主体区域 -->
      <el-main>
        <el-card shadow="always">
          <!-- 项目列表区域 -->
          <el-table
            :data="projectsList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            stripe
          >
            <el-table-column label="项目列表">
              <template slot-scope="scope">
                <el-tag
                  type="success"
                  v-if="scope.row.projectBasicInfo.state === '申请立项'"
                >{{scope.row.projectBasicInfo.state}}</el-tag>
                <el-tag
                  type="danger"
                  v-else-if="scope.row.projectBasicInfo.state === '驳回立项'"
                >{{scope.row.projectBasicInfo.state}}</el-tag>
                <el-tag v-else>{{scope.row.projectBasicInfo.state}}</el-tag>
                <el-row>项目名称：{{scope.row.projectBasicInfo.projectName}}</el-row>
                <el-row>项目周期：{{scope.row.projectBasicInfo.expStartDate.slice(0,10)}} 至 {{scope.row.projectBasicInfo.expEndDate.slice(0,10)}}</el-row>
                <el-row>
                  <el-col>业务领域：{{scope.row.projectBasicInfo.businessDomain}}</el-col>
                </el-row>
                <el-row>
                  <el-col>主要功能：{{scope.row.projectBasicInfo.mainFunctions}}</el-col>
                </el-row>
                <el-row>
                  <el-col>采用技术：{{scope.row.projectBasicInfo.technology}}</el-col>
                </el-row>
                <el-tooltip class="item" effect="dark" content="分配epg" placement="top">
                  <el-button
                    type="warning"
                    icon="el-icon-user-solid"
                    class="add-epg"
                    @click="addEPG"
                    circle
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页区域 -->
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[2, 4, 6, 10]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-card>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      personInfo: {},
      projectsList: [],
      currentPage: 1,
      pageSize: 2,
      total: 0,
      keyWord: ""
    };
  },
  created() {
    this.getUserInfo();
    this.getProjectsList();
  },
  computed: {
    ...mapState(["personId"])
  },
  methods: {
    getUserInfo() {
      axios.get("/api/employee/" + this.personId).then(response => {
        if (response.data.code === 0) {
          this.personInfo = response.data.data;
        } else {
          this.$message.error("获取用户信息失败！");
        }
      });
    },
    getProjectsList() {
      axios.get("/api/newproject").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.projectsList = response.data.data;
          this.total = this.projectsList.length;
        } else {
          this.$message.error("获取项目列表失败！");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    addEPG() {}
  }
};
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header div img {
  width: 60px;
}

.el-aside {
  text-align: center;
  border-right: solid 1px #e6e6e6;
}

.el-avatar {
  margin: 50px 0;
}

.right-set {
  position: absolute;
  right: 2%;
  top: 10px;
}

.ml-set {
  margin-left: 20px;
}

.el-form-item__content {
  margin-left: 30px !important;
}

.el-form-item__label {
  padding: 0;
}

.el-table {
  margin: 15px 0;
}

.el-table-column {
  position: relative;
}

.el-tag {
  position: absolute;
  right: 10px;
}

.add-epg {
  background-color: #909399;
  position: absolute;
  right: 15px;
  top: 70%;
  transform: translateY(-50%);
}

p {
  font-size: 13px;
  line-height: 1.7;
}

.el-card {
  padding-top: 10px;
}
</style>
