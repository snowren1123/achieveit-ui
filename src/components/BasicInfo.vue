<template>
  <el-main>
    <el-tabs tab-position="right" style="height: 400px;">
      <el-tab-pane label="项目ID">{{ basicInfo.projectId }}</el-tab-pane>
      <el-tab-pane label="项目名称">{{ basicInfo.projectName }}</el-tab-pane>
      <el-tab-pane label="项目状态">
        <span v-show="!editState">{{ basicInfo.state }}</span>
        <el-select v-show="editState" v-model="editStateValue" :placeholder="basicInfo.state" clearable>
          <el-option
            v-for="item in stateOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
        <el-button v-show="!editState" type="danger" size="small" icon="el-icon-edit" @click="editState=!editState" circle plain></el-button>
        <el-button v-show="editState" type="primary" size="small" @click="submitState()" round plain>确认修改</el-button>
        <el-button v-show="editState" type="danger" size="small" @click="editState=!editState" round plain>取消</el-button>
      </el-tab-pane>
      <el-tab-pane label="项目上级">{{ basicInfo.projectBossId }}</el-tab-pane>
      <el-tab-pane label="项目周期">{{ basicInfo.expStartDate }} 至 {{ basicInfo.expEndDate }}</el-tab-pane>
      <el-tab-pane label="采用技术">{{ basicInfo.technology }}</el-tab-pane>
      <el-tab-pane label="业务领域">{{ basicInfo.businessDomain }}</el-tab-pane>
      <el-tab-pane label="主要功能">
        <el-row v-show="!editFunc">{{ basicInfo.mainFunctions }}</el-row>
        <el-row v-show="editFunc">
          <el-input
            type="textarea"
            v-model="editFuncValue"
            :placeholder="basicInfo.mainFunctions"
            class="input-set"
            autosize
          ></el-input>
          <el-button type="primary" size="small" @click="submitTextFunc()" round plain>确认修改</el-button>
        </el-row>
        <el-row class="btn-group-set">
          <el-tooltip class="item" effect="dark" content="编辑文本" placement="left">
            <el-button type="info" size="medium" icon="el-icon-edit" @click="editFunc=!editFunc" circle plain></el-button>
          </el-tooltip>
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :before-remove="beforeRemove"
            :limit="1"
            :on-exceed="handleExceed"
            :file-list="excelFileList"
            :show-file-list="isUpload"
          >
            <el-tooltip class="item" effect="dark" content="上传excel文件" placement="left">
              <el-button type="primary" size="medium" icon="el-icon-document-add" circle plain></el-button>
            </el-tooltip>
          </el-upload>
          <el-tooltip class="item" effect="dark" content="下载为excel格式文件" placement="left">
            <el-button type="success" size="medium" icon="el-icon-download" circle plain></el-button>
          </el-tooltip>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="主要里程碑">{{ basicInfo.milestone }}</el-tab-pane>
    </el-tabs>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      basicInfo: {
        projectId: "",
        projectName: "",
        state: "",
        expStartDate: "",
        expEndDate: "",
        projectBossId: "",
        milestone: "",
        technology: "",
        businessDomain: "",
        mainFunctions: ""
      },
      stateOptions:[
        "进行中", "已结束", "已交付", "申请归档"
      ],
      excelFileList: [],
      editFuncValue: '',
      editStateValue: '',
      isUpload: true,
      editFunc: false,
      editState: false
    };
  },

  created() {
    this.getDetailInfo();
  },

  computed: {
    ...mapState(["projectBasicId"])
  },

  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只可选择1个文件，请先移除已有文件`);
    },
    handleSuccess(response, file, fileList) {
      this.$message.success("上传文件成功！");
      this.isUpload = false;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定放弃上传 ${file.name}？`);
    },
    getDetailInfo() {
      axios.get("/api/project_info/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.basicInfo = response.data.data;
          this.editFuncValue = this.basicInfo.mainFunctions;
          this.editStateValue = this.basicInfo.state;
        }
      });
    },
    submitTextFunc() {
      this.$confirm("确认提交修改的主要功能？", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          this.basicInfo.mainFunctions = this.editFuncValue;
          console.log(this.basicInfo.mainFunctions);
          this.editFunc = false;
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消提交"
          });
        });
    },
    submitState(){
      this.$confirm("确认将状态修改为"+this.editStateValue+"?", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: false
      })
        .then(() => {
          this.basicInfo.state = this.editStateValue;
          console.log(this.basicInfo.state);
          this.editState = false;
          this.$message({
            type: "success",
            message: "修改成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消修改"
          });
        });
    }
  }
};
</script>

<style>
.el-row {
  margin-bottom: 20px;
}

.el-select {
  width: 20%;
}

.btn-group-set {
  text-align: right;
  margin-right: 3%;
  display: block;
}

.item {
  margin: 4px;
}

.input-set {
  width: 50%;
}
</style>
