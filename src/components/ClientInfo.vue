<template>
  <el-main>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card shadow="hover">
          <div slot="header" class="clearfix">
            <span>客户</span>
          </div>
          <div class="text">
            <p>
              <b>姓名：</b>
              <span>{{clientInfo.name}}</span>
            </p>
            <p>
              <b>邮箱：</b>
              <span>{{clientInfo.email}}</span>
            </p>
            <p>
              <b>手机号：</b>
              <span>{{clientInfo.mobile}}</span>
            </p>
            <p>
              <b>地址：</b>
              <span>{{clientInfo.address}}</span>
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
      clientInfo: {
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