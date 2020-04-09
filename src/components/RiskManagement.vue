<template>
  <el-main>
    <el-card shadow="always">
      <!-- 上传 / 下载入口 -->
      <el-row type="flex" justify="space-between" align="middle" style="height: 36px;">
        <el-col :span="8">
          <div style="font-size:18px">风险信息管理</div>
        </el-col>
        <el-col :span="3" style="display: flex;">
          <el-button
            class="btn-dwn"
            type="warning"
            size="medium"
            icon="el-icon-plus"
            @click="addRiskDialogVisible=true"
            plain
            circle
          ></el-button>
          <el-upload
            ref="uploadRiskExcel"
            action="/api/upload/risk"
            accept=".xlsx, .xls"
            :headers="uploadHeaders"
            :on-preview="handlePreview"
            :on-success="handleSuccess"
            :limit="1"
            :file-list="excelFileList"
            :show-file-list="isUpload"
            style="display: flex;"
          >
            <el-button v-show="showUploadBtn" type="primary" size="medium" plain circle>
              <i class="el-icon-document-add"></i>
            </el-button>
          </el-upload>

          <el-button
            class="btn-dwn"
            type="success"
            size="medium"
            @click="downloadRiskExcel()"
            plain
            circle
          >
            <i class="el-icon-download"></i>
          </el-button>
        </el-col>
      </el-row>

      <!-- 风险列表 -->
      <el-table
        :data="riskList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        :default-sort="{prop: 'riskId'}"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="风险描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="风险应对策略">
                <span>{{ props.row.reactiveStrategy }}</span>
              </el-form-item>
              <el-form-item label="风险相关人员">
                <el-tag
                  class="tag-relate"
                  v-for="person in props.row.riskRelatedIds"
                  :key="person.riskRelatedId"
                  closable
                  type="danger"
                  @close="tagHandleClose(props.row.riskId, person.riskRelatedId)"
                >{{ person.riskRelatedId }}</el-tag>
                <el-select
                  placeholder="请选择"
                  class="input-new-tag"
                  v-if="props.row.inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @blur="addRiskRelatedId(props.row)"
                >
                  <el-option
                    v-for="item in members"
                    :key="item.employeeId"
                    :label="item.employeeId"
                    :value="item.employeeId"
                  ></el-option>
                </el-select>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  type="success"
                  @click="showInput(props.row)"
                  plain
                >+ 新增</el-button>
                <el-button size="small" icon="el-icon-refresh" @click="allRelatedRefresh()" circle></el-button>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="风险ID" prop="riskId" sortable></el-table-column>
        <el-table-column label="风险类型" prop="type"></el-table-column>
        <el-table-column label="风险等级" prop="riskLevel" sortable></el-table-column>
        <el-table-column label="风险状态" prop="riskState"></el-table-column>
        <el-table-column label="风险跟踪频度" prop="riskTrackFrequency" sortable></el-table-column>
        <el-table-column label="风险影响度" prop="influence"></el-table-column>
        <el-table-column label="风险责任人" prop="riskOwnerId"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="修改" placement="top">
              <el-button
                type="success"
                icon="el-icon-edit"
                size="mini"
                plain
                @click="editOneRisk(scope.row)"
              ></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                plain
                @click="deleteOneRisk(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 修改风险对话框 -->
      <el-dialog title="修改项目风险" :visible.sync="editDialogFormVisible" @close="editDialogClosed">
        <el-form
          :model="riskInfo"
          label-width="100px"
          label-position="left"
          :rules="editDialogFormRules"
          ref="editDialogFormRef"
        >
          <el-form-item label="风险ID" prop="riskId">
            <el-input
              :placeholder="riskInfo.riskId"
              v-model="riskInfo.riskId"
              :disabled="true"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险类型" prop="type">
            <el-input :placeholder="riskInfo.type" v-model="riskInfo.type" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="风险等级" prop="riskLevel">
            <el-input
              :placeholder="riskInfo.riskLevel"
              v-model="riskInfo.riskLevel"
              type="number"
              max="5"
              min="0"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险状态" prop="riskState">
            <el-select
              v-model="riskInfo.riskState"
              clearable
              placeholder="请选择风险状态"
              style="width:300px;"
            >
              <el-option v-for="item in riskStateOpts" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险跟踪频度" prop="riskTrackFrequency">
            <el-input
              :placeholder="riskInfo.riskTrackFrequency"
              v-model="riskInfo.riskTrackFrequency"
              type="number"
              max="1"
              min="0"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险责任人" prop="riskOwnerId">
            <el-select
              v-model="riskInfo.riskOwnerId"
              clearable
              placeholder="请选择风险责任人"
              style="width:300px;"
            >
              <el-option
                v-for="item in members"
                :key="item.employeeId"
                :label="item.employeeId"
                :value="item.employeeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险影响度" prop="influence">
            <el-input
              :placeholder="riskInfo.influence"
              v-model="riskInfo.influence"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险应对策略" prop="reactiveStrategy">
            <el-input
              :placeholder="riskInfo.reactiveStrategy"
              v-model="riskInfo.reactiveStrategy"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险描述" prop="description">
            <el-input type="textarea" v-model="riskInfo.description" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitEditOneRisk()">确认</el-button>
          <el-button @click="editDialogFormVisible = false">取消</el-button>
        </div>
      </el-dialog>

      <!-- 新建风险对话框 -->
      <el-dialog title="新建项目风险" :visible.sync="addRiskDialogVisible" @close="addRiskDialogClosed">
        <el-form
          :model="riskInfo"
          label-width="100px"
          label-position="left"
          :rules="addRiskDialogFormRules"
          ref="addRiskDialogFormRef"
        >
          <el-form-item label="风险ID" prop="riskId" required>
            <el-input
              placeholder="例：risk-00x"
              v-model="riskInfo.riskId"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险类型" prop="type">
            <el-input placeholder="例：login" v-model="riskInfo.type" style="width:300px;"></el-input>
          </el-form-item>
          <el-form-item label="风险等级" prop="riskLevel">
            <el-input
              placeholder="0-5的整数"
              v-model="riskInfo.riskLevel"
              type="number"
              max="5"
              min="0"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险状态" prop="riskState">
            <el-select
              v-model="riskInfo.riskState"
              clearable
              placeholder="请选择风险状态"
              style="width:300px;"
            >
              <el-option v-for="item in riskStateOpts" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险跟踪频度" prop="riskTrackFrequency">
            <el-input
              :placeholder="riskInfo.riskTrackFrequency"
              v-model="riskInfo.riskTrackFrequency"
              type="number"
              max="1"
              min="0"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险责任人" prop="riskOwnerId">
            <el-select
              v-model="riskInfo.riskOwnerId"
              clearable
              placeholder="请选择风险责任人"
              style="width:300px;"
            >
              <el-option
                v-for="item in members"
                :key="item.employeeId"
                :label="item.employeeId"
                :value="item.employeeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="风险影响度" prop="influence">
            <el-input
              :placeholder="riskInfo.influence"
              v-model="riskInfo.influence"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险应对策略" prop="reactiveStrategy">
            <el-input
              :placeholder="riskInfo.reactiveStrategy"
              v-model="riskInfo.reactiveStrategy"
              style="width:300px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="风险描述" prop="description">
            <el-input type="textarea" v-model="riskInfo.description" style="width:400px;"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitAddOneRisk()">确认</el-button>
          <el-button @click="addRiskDialogVisible = false">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import Cookie from "js-cookie";
