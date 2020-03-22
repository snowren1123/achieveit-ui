<template>
  <el-container>
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>软件项目管理系统</span>
      </div>
      <el-button type="primary" icon="el-icon-plus" class="right-set" @click="addProject" circle></el-button>
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

        <p>邮箱：{{personInfo.email}}</p>
        <p>单位：{{personInfo.company}}</p>
        <p>手机号：{{personInfo.mobile}}</p>
        <p>地址：{{personInfo.address}}</p>
      </el-aside>

      <!-- 内容主体区域 -->
      <el-main>
        <el-card shadow="always">
          <el-table :data="projectsList" border stripe>
            <el-table-column label="项目列表">
              <template slot-scope="scope">
                <el-row :gutter="20">
                  <el-col :span="1"></el-col>
                  <el-col :span="12">项目名称：{{scope.row.projectName}}</el-col>
                  <el-col :span="12">项目周期：{{scope.row.expStartDate}} 至 {{scope.row.expEndDate}}</el-col>
                  <el-col :span="1"></el-col>
                </el-row>
                <el-row>
                  <el-col>采用技术：{{scope.row.technology}}</el-col>
                </el-row>
                <el-row>
                  <el-col>业务领域：{{scope.row.businessDomain}}</el-col>
                </el-row>
                <el-row>
                  <el-col>主要功能：{{scope.row.mainFunctions}}</el-col>
                </el-row>
                <el-button
                  type="info"
                  icon="el-icon-message"
                  class="to-detail"
                  @click="toProjectDetail(scope.row.projectId)"
                  circle
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>

      <!-- 新建项目对话框 -->
      <el-dialog title="新建项目" :visible.sync="addDialogFormVisible">
        <el-form
          :model="projectInfo"
          label-width="100px"
          label-position="left"
          :rules="addDialogFormRules"
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
          <el-form-item label="项目周期" prop="Date">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="预定日期"
                v-model="projectInfo.expStartDate"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="1" style="text-align:center">-</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="交付日"
                v-model="projectInfo.expEndDate"
                style="width: 100%;"
              ></el-date-picker>
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

export default {
  data() {
    return {
      personInfo: {
        email: "onetwe@163.com",
        company: "华东师范大学",
        mobile: "18918003231",
        address: "上海市普陀区金沙江路"
      },
      projectsList: [
        {
          projectId: "2020-a5df-D-01",
          projectName: "智趣识图",
          clientId: "pwc_001",
          expStartDate: "2020-03-25",
          expEndDate: "2020-05-13",
          technology:
            "包括编程语言，开发平台（OS+DB ），服务架构 Framework ，使用的工具等",
          businessDomain: "项目涉及的业务领域",
          mainFunctions: "项目完成的主要业务功能"
        },
        {
          projectId: "2020-a5df-D-01",
          projectName: "智趣识图",
          clientId: "pwc_001",
          expStartDate: "2020-03-25",
          expEndDate: "2020-05-13",
          technology:
            "包括编程语言，开发平台（OS+DB ），服务架构 Framework ，使用的工具等",
          businessDomain: "项目涉及的业务领域",
          mainFunctions: "项目完成的主要业务功能"
        }
      ],
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
          { required: true, message: "请选择项目ID", trigger: "blur" }
        ],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" }
        ],
        clientId: [{ required: true, message: "请选择客户ID", trigger: "blur" }]
      },
      projectsIds: [],
      clientIds: []
    };
  },
  created() {
    this.getProjectsList();
  },
  methods: {
    submitForm() {
      this.addDialogFormVisible = false;
    },
    toProjectDetail(id) {
      this.$router.push({ path: "/project", query: { id: id } });
    },
    getProjectsList() {},
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

.el-table-column {
  position: relative;
}

.to-detail {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>
