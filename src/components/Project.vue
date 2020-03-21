<template>
  <el-container style="height: 500px; border: 1px solid #eee">
    <el-header>项目名称</el-header>
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
              <el-menu-item index="/project/info">选项1</el-menu-item>
              <el-menu-item index="/project/two">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="成员信息">
              <el-menu-item index="1-3">选项3</el-menu-item>
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

    <el-footer>footer</el-footer>
  </el-container>
</template>

<script>
export default {
  // data() {
  //   const item = {
  //     date: "2016-05-02",
  //     name: "王小虎",
  //     address: "上海市普陀区金沙江路 1518 弄"
  //   };
  //   return {
  //     tableData: Array(10).fill(item)
  //   };
  // },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
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

.el-aside {
  color: #333;
}
</style>