import { mapState } from "vuex";

export default {
  data() {
    return {
      riskList: [],
      riskRelatesList: [],
      riskRelateIds: {},
      currentPage: 1,
      pageSize: 6,
      total: 0,
      excelFileList: [],
      uploadHeaders: {
        Authorization: "Bearer " + Cookie.get("token")
      },
      isUpload: true,
      showUploadBtn: false,

      // 新增风险相关人员
      members: [],
      inputValue: "",
      // 新增一条风险
      addRiskDialogVisible: false,
      addRiskDialogFormRules: {},
      riskStateOpts: ["潜在", "正常", "异常", "紧急", "已解决"],
      // 修改一条风险
      editDialogFormVisible: false,
      editDialogFormRules: {},
      riskInfo: {
        projectId: "",
        riskId: "",
        type: "",
        description: "",
        riskLevel: 0,
        influence: "",
        reactiveStrategy: "",
        riskState: "",
        riskOwnerId: "",
        riskTrackFrequency: 0
      }
    };
  },
  created() {
    this.getRiskList();
    this.getProjectMembers();
  },
  computed: {
    ...mapState(["personId"]),
    ...mapState(["projectBasicId"])
  },
  methods: {
    getRiskList() {
      axios.get("/api/risk/project/" + this.projectBasicId).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.riskList = response.data.data;
          this.total = this.riskList.length;
          if(this.total === 0){
            this.showUploadBtn = true;
          }
          this.getRiskRelatesList();
        } else {
          this.$message.error("获取项目风险列表失败！");
        }
      });
    },
    // 获取风险相关人员，为方便显示，将其放入tableData：riskList的属性中保存
    getRiskRelatesList() {
      console.log(this.riskList);
      this.riskList.forEach(risk => {
        axios
          .get("/api/risk/related", {
            params: { projectId: this.projectBasicId, riskId: risk.riskId }
          })
          .then(response => {
            if (response.data.code === 0) {
              this.$set(risk, "riskRelatedIds", response.data.data);
              this.$set(risk, "inputVisible", false);
            } else {
              this.$message.error(risk.riskId + "风险相关人员获取失败！");
            }
          });
      });
      console.log(this.riskList);
    },
    downloadRiskExcel() {
      axios
        .get("/api/download/risk/" + this.projectBasicId, {
          responseType: "blob" //告诉服务器我们需要的响应格式
        })
        .then(response => {
          var blob = new Blob([response.data], {
            type: "application/vnd.ms-excel" //将会被放入到blob中的数组内容的MIME类型
          });
          var objectUrl = URL.createObjectURL(blob); //生成一个装有blob的url
          window.location.href = objectUrl; //浏览器打开这个url
          window.URL.revokeObjectURL(objectUrl); // 释放url
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handlePreview(file) {
      console.log(file);
    },
    // 上传excel对返回数据的处理 （有疑问）
    handleSuccess(response, file, fileList) {
      this.$message.success("上传文件成功！");
      this.isUpload = false;
      this.excelFileList = [];
      //console.log(response.data);
      var updateArray = response.data;
      updateArray.forEach(updateObj => {
        updateObj.projectId = this.projectBasicId;
        updateObj.riskOwnerId = this.personId;
        updateObj.riskState = "潜在";
      });
      console.log(updateArray);
      axios.post("/api/risks", updateArray).then(response => {
        if (response.data.code === 0) {
          console.log("Successfully update risks.");
        } else {
          this.$message.error("导入风险失败！")
        }
        this.getRiskList();
      });
      
    },
    // 风险相关人员删除
    tagHandleClose(riskId, relatedPersonId) {
      axios
        .delete("/api/risk/related", {
          data: {
            projectId: this.projectBasicId,
            riskId: riskId,
            riskRelatedId: relatedPersonId
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getRiskRelatesList();
          } else {
            this.$message.error("删除项目相关人员失败！");
          }
        });
    },
    // 风险相关人员新增
    showInput(row) {
      row.inputVisible = true;
      this.getProjectMembers();
      this.$nextTick(_ => {
        this.$refs.saveTagInput.focus();
      });
    },
    getProjectMembers() {
      axios.get("/api/member/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          this.members = response.data.data;
          console.log(this.members);
        }
      });
    },
    addRiskRelatedId(row) {
      setTimeout(async () => {
        console.log(this.inputValue);
        if (this.inputValue) {
          axios
            .post("/api/risk/related", {
              projectId: this.projectBasicId,
              riskId: row.riskId,
              riskRelatedId: this.inputValue
            })
            .then(response => {
              console.log(response.data);
              if (response.data.code === 0) {
                row.inputVisible = false;
                this.inputValue = "";
                this.getRiskRelatesList();
              } else {
                this.$message.error("添加项目相关人员失败！");
              }
            });
        } else {
          row.inputVisible = false;
          this.inputValue = "";
        }
      }, 300);
    },
    // 全量修改相关人员
    allRelatedRefresh() {},
    // 新增一条风险
    addRiskDialogClosed() {
      this.$refs.addRiskDialogFormRef.resetFields();
    },
    submitAddOneRisk() {
      this.riskInfo.projectId = this.projectBasicId;
      console.log(this.riskInfo);
      axios.post("/api/risk", this.riskInfo).then(response => {
        if (response.data.code === 0) {
          this.getRiskList();
          this.addRiskDialogVisible = false;
          this.$message.success("新建项目风险成功！");
        } else {
          this.$message.error("新建项目风险失败！");
        }
        this.riskInfo = {};
      });
    },
    // 修改一条风险
    editDialogClosed() {
      this.$refs.editDialogFormRef.resetFields();
    },
    editOneRisk(row) {
      Object.assign(this.riskInfo, row);
      this.$delete(this.riskInfo, "riskRelatedIds");
      this.$delete(this.riskInfo, "inputVisible");
      console.log(this.riskInfo);
      this.getProjectMembers();
      this.editDialogFormVisible = true;
    },
    submitEditOneRisk() {
      axios.put("/api/risk", this.riskInfo).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.getRiskList();
          this.editDialogFormVisible = false;
        } else {
          this.$message.error("修改项目风险失败！");
        }
        this.riskInfo = {};
      });
    },

    // 删除一条风险
    async deleteOneRisk(row) {
      const confirmResult = await this.$confirm(
        "此操作将删除该风险，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除！");
      }

      axios
        .delete("/api/risk", {
          data: {
            projectId: row.projectId,
            riskId: row.riskId
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code === 0) {
            this.getRiskList();
          } else {
            this.$message.error("删除项目风险失败！");
          }
        });
    }
  }
};
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}

.el-card {
  padding-top: 10px;
}

.btn-dwn {
  margin-left: 10px;
  margin-right: 10px;
}

.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.tag-relate {
  margin-right: 10px;
}

.demo-table-expand label {
  font-weight: bolder;
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>