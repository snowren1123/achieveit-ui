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
        <el-menu
          :default-openeds="['1','2']"
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-folder"></i>项目列表
            </template>
            <el-menu-item-group>
              <template slot="title">基本分类</template>
              <el-menu-item index="/home/projectlist">
                <i class="el-icon-message"></i>我的项目
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-date"></i>工时管理
            </template>
            <el-menu-item-group>
              <template slot="title">查看工时</template>
              <el-menu-item index="/home/basictimesheet">
                <i class="el-icon-timer"></i>我的工时
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group>
              <template slot="title">相关操作</template>
              <el-menu-item index="/home/checktimesheet">
                <i class="el-icon-finished"></i>工时审批
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <router-view></router-view>
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
      personInfo: {}
    };
  },
  created() {
    this.getUserInfo();
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
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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
</style>
