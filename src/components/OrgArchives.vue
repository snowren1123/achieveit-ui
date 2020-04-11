<template>
  <el-main>
    <el-card shadow="always">
      <el-table :data="endProjectsList" border stripe>
        <el-table-column label="项目列表(申请归档)-验收归档资料">
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
              <el-col>归档地址：{{scope.row.outputLink}}</el-col>
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
              <div class="checkdiv">
                <el-checkbox
                  :indeterminate="isIndeterminate"
                  v-model="isCheckAll"
                  @change="handleCheckAllChange"
                >全部选择</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedAssets" @change="handleCheckedAssetsChange">
                  <el-checkbox
                    v-for="asset in checkAssetsOptsList"
                    :label="asset"
                    :key="asset"
                  >{{ asset }}</el-checkbox>
                </el-checkbox-group>
                <el-button
                  v-show="isCheckAll"
                  style="margin: 15px 0;"
                  type="success"
                  icon="el-icon-present"
                  size="small"
                  plain
                  round
                  @click="setArchived(scope.row.projectId, scope.row.projectName)"
                >归档</el-button>
              </div>
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
      direction: "rtl",
      checkAssetsOptsList: [],
      checkedAssets: [],
      isIndeterminate: false,
      isCheckAll: false
    };
  },

  created() {
    this.getEndProjects();
    this.getCheckAssets();
  },

  methods: {
    getEndProjects() {
      axios
        .get("/api/state", {
          params: {
            state: "申请归档"
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
    getCheckAssets() {
      axios.get("/api/check_assets").then(response => {
        if (response.data.code === 0) {
          var tempData = response.data.data;
          tempData.forEach(item => {
            this.checkAssetsOptsList.push(item.assetItem);
          });
          console.log(this.checkAssetsOptsList);
        } else {
          this.$message.error("无法获取可检查的资产项！");
        }
      });
    },
    setArchived(projectId, projectName) {
      axios
        .put(
          "/api/state",
          qs.stringify({
            projectId: projectId,
            state: "已归档"
          })
        )
        .then(response => {
          if (response.data.code === 0) {
            this.drawer = false;
            this.$message.success(projectName + "已成功归档!");
          }
        });
    },
    handleCheckAllChange(val) {
      this.checkedAssets = val ? this.checkAssetsOptsList : [];
      this.isIndeterminate = false;
    },
    handleCheckedAssetsChange(value) {
      var checkedCount = value.length;
      this.isCheckAll = checkedCount === this.checkAssetsOptsList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.checkAssetsOptsList.length;
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

.checkdiv {
  margin-left: 15px;
  margin-right: 15px;
  padding-left: 7px;
  padding-right: 7px;
}

.item {
  margin: 4px;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>