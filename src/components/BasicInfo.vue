<template>
  <el-main>
    <el-tabs tab-position="right" style="height: 600px;">
      <el-tab-pane label="项目ID">{{ basicInfo.projectId }}</el-tab-pane>
      <el-tab-pane label="项目名称">{{ basicInfo.projectName }}</el-tab-pane>
      <el-tab-pane label="项目状态">
        <span v-show="!editState">{{ basicInfo.state }}</span>
        <el-select
          v-show="editState"
          v-model="editStateValue"
          :placeholder="basicInfo.state"
          clearable
        >
          <el-option v-for="item in stateOptions" :key="item" :label="item" :value="item"></el-option>
        </el-select>
        <el-button
          v-show="!editState"
          type="danger"
          size="small"
          icon="el-icon-edit"
          @click="editState=!editState"
          circle
          plain
        ></el-button>
        <el-button
          v-show="editState"
          type="primary"
          size="small"
          @click="submitState()"
          round
          plain
        >确认修改</el-button>
        <el-button
          v-show="editState"
          type="danger"
          size="small"
          @click="editState=!editState"
          round
          plain
        >取消</el-button>
      </el-tab-pane>
      <el-tab-pane label="项目上级">{{ basicInfo.projectBossId }}</el-tab-pane>
      <el-tab-pane label="项目周期">{{ basicInfo.expStartDate }} 至 {{ basicInfo.expEndDate }}</el-tab-pane>
      <el-tab-pane label="主要功能">{{ basicInfo.mainFunctions }}</el-tab-pane>
      <el-tab-pane label="采用技术">{{ basicInfo.technology }}</el-tab-pane>
      <el-tab-pane label="业务领域">{{ basicInfo.businessDomain }}</el-tab-pane>
      <el-tab-pane label="功能列表">
        <el-row>
          <el-tree
            :data="funcsData"
            show-checkbox
            node-key="id"
            default-expand-all
            :expand-on-click-node="false"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span style="margin-right: 15px;">
                <el-button
                  v-show="data.showAdd"
                  class="mini-btn-set"
                  type="success"
                  icon="el-icon-plus"
                  size="mini"
                  @click="appendSecFunc(data)"
                  circle
                  plain
                ></el-button>
                <el-button
                  class="mini-btn-set"
                  type="info"
                  icon="el-icon-edit"
                  size="mini"
                  @click="editFunc(data)"
                  circle
                  plain
                ></el-button>
                <el-button
                  class="mini-btn-set"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeFunc(node, data)"
                  circle
                  plain
                ></el-button>
              </span>
              <el-dialog title="请输入添加的二级功能" :visible.sync="addSecFuncVisible">
                <el-input v-model="addSecFuncValue" class="input-set"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="addTextFunc(addSecFuncValue)">确 定</el-button>
                  <el-button @click="addSecFuncVisible = false">取 消</el-button>
                </div>
              </el-dialog>
              <el-dialog title="请输入修改的功能" :visible.sync="editFuncVisible">
                <el-input v-model="editFuncValue" class="input-set" :placeholder="editFuncValue"></el-input>
                <div slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="editTextFunc(editFuncValue)">确 定</el-button>
                  <el-button @click="editFuncVisible = false">取 消</el-button>
                </div>
              </el-dialog>
            </span>
          </el-tree>
          <el-dialog title="请输入添加的一级功能" :visible.sync="addPriFuncVisible">
            <el-input v-model="addPriFuncValue" class="input-set"></el-input>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="appendPriFunc(addPriFuncValue)">确 定</el-button>
              <el-button @click="addPriFuncVisible = false">取 消</el-button>
            </div>
          </el-dialog>
          <el-button
            class="mini-btn-set"
            type="success"
            icon="el-icon-circle-plus-outline"
            size="mini"
            @click="addPriFuncVisible=true"
            circle
            plain
          ></el-button>
        </el-row>

        <el-row class="btn-group-set">
          <el-upload
            ref="uploadExcel"
            action="/api/upload/function"
            accept=".xlsx, .xls"
            :headers="uploadHeaders"
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
            <el-button
              type="success"
              size="medium"
              icon="el-icon-download"
              @click="downloadExcel()"
              circle
              plain
            ></el-button>
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
import Cookie from "js-cookie";
import { mapState } from "vuex";

