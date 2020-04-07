<template>
  <el-main>
    <el-card shadow="always">
      <el-table :data="endProjectsList" border stripe>
        <el-table-column label="项目列表(已结束)-验收归档资料">
          <template slot-scope="scope">
            <el-row>
              <el-col>项目名称：{{scope.row.projectName}}</el-col>
            </el-row>
            <el-row>
              <el-col>项目周期：{{scope.row.expStartDate}} 至 {{scope.row.expEndDate}}</el-col>
            </el-row>
            <el-row>
              <el-col>业务领域：{{scope.row.businessDomain}}</el-col>
            </el-row>
            <el-row>
              <el-col>主要功能：{{scope.row.mainFunctions}}</el-col>
            </el-row>
            <el-row>
              <el-col>采用技术：{{scope.row.technology}}</el-col>
            </el-row>
            <el-row>
              <el-col>项目状态：{{scope.row.state}}</el-col>
            </el-row>
            <el-tooltip class="item" effect="dark" content="点击查看项目归档情况" placement="top">
              <el-button
                icon="el-icon-document-checked"
                class="pink-btn"
                @click="drawer=true"
                circle
              ></el-button>
            </el-tooltip>
            <el-drawer
              :visible.sync="drawer"
              :direction="direction"
              :before-close="handleCloseDrawer"
            >
              <h2 slot="title">{{ scope.row.projectName }}</h2>
              <!-- 显示checkList -->
            </el-drawer>
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
      endProjectsList: [],
      drawer: false,
      direction: 'rtl'
    };
  },

  created() {
    this.getEndProjects();
  },

  methods: {
    getEndProjects() {
      axios
        .get("/api/state", {
          params: {
            state: "已结束"
          }
        })
        .then(response => {
          if (response.data.code === 0) {
            console.log(response.data.data);
            this.endProjectsList = response.data.data;
          } else {
            this.$message.error(response.data.data);
          }
        });
    },
    handleCloseDrawer(done) {
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    }
  }
};
</script>

<style scoped>
.el-table-column {
  position: relative;
}

.pink-btn {
  background-color: #feeeed;
  border-color: transparent;
  position: absolute;
  right: 30px;
  top: 75%;
  transform: translateY(-50%);
}

.item {
  margin: 4px;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>