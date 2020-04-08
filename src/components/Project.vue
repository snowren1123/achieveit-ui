<template>
  <el-container>
    <el-header>
      <div>
        <span>{{ projectName }}</span>
      </div>
      <el-button type="danger" icon="el-icon-sunny" class="right-set" @click="backToHome" circle></el-button>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
          unique-opened
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-message"></i>项目信息
            </template>
            <el-menu-item-group>
              <template slot="title">Basic</template>
              <el-menu-item index="/project/basic">
                <i class="el-icon-info"></i>属性信息
              </el-menu-item>
              <el-menu-item index="/project/client">
                <i class="el-icon-s-custom"></i>客户信息
              </el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="Members">
              <el-menu-item index="/project/team">
                <i class="el-icon-user"></i>成员管理
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-brush"></i>项目操作
            </template>
            <el-menu-item-group title="To be solved">
              <el-menu-item index="/project/riskmanagement">
                <i class="el-icon-warning-outline"></i>风险管理
              </el-menu-item>
              <el-submenu index="3-5">
                <template slot="title">
                  <i class="el-icon-data-analysis"></i>评审缺陷
                </template>
                <el-menu-item index="/project/reviewlist">
                  <i class="el-icon-toilet-paper"></i>评缺查看
                </el-menu-item>
              </el-submenu>
            </el-menu-item-group>
            <el-menu-item-group title="Devices">
              <el-menu-item index="/project/projectdevice">
                <template slot="title">
                  <i class="el-icon-printer"></i>设备管理
                </template>
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

export default {
  data() {
    return {
      projectName: ""
    };
  },

  created() {
    this.getProjectName();
    // if (!this.detailInfo.projectId) this.detailInfo.projectId = this.$route.query.id;
    // console.log(this.detailInfo.projectId);
  },

  computed: {
    ...mapState(["projectBasicId"])
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    backToHome() {
      this.$router.push("/home");
    },
    getProjectName() {
      axios.get("/api/project_info/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          this.projectName = response.data.data.projectName;
        }
      });
    }
  }
};
</script>

<style scoped>
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