var id = 1;
export default {
  data() {
    const funcsData = [];
    return {
      funcsData: JSON.parse(JSON.stringify(funcsData)),
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
      stateOptions: ["进行中", "已结束", "已交付", "申请归档"],
      uploadHeaders: {
        Authorization: "Bearer " + Cookie.get("token")
      },
      excelFileList: [],
      editFuncValue: "",
      addPriFuncValue: "",
      addSecFuncValue: "",
      addSecFindPriId: 0,
      editFindId: 0,
      editStateValue: "",
      isUpload: true,
      editFuncVisible: false,
      addPriFuncVisible: false,
      addSecFuncVisible: false,
      editState: false
    };
  },

  created() {
    this.getDetailInfo();
    this.getFuncList();
  },

  computed: {
    ...mapState(["projectBasicId"])
  },

  methods: {
    appendPriFunc(addPriFuncValue) {
      var newPriFunc = {
        id: id++,
        label: addPriFuncValue,
        children: [],
        showAdd: true
      };
      this.funcsData.push(newPriFunc);
      this.addPriFuncValue = "";
      this.addPriFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    appendSecFunc(data) {
      this.addSecFuncVisible = true;
      this.addSecFindPriId = data.id;
      console.log(data.id);
    },
    editFunc(data) {
      this.editFuncVisible = true;
      this.editFindId = data.id;
      this.editFuncValue = data.label;
      console.log(data.id + " " + data.label);
    },
    addTextFunc(addSecFuncValue) {
      var newSecFunc = {
        id: id++,
        label: addSecFuncValue,
        children: [],
        showAdd: false
      };
      this.funcsData.forEach(traverseFunc => {
        if (traverseFunc.id === this.addSecFindPriId) {
          traverseFunc.children.push(newSecFunc);
        }
      });
      this.addSecFuncValue = "";
      this.addSecFindPriId = 0;
      this.addSecFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    // 向后台传数据
    // 数据封装
    packFunctionData() {
      var packedData = {
        projectId: this.projectBasicId,
        functions: []
      };
      this.funcsData.forEach(eachPriFunc => {
        var funcObj = {
          primaryFunction: eachPriFunc.label,
          secondaryFunction: []
        };
        eachPriFunc.children.forEach(eachSecFunc => {
          funcObj.secondaryFunction.push(eachSecFunc.label);
        });
        packedData.functions.push(funcObj);
      });
      console.log(packedData);
      axios
        .put("/api/function", JSON.stringify(packedData), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(response => {
          console.log("success?");
        });
    },

    editTextFunc(editFuncValue) {
      for (var i = 0; i < this.funcsData.length; i++) {
        if (this.funcsData[i].id === this.editFindId) {
          this.funcsData[i].label = editFuncValue;
          break;
        } else {
          for (var j = 0; j < this.funcsData[i].children.length; j++) {
            if (this.funcsData[i].children[j].id === this.editFindId) {
              this.funcsData[i].children[j].label = editFuncValue;
              break;
            }
          }
        }
      }
      this.editFuncValue = "";
      this.editFindId = 0;
      this.editFuncVisible = false;
      console.log(this.funcsData);
      this.packFunctionData();
      //this.getFuncList();
    },
    removeFunc(node, data) {
      this.$confirm("确认删除" + data.label + "功能?", "确认信息", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "danger",
        center: false
      }).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
        console.log(this.funcsData);
        this.packFunctionData();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },
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
      console.log(response.data);
      if (response.code === 0) {
        this.$message.success("上传文件成功！");
        this.isUpload = false;
      }
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定放弃上传 ${file.name}？`);
    },
    getDetailInfo() {
      axios.get("/api/project_info/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data);
          this.basicInfo = response.data.data;
          this.editStateValue = this.basicInfo.state;
        }
      });
    },
    getFuncList() {
      axios.get("/api/function/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          console.log(response.data.data.functions);
          this.funcsData = [];
          var tempFuncs = response.data.data.functions;
          tempFuncs.forEach(eachPriFunc => {
            var newPrimaryItem = {
              id: id++,
              label: eachPriFunc.primaryFunction,
              children: [],
              showAdd: true
            };
            eachPriFunc.secondaryFunction.forEach(eachSecFunc => {
              var newSecondItem = {
                id: id++,
                label: eachSecFunc,
                children: [],
                showAdd: false
              };
              newPrimaryItem.children.push(newSecondItem);
            });
            this.funcsData.push(newPrimaryItem);
            //console.log(newPrimaryItem.showOpts)
          });
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

    submitState() {
      this.$confirm(
        "确认将状态修改为" + this.editStateValue + "?",
        "确认信息",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          center: false
        }
      )
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
    },
    downloadExcel() {
      axios
        .get("/api/download/function/" + this.projectBasicId, {
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
    }
  }
};
</script>

<style scoped>
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

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.mini-btn-set {
  background-color: transparent;
  border-color: transparent;
  margin: 0;
}
</style>
