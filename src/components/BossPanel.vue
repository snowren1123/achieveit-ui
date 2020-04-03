<template>
  <el-container>
    <el-header>
      <div>
        <span>项目上级操作面板</span>
      </div>
      <el-button type="danger" icon="el-icon-cherry" class="right-set" @click="backToLogin" circle></el-button>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['/boss/pending', '3']"
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
        >
          <el-menu-item-group>
            <el-menu-item index="/boss/pending">
              <i class="el-icon-circle-check"></i>审核项目
            </el-menu-item>
            <el-menu-item index>
              <i class="el-icon-edit"></i>审核工时
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </el-aside>
      <router-view></router-view>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    backToLogin() {
      this.$router.push("/login");
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