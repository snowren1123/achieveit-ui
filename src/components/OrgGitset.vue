<template>
  <el-main>
    <el-card shadow="always">
      <el-table :data="gitSetList" border stripe>
        <el-table-column label="项目列表-待添加Git库">
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
            <el-tooltip class="item" effect="dark" content="建立Git库" placement="top">
              <el-button
                icon="el-icon-s-promotion"
                class="pink-btn"
                @click="gitFormVisible = true"
                circle
              ></el-button>
            </el-tooltip>

            <el-dialog title="建立Git配置库" :visible.sync="gitFormVisible">
              <el-form :model="configInfo">
                <el-form-item
                  label="git地址"
                  label-width="80px"
                  label-position="left"
                  :rules="{ required: true, message: '请填入合适的git仓库地址', trigger: 'blur'}"
                >
                  <el-input v-model="configInfo.gitAddress" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item
                  label="FileSys地址"
                  label-width="80px"
                  label-position="left"
                  :rules="{ required: true, message: '请填入合适的git仓库地址', trigger: 'blur'}"
                >
                  <el-input v-model="configInfo.gitAddress" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setGitAddr(git)">确 定</el-button>
                <el-button @click="gitFormVisible = false">取 消</el-button>
              </div>
            </el-dialog>
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
      gitFormVisible: false,
      gitAddress: "",
      gitSetList: []
    };
  },

  created() {
    this.getGitSetProjects();
  },

  methods: {
    getGitSetProjects() {
      axios.get("/api/newproject").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.gitSetList = response.data.data;
        } else {
          this.$message.error(response.data.data);
        }
      });
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