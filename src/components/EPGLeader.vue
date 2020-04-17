<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <el-row type="flex" justify="space-between">
        <el-col :span="8">
          <div>
            <img src="../assets/logo.png" />
            <span>软件项目管理系统</span>
          </div>
        </el-col>
        <el-col :span="3">欢迎您，{{personInfo.employeeName}}</el-col>
      </el-row>
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
                    type="success"
                    icon="el-icon-user-solid"
                    class="add-epg"
                    @click="addEPG(scope.row.taskId)"
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
            :page-sizes="[3, 6, 9, 12]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-card>
      </el-main>

      <!-- 分配epg对话框 -->
      <el-dialog title="分配epg" :visible.sync="addEPGVisible" @close="addEPGDialogClosed">
        <el-form
          :model="addEPGForm"
          label-width="100px"
          label-position="left"
          ref="addEPGDialogFormRef"
        >
          <el-form-item label="可选epg" prop="ids">
            <el-select v-model="addEPGForm.ids" multiple clearable placeholder="请选择">
              <el-option
                v-for="item in members"
                :key="item.employeeId"
                :label="item.employeeName"
                :value="item.employeeId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm()">确认</el-button>
          <el-button @click="addEPGVisible = false">取消</el-button>
        </div>
      </el-dialog>
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
      pageSize: 3,
      total: 0,
      keyWord: "",
      addEPGVisible: false,
      addEPGForm: { taskId: "", role: "EPG", ids: [] },
      members: []
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
    addEPGDialogClosed: function() {
      this.$refs.addEPGDialogFormRef.resetFields();
    },
    addEPG(taskId) {
      this.addEPGForm.taskId = taskId;
      axios.get("/api/employees/epg").then(response => {
        if (response.data.code === 0) {
          this.members = response.data.data;
        } else {
          this.$message.error("获取可选epg失败！");
        }
      });
      this.addEPGVisible = true;
    },
    submitForm() {
      console.log(this.addEPGForm.ids);
      axios
        .put(
          "/api/newproject/member",
          qs.stringify(this.addEPGForm, { indices: false })
        )
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.$message.success("已成功分配epg");
            this.getProjectsList();
          } else {
            this.$message.error("分配epg失败！");
          }
        });
      this.addEPGVisible = false;
    }
  }
};
</script>

<style scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #b3c0d1;
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

.el-dialog__body {
  padding: 0 10px !important;
}

.el-form-item__content {
  margin-left: 30px !important;
}

.el-form-item__label {
  padding: 0;
}

.el-table {
  margin-bottom: 15px;
}

.el-table-column {
  position: relative;
}

.add-epg {
  position: absolute;
  right: 15px;
  top: 70%;
  transform: translateY(-50%);
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>
