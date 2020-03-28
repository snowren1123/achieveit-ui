<template>
  <el-main>
    <el-card shadow="always">
      <el-table :data="pendingList" border stripe>
        <el-table-column label="待审核项目列表">
          <template slot-scope="scope">
            <el-row>
              <el-col>项目名称：{{scope.row.projectBasicInfo.projectName}}</el-col>
            </el-row>
            <el-row>
              <el-col>项目周期：{{scope.row.projectBasicInfo.expStartDate}} 至 {{scope.row.projectBasicInfo.expEndDate}}</el-col>
            </el-row>
            <el-row>
              <el-col>业务领域：{{scope.row.projectBasicInfo.businessDomain}}</el-col>
            </el-row>
            <el-row>
              <el-col>主要功能：{{scope.row.projectBasicInfo.mainFunctions}}</el-col>
            </el-row>
            <el-row>
              <el-col>采用技术：{{scope.row.projectBasicInfo.technology}}</el-col>
            </el-row>
            <el-row>
              <el-col>项目状态：{{scope.row.projectBasicInfo.state}}</el-col>
            </el-row>
            <el-tooltip class="item" effect="dark" content="审核通过" placement="top">
              <el-button
                type="success"
                icon="el-icon-check"
                class="approve"
                @click="approveProject(scope.row.taskId)"
                circle
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="驳回项目" placement="top">
              <el-button
                type="danger"
                icon="el-icon-close"
                class="failed"
                @click="failProject(scope.row.taskId)"
                circle
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";

export default {
  data() {
    return {
      pendingList: []
    };
  },

  created() {
    this.getPendingProjects();
  },

  methods: {
    getPendingProjects() {
      axios.get("/api/newproject").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.pendingList = response.data.data;
        } else {
          this.$message.error(response.data.data);
        }
      });
    },
    approveProject(taskId) {
      console.log(taskId);
      axios
        .put(
          "/api/newproject",
          qs.stringify({
            taskId: taskId,
            approval: 1
          })
        )
        .then(response => {
          this.$message.success(response.data.data);
          this.getPendingProjects();
          console.log(response.data);
        });
    },
    failProject(taskId) {
      console.log(taskId);
      axios
        .put(
          "/api/newproject",
          qs.stringify({
            taskId: taskId,
            approval: 0
          })
        )
        .then(response => {
          this.$message.warning(response.data.data);
          this.getPendingProjects();
          console.log(response.data.data);
        });
    }
  }
};
</script>

<style scoped>
.el-table-column {
  position: relative;
}

.approve {
  position: absolute;
  right: 60px;
  top: 75%;
  transform: translateY(-50%);
}

.failed {
  position: absolute;
  right: 15px;
  top: 75%;
  transform: translateY(-50%);
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>