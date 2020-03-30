<template>
  <el-main>
    <el-row :gutter="20">
      <template v-for="member in members">
        <el-col :span="8" v-bind:key="member.index">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>{{ member.title }}</span>
            </div>
            <div class="text">
              <p>
                <b>昵称：</b>
                <span>{{ member.employeeName }}</span>
              </p>
              <p>
                <b>邮箱：</b>
                <span>{{ member.email }}</span>
              </p>
              <p>
                <b>手机号：</b>
                <span>{{ member.telephone }}</span>
              </p>
              <p>
                <b>部门：</b>
                <span>{{ member.department }}</span>
              </p>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      members: []
    };
  },

  created() {
    this.getProjectMembers();
  },

  computed: {
    ...mapState(["projectBasicId"])
  },

  methods: {
    getProjectMembers() {
      axios.get("/api/member/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          var temp = response.data.data;
          temp.forEach(item => {
            this.getUserInfo(item.employeeId);
          });
          console.log(this.members);
        }
      });
    },
    // 根据id获取成员的详细信息
    getUserInfo(personId) {
      axios.get("/api/employee/" + personId).then(response => {
        if (response.data.code === 0) {
          this.members.push(response.data.data);
        } else {
          this.$message.error("获取用户信息失败！");
        }
      });
    }
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
.el-col {
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