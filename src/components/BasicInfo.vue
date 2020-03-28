<template>
  <el-main>
    <el-table :data="basicInfo" border stripe>
      <el-table-column label="项目基本信息" style="font-size:">
        <template slot-scope="scope">
          <el-row>
            <el-col>项目ID：{{scope.row.projectId}}</el-col>
          </el-row>
          <el-row>
            <el-col>项目名称：{{scope.row.projectName}}</el-col>
          </el-row>
          <el-row>
            <el-col>项目周期：{{scope.row.expStartDate}} 至 {{scope.row.expEndDate}}</el-col>
          </el-row>
          <el-row>
            <el-col>采用技术：{{scope.row.technology}}</el-col>
          </el-row>
          <el-row>
            <el-col>业务领域：{{scope.row.businessDomain}}</el-col>
          </el-row>
          <el-row>
            <el-col>主要功能：{{scope.row.mainFunctions}}</el-col>
          </el-row>
          <el-row>
            <el-col>项目状态：{{scope.row.state}}</el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      basicInfo: []
    };
  },

  created() {
    this.getDetailInfo();
  },

  computed: {
    ...mapState(["projectBasicId"])
  },

  methods: {
    getDetailInfo() {
      axios.get("/api/project_info/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log("success");
          this.basicInfo.push(response.data.data);       
        }
      });
    }
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}
</style>
