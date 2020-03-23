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
        </template>
      </el-table-column>
    </el-table>
  </el-main>
</template>

<script>
export default {
  data() {
    return {
      basicInfo: [
        {
          projectId: "2020-a5df-D-01",
          projectName: "智趣识图",
          clientId: "pwc_001",
          expStartDate: "2020-03-25",
          expEndDate: "2020-05-13",
          technology:
            "包括编程语言，开发平台（OS+DB ），服务架构 Framework ，使用的工具等",
          businessDomain: "项目涉及的业务领域",
          mainFunctions: "项目完成的主要业务功能"
        }
      ]
    };
  }
};
</script>

<style>
.el-row{
  margin-bottom: 20px;
}
</style>
