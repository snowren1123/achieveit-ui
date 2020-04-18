<template>
  <el-main>
    <el-card shadow="always">
      <el-table :data="gitSetList" border stripe>
        <el-table-column label="项目列表-待添加配置库">
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
            <el-tooltip class="item" effect="dark" content="建立配置库" placement="top">
              <el-button
                icon="el-icon-s-promotion"
                class="pink-btn"
                @click="recordProjInfo(scope.row)"
                circle
              ></el-button>
            </el-tooltip>

            <el-dialog title="建立配置库" :visible.sync="configFormVisible">
              <el-form :model="dataSendedFormat" :rules="configFormRules" ref="configFormRef">
                <el-form-item
                  label="git地址"
                  label-width="80px"
                  label-position="left"
                  prop="gitAddress"
                >
                  <el-input v-model="dataSendedFormat.gitAddress" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item
                  label="Files地址"
                  label-width="90px"
                  label-position="left"
                  prop="fileSystemAddress"
                >
                  <el-input v-model="dataSendedFormat.fileSystemAddress" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="setConfigInfo(dataSendedFormat)">确 定</el-button>
                <el-button @click="configFormVisible = false">取 消</el-button>
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
      configFormVisible: false,
      configFormRules: {
        gitAddress: [
          {
            required: true,
            message: "请填入合适的git仓库地址",
            trigger: "blur"
          }
        ],
        fileSystemAddress: [
          {
            required: true,
            message: "请填入合适的文件系统仓库地址",
            trigger: "change"
          }
        ]
      },
      dataSendedFormat: {
        projectId: "",
        projectName: "",
        clientId: "",
        expStartDate: "",
        expEndDate: "",
        technology: "",
        businessDomain: "",
        mainFunctions: "",
        gitAddress: "",
        fileSystemAddress: "",
        taskId: ""
      },
      gitSetList: []
    };
  },

  created() {
    this.getConfigSetProjects();
  },

  methods: {
    getConfigSetProjects() {
      axios.get("/api/newproject").then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.gitSetList = response.data.data;
        } else {
          this.$message.error(response.data.data);
        }
      });
    },
    recordProjInfo(projArray) {
      this.configFormVisible = true;
      console.log(projArray);
      this.dataSendedFormat.taskId = projArray.taskId;
      for (var key in projArray.projectBasicInfo) {
        if (
          key === "state" ||
          key === "outputLink" ||
          key === "milestone" ||
          key === "projectBossId"
        )
          continue;
        console.log(key);
        this.dataSendedFormat[key] = projArray.projectBasicInfo[key];
      }
      this.dataSendedFormat.expStartDate = this.dateFormat(
        this.dataSendedFormat.expStartDate
      );
      this.dataSendedFormat.expEndDate = this.dateFormat(
        this.dataSendedFormat.expEndDate
      );
    },
    setConfigInfo(dataSendedFormat) {
      this.$refs.configFormRef.validate(async valid => {
        if (!valid) return;
        console.log(dataSendedFormat);
        axios
          .put("/api/newproject/config", qs.stringify(dataSendedFormat))
          .then(response => {
            if (response.data.code === 0) {
              this.$message.success("创建配置库成功！");
            }
          });
        this.configFormVisible = false;
        this.getConfigSetProjects();
      });
    },
    dateFormat: function(originVal) {
      const dt = new Date(originVal);
      const y = dt.getFullYear();
      const m = (dt.getMonth() + 1 + "").padStart(2, "0");
      const d = (dt.getDate() + "").padStart(2, "0");
      return `${y}-${m}-${d}`;
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