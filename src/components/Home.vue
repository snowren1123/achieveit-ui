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
      <el-aside width="200px"></el-aside>
      <!-- 内容主体区域 -->
      <el-main>
        <el-card shadow="always">
          <el-table :data="projectsList" border stripe>
            <el-table-column></el-table-column>
          </el-table>
        </el-card>
        <el-button type="info" icon="el-icon-message" @click="hreftoInfo()" circle></el-button>
      </el-main>

      <!-- 新建项目对话框 -->
      <el-dialog title="新建项目" :visible.sync="addDialogFormVisible">
        <el-form :model="projectInfo" label-width="100px" label-position="left">
          <el-form-item label="项目ID">
            <el-select v-model="projectInfo.id" clearable placeholder="请选择项目ID">
              <el-option v-for="item in projectsIds" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="projectInfo.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目周期">
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="预定日期"
                v-model="projectInfo.date1"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="1">&nbsp-</el-col>
            <el-col :span="11">
              <el-date-picker
                type="date"
                placeholder="交付日"
                v-model="projectInfo.date2"
                style="width: 100%;"
              ></el-date-picker>
            </el-col>
          </el-form-item>
          <el-form-item label="项目上级">
            <el-input v-model="projectInfo.boss" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="主要里程碑">
            <el-input
              type="textarea"
              v-model="projectInfo.sign"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="采用技术">
            <el-input
              type="textarea"
              v-model="projectInfo.tech"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="业务领域">
            <el-select v-model="projectInfo.region" placeholder="请选择业务领域">
              <el-option label="领域一" value="1"></el-option>
              <el-option label="领域二" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="主要功能">
            <el-input
              type="textarea"
              v-model="projectInfo.func"
              autocomplete="off"
              style="width:400px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm()">确认新建</el-button>
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
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
      addDialogFormVisible: false,
      projectsList: [],
      projectInfo: {
        id: "",
        name: "",
        region: "",
        boss: "",
        sign: "",
        tech: "",
        func: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: ""
      },
      projectsIds: []
    };
  },
  created() {
    this.getProjectsList();
  },
  methods: {
    submitForm() {
      this.addDialogFormVisible = false;
    },
    hreftoInfo() {
      this.$router.push("/project");
    },
    getProjectsList() {},
    addProject() {
      axios.get("/api/newproject/ids").then(response => {
        if (response.data.code === 0) {
          console.log(response.data);
          this.projectsIds = response.data.data.ids;
        } else {
          this.$message.error("获取可选项目ID失败！");
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
  border-right: solid 1px #e6e6e6;
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
</style>
