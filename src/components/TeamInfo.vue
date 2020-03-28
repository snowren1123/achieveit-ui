<template>
  <el-main>
    <el-row :gutter="20">
      <template v-for="member in members">
        <el-col :span="8" v-bind:key="member.index">
          <el-card shadow="always">
            <div slot="header" class="clearfix">
              <span>{{ member.role }}</span>
            </div>
            <div class="text">
              <p>
                <b>ID：</b>
                <span>{{ member.employeeId }}</span>
              </p>
              <p>
                <b>邮箱：</b>
                <span>{{ member.email }}</span>
              </p>
              <p>
                <b>手机号：</b>
                <span>{{ member.mobile }}</span>
              </p>
              <p>
                <b>地址：</b>
                <span>{{ member.address }}</span>
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
          console.log(response.data);
          this.members = response.data.data;
        }
      });
      // 需添加获取员工信息
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