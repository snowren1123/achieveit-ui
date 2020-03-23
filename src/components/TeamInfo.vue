<template>
  <el-main>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="always">
          <div slot="header" class="clearfix">
            <span>项目经理</span>
          </div>
          <div class="text">
            <p>
              <b>姓名：</b>
              <span>{{personInfo.name}}</span>
            </p>
            <p>
              <b>邮箱：</b>
              <span>{{personInfo.email}}</span>
            </p>
            <p>
              <b>手机号：</b>
              <span>{{personInfo.mobile}}</span>
            </p>
            <p>
              <b>地址：</b>
              <span>{{personInfo.address}}</span>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>开发人员</span>
          </div>
          <div class="text">
            <p>
              <b>姓名：</b>
              <span>{{personInfo.name}}</span>
            </p>
            <p>
              <b>邮箱：</b>
              <span>{{personInfo.email}}</span>
            </p>
            <p>
              <b>手机号：</b>
              <span>{{personInfo.mobile}}</span>
            </p>
            <p>
              <b>地址：</b>
              <span>{{personInfo.address}}</span>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>测试人员</span>
          </div>
          <div class="text">
            <p>
              <b>姓名：</b>
              <span>{{personInfo.name}}</span>
            </p>
            <p>
              <b>邮箱：</b>
              <span>{{personInfo.email}}</span>
            </p>
            <p>
              <b>手机号：</b>
              <span>{{personInfo.mobile}}</span>
            </p>
            <p>
              <b>地址：</b>
              <span>{{personInfo.address}}</span>
            </p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      personInfo: {
        name: "ocean",
        email: "18912341312@qq.com",
        mobile: "18918918189",
        address: "ecnu"
      }
    };
  }
};
</script>

<style>
.el-card__body {
    padding-top: 10px;
}
.el-row {
  margin-bottom: 20px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
</style>