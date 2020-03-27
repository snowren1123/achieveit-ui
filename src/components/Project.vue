<template>
  <el-container>
    <el-header>
      <div>
        <span>{{ detailInfo.projectName }}</span>
      </div>
      <el-button type="danger" icon="el-icon-sunny" class="right-set" @click="backToHome" circle></el-button>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['1', '3']"
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>项目信息
            </template>
            <el-menu-item-group>
              <template slot="title">基本信息</template>
              <el-menu-item index="/project/basic">属性信息</el-menu-item>
              <el-menu-item index="/project/client">客户信息</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="项目组成员">
              <el-menu-item index="/project/team">成员信息</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-menu"></i>待填充
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-setting"></i>项目操作
            </template>
            <el-menu-item-group>
              <template slot="title">分组1</template>
              <el-menu-item index="3-1">申请归档</el-menu-item>
              <el-menu-item index="3-2">工时填写</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">风险管理</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template slot="title">设备管理</template>
              <el-menu-item index="3-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>

      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
import axios from "axios"
import qs from "qs"

export default {
  data() {
    return {
      detailInfo: {
        projectId: "",
        projectName: "",
        clientId: "",
        expStartDate: "",
        expEndDate: "",
        technology: "",
        businessDomain: "",
        mainFunctions: ""
      }
    };
  },
  created() {
    this.getDetailInfo();
    // if (!this.detailInfo.projectId) this.detailInfo.projectId = this.$route.query.id;
    // console.log(this.detailInfo.projectId);
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    backToHome(){
      this.$router.push('/home');
    },
    getDetailInfo(){
      axios.get("/api/project_info/2020-a5df-D-01").then(response => {
        if(response.data.code === 0){
          console.log("success");
          // this.$data.detailInfo = response.data.data;
        }
    });
    }
  }
};
</script>

<style>
.el-header {
  background-color: #b3c0d1;
  color: #333;
  line-height: 60px;
}

.el-container {
  height: 100%;
}

.el-header div {
  display: flex;
  align-items: center;
}

.right-set {
  position: absolute;
  right: 2%;
  top: 10px;
}

.el-table-column {
  position: relative;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>
