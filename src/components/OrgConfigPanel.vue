<template>
  <el-container>
    <el-header>
      <div>
        <span>组织级配置管理员操作面板</span>
      </div>
      <el-button
        type="primary"
        icon="el-icon-switch-button"
        class="right-set"
        @click="backToLogin"
        circle
      ></el-button>
    </el-header>

    <el-container>
      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu
          :default-openeds="['/orgconfig/gitset', '3']"
          :default-active="this.$route.path"
          @open="handleOpen"
          @close="handleClose"
          router
        >
          <el-menu-item-group>
            <el-menu-item index="/orgconfig/gitset">
              <i class="el-icon-upload"></i>建立git库
            </el-menu-item>
            <el-menu-item index>
              <i class="el-icon-s-tools"></i>设置归档
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

<style>
.el-header {
  background-color: #cde6c7;
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
  background-color: #f69c9f;
  border-color: transparent;
  position: absolute;
  right: 2%;
  top: 10px;
}

.el-table-column {
  position: relative;
}

.el-dialog__body {
    padding-left: 1%;
}

.el-form-item__label {
  text-align: center;
  padding-right: 0 !important;
}

.el-form-item__content {
  margin-left: 95px!important;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>