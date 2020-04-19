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
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
          unique-opened
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
          </el-submenu>
          <el-submenu
            index="3"
            v-show="(personTitle.indexOf('测试') != -1) || (personTitle.indexOf('开发') != -1)"
          >
            <template slot="title">
              <i class="el-icon-data-analysis"></i>评审缺陷
            </template>
            <el-menu-item-group>
              <template slot="title">查看评缺</template>
              <el-menu-item v-show="personTitle.indexOf('测试') != -1" index="/home/myreportreview">
                <i class="el-icon-mic"></i>我的报告
              </el-menu-item>
              <el-menu-item v-show="personTitle.indexOf('开发') != -1" index="/home/myprocessreview">
                <i class="el-icon-coordinate"></i>我的处理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-printer"></i>设备管理
            </template>
            <el-menu-item-group>
              <template slot="title">基本分类</template>
              <el-menu-item index="/home/mydevice">
                <i class="el-icon-camera"></i>我的设备
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-warning-outline"></i>风险信息
            </template>
            <el-menu-item-group>
              <template slot="title">查看风险</template>
              <el-menu-item index="/home/riskrelated">
                <i class="el-icon-star-off"></i>与我相关
              </el-menu-item>
              <el-menu-item index="/home/riskown">
                <i class="el-icon-bell"></i>担责风险
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
      personInfo: {},
      personTitle: ""
    };
  },
  created() {
    this.getUserInfo();
    this.getTimeSheetList();
  },
  computed: {
    ...mapState(["personId"]),
    checkTimeSheetTotal: {
      //需要监听的数据
      get() {
        return this.$store.state.checkTimeSheetTotal;
      },
      set(val) {}
    }
  },
  watch: {
    checkTimeSheetTotal(newVal, oldVal) {}
  },
  methods: {
    getTimeSheetList() {
      axios.get("/api/timesheet/boss").then(response => {
        if (response.data.code === 0) {
          this.$store.commit(
            "setCheckTimeSheetTotal",
            response.data.data.length
          );
        }
      });
    },
    getUserInfo() {
      axios.get("/api/employee/" + this.personId).then(response => {
        if (response.data.code === 0) {
          this.personInfo = response.data.data;
          console.log("personInfo");
          console.log(this.personInfo);
          this.personTitle = this.personInfo.title;
          this.$store.commit("setUserTitle", this.personInfo.title);
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

.item {
  margin-right: 40px;
}
</style>
