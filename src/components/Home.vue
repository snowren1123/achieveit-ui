<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>软件项目管理系统</span>
      </div>
      <el-button icon="el-icon-plus" class="right-set" @click="addProject" circle></el-button>
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
          <!-- 关键字搜索区域 -->
          <el-row>
            <el-col :span="8">
              <el-input placeholder="请输入内容" v-model="keyWord" clearable @clear="getProjectsList">
                <el-button slot="append" icon="el-icon-search" @click="getListByKeyWord"></el-button>
              </el-input>
            </el-col>
          </el-row>

          <!-- 项目列表区域 -->
          <el-table
            :data="projectsList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
            border
            stripe
          >
            <el-table-column label="项目列表">
              <template slot-scope="scope">
                <el-tag type="success" v-if="scope.row.state === '申请立项'">{{scope.row.state}}</el-tag>
                <el-tag type="danger" v-else-if="scope.row.state === '驳回立项'">{{scope.row.state}}</el-tag>
                <el-tag v-else>{{scope.row.state}}</el-tag>
                <el-row>项目名称：{{scope.row.projectName}}</el-row>
                <el-row>项目周期：{{scope.row.expStartDate.slice(0,10)}} 至 {{scope.row.expEndDate.slice(0,10)}}</el-row>
                <el-row>
                  <el-col>业务领域：{{scope.row.businessDomain}}</el-col>
                </el-row>
                <el-row>
                  <el-col>主要功能：{{scope.row.mainFunctions}}</el-col>
                </el-row>
                <el-row>
                  <el-col>采用技术：{{scope.row.technology}}</el-col>
                </el-row>
                <el-tooltip class="item" effect="dark" content="项目详情" placement="top">
                  <el-button
                    type="info"
                    icon="el-icon-more"
                    class="to-detail"
                    @click="toProjectDetail(scope.row.projectId)"
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

      <!-- 新建项目对话框 -->
      <el-dialog title="新建项目" :visible.sync="addDialogFormVisible" @close="addDialogClosed">
        <el-form
          :model="projectInfo"
          label-width="100px"
          label-position="left"
          :rules="addDialogFormRules"
          ref="addDialogFormRef"
        >
          <el-form-item label="项目ID" prop="projectId">
            <el-select v-model="projectInfo.projectId" clearable placeholder="请选择项目ID">
              <el-option v-for="item in projectsIds" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称" prop="projectName">
            <el-input v-model="projectInfo.projectName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="客户ID" prop="clientId">
            <el-select v-model="projectInfo.clientId" clearable placeholder="请选择客户ID">
              <el-option v-for="item in clientIds" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目周期" required>
            <el-col :span="11">
              <el-form-item prop="expStartDate">
                <el-date-picker
                  type="date"
                  placeholder="预定日期"
                  v-model="projectInfo.expStartDate"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col class="line" :span="1" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-form-item prop="expEndDate">
                <el-date-picker
                  type="date"
                  placeholder="交付日"
                  v-model="projectInfo.expEndDate"
                  style="width: 100%;"
                ></el-date-picker>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item label="采用技术">
            <el-input
              type="textarea"
              v-model="projectInfo.technology"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务领域">
            <el-input
              type="textarea"
              v-model="projectInfo.businessDomain"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="主要功能">
            <el-input
              type="textarea"
              v-model="projectInfo.mainFunctions"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm()">确认</el-button>
          <el-button @click="addDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

//axios.defaults.baseURL = process.env.BASE_API;

export default {
  data() {
    return {
      personInfo: {},
      projectsList: [],
      projectInfo: {
        projectId: "",
        projectName: "",
        clientId: "",
        expStartDate: "",
        expEndDate: "",
        technology: "",
        businessDomain: "",
        mainFunctions: ""
      },
      addDialogFormVisible: false,
      addDialogFormRules: {
        projectId: [
          { required: true, message: "请选择项目ID", trigger: "change" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        clientId: [
          { required: true, message: "请选择客户ID", trigger: "change" }
        ],
        expStartDate: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        expEndDate: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ]
      },
      projectsIds: [],
      clientIds: [],
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
    submitForm() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        var proInfo = this.deepClone(this.projectInfo);
        proInfo.expStartDate = this.dateFormat(proInfo.expStartDate);
        proInfo.expEndDate = this.dateFormat(proInfo.expEndDate);

        axios.post("/api/newproject", qs.stringify(proInfo)).then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getProjectsList();
            this.$message.success("新建项目成功！");
          } else {
            this.$message.error("新建项目失败！");
          }
        });
        this.addDialogFormVisible = false;
      });
    },
    toProjectDetail(id) {
      this.$router.push("/project");
      this.$store.commit("setProjectBasicId", id);
    },
    getProjectsList() {
      axios.get("/api/project_infos").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.projectsList = response.data.data;
          this.total = this.projectsList.length;
        } else {
          this.$message.error("获取项目列表失败！");
        }
      });
    },
    getListByKeyWord() {
      if (this.keyWord === "") return;
      axios
        .get("/api/project_infos/key_word/" + this.keyWord)
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.projectsList = response.data.data;
            this.total = this.projectsList.length;
          } else {
            this.$message.error("查询失败！");
          }
        });
    },
    addProject() {
      axios.get("/api/newproject/ids").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.projectsIds = response.data.data.ids;
        } else {
          this.$message.error("获取可选项目ID失败！");
        }
      });
      axios.get("/api/client/ids").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.clientIds = response.data.data.clientIds;
        } else {
          this.$message.error("获取可选客户ID失败！");
        }
      });
      this.addDialogFormVisible = true;
    },
    addDialogClosed: function() {
      this.$refs.addDialogFormRef.resetFields();
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    dateFormat: function(originVal) {
      const dt = new Date(originVal);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      return `${y}-${m}-${d}`;
    },
    deepClone: function(data) {
      var obj = {};

      for (var key in data) {
        obj[key] = data[key];
      }

      return obj;
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
  margin: 15px 0;
}

.el-table-column {
  position: relative;
}

.el-tag {
  position: absolute;
  right: 10px;
}

.to-detail {
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
