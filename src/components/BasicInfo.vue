<template>
  <el-main>
    <el-tabs tab-position="right" style="height: 400px;">
      <el-tab-pane label="项目ID">{{ basicInfo.projectId }}</el-tab-pane>
      <el-tab-pane label="项目名称">{{ basicInfo.projectName }}</el-tab-pane>
      <el-tab-pane label="项目状态">{{ basicInfo.state }}</el-tab-pane>
      <el-tab-pane label="项目上级">{{ basicInfo.projectBossId }}</el-tab-pane>
      <el-tab-pane label="项目周期">{{ basicInfo.expStartDate }} 至 {{ basicInfo.expEndDate }}</el-tab-pane>
      <el-tab-pane label="采用技术">{{ basicInfo.technology }}</el-tab-pane>
      <el-tab-pane label="业务领域">{{ basicInfo.businessDomain }}</el-tab-pane>
      <el-tab-pane label="主要功能">
        <el-row>{{ basicInfo.mainFunctions }}</el-row>
        <el-row class="btn-group-set">
          <el-tooltip class="item" effect="dark" content="编辑文本" placement="left">
            <el-button size="medium" icon="el-icon-edit" circle></el-button>
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
              <el-button size="medium" icon="el-icon-document-add" circle></el-button>
            </el-tooltip>
          </el-upload>
          <el-tooltip class="item" effect="dark" content="下载为excel格式文件" placement="left">
            <el-button size="medium" icon="el-icon-download" circle></el-button>
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
      excelFileList: [],
      isUpload: true
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
      this.$message.warning(
        `只可选择1个文件，请先移除已有文件`
      );
    },
    handleSuccess(response, file, fileList){
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

.btn-group-set {
  text-align: right;
  margin-right:5%;
  display: block;
}

.item {
  margin: 4px;
}
</style>
