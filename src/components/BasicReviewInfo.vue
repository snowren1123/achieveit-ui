<template>
  <el-main>
    <el-card shadow="always">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <div style="font-size:18px">评审/缺陷信息表</div>
        </el-col>
        <el-col :span="2">
          <el-button
            v-show="((projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject.indexOf('测试') != -1)"
            type="danger"
            size="medium"
            @click="reportVisible=true"
            plain
            round
          >
            <i class="el-icon-plus"></i>报告
          </el-button>
        </el-col>
      </el-row>
      <!-- 评审列表区域 -->
      <el-table
        :data="reviewListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @filter-change="reviewListFilter"
        border
        stripe
      >
        <el-table-column
          prop="type"
          label="类型"
          width="80"
          :filters="[{ text: '评审类', value: 'review' }, { text: '缺陷类', value: 'defect' }]"
          filter-placement="bottom-end"
          :column-key="'type'"
        >
          >
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.type == 'review'" effect="plain">评审</el-tag>
            <el-tag type="danger" v-else effect="plain">缺陷</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150">
          <template slot="header" slot-scope="scope">
            <!-- !!!!!!!!!!!!!别改这里 会导致input无法输入 -->
            <el-input
              class="search-set"
              v-model="searchProvider"
              size="mini"
              placeholder="报告人员"
              clearable
              @change="getBySearchProvider()"
              @clear="getBySearchSolver()"
            ></el-input>
          </template>
          <template slot-scope="scope">{{ scope.row.providerId }}</template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="190"></el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="100"
          :filters="[{ text: '已处理', value: 1 }, { text: '待处理', value: 0 }]"
          filter-placement="bottom-end"
          :column-key="'state'"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 1" type="success">已处理</el-tag>
            <el-tag v-if="scope.row.state === 0" type="warning">待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="155">
          <template slot="header" slot-scope="scope">
            <!-- !!!!!!!!!!!!!别改这里 会导致input无法输入 -->
            <el-input
              class="search-set"
              v-model="searchSolver"
              size="mini"
              placeholder="处理人员"
              clearable
              @change="getBySearchSolver()"
              @clear="getBySearchProvider()"
            ></el-input>
          </template>
          <template slot-scope="scope">
            <div v-if="scope.row.solverId == null">
              <el-tag type="info">暂无</el-tag>
              <el-button
                v-show="((projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject.indexOf('开发') != -1)"
                type="primary"
                size="small"
                plain
                @click="processReport(scope.row)"
              >点击处理</el-button>
            </div>
            <span v-else>{{ scope.row.solverId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="200"></el-table-column>
        <el-table-column label="链接" width="190">
          <template slot-scope="scope">{{ scope.row.link }}</template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[2, 4, 6, 8, 10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 报告评审/缺陷 -->
      <el-dialog title="报告评审/缺陷" :visible.sync="reportVisible" @close="reportDialogClosed">
        <el-form
          :model="reportInfo"
          label-width="100px"
          label-position="left"
          :rules="reportFormRules"
          ref="reportFormRef"
        >
          <el-form-item label="项目ID" prop="projectId">
            <el-input
              :placeholder="projectBasicId"
              v-model="projectBasicId"
              :disabled="true"
              style="width: 217px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="reportInfo.type" clearable placeholder="请选择报告类型">
              <el-option
                v-for="item in reportTypeOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="报告人员" prop="providerId">
            <el-input
              :placeholder="personId"
              v-model="personId"
              :disabled="true"
              style="width: 217px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入评审/缺陷描述"
              clearable
              v-model="reportInfo.description"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input
              type="textarea"
              autosize
              placeholder="请输入可用链接"
              clearable
              v-model="reportInfo.link"
              style="width: 400px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitReport()">确认提交</el-button>
          <el-button @click="reportVisible = false">取消</el-button>
        </div>
      </el-dialog>
      <!-- 处理评审/缺陷 -->
      <el-dialog title="处理评审/缺陷" :visible.sync="processVisible" @close="processDialogClosed">
        <el-form
          :model="processInfo"
          label-width="100px"
          label-position="left"
          :rules="processFormRules"
          ref="processFormRef"
        >
          <el-form-item label="项目ID" prop="projectId">
            <el-input
              :placeholder="projectBasicId"
              v-model="projectBasicId"
              :disabled="true"
              style="width: 217px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-input
              :placeholder="processInfo.type"
              v-model="processInfo.type"
              :disabled="true"
              style="width: 217px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="报告人员" prop="providerId">
            <el-input
              :placeholder="processInfo.providerId"
              v-model="processInfo.providerId"
              :disabled="true"
              style="width: 217px;"
            ></el-input>
          </el-form-item>
          <el-form-item label="描述" prop="description">
            <el-input
              type="textarea"
              autosize
              :placeholder="processInfo.description"
              clearable
              v-model="processInfo.description"
              style="width: 400px"
            ></el-input>
          </el-form-item>
          <el-form-item label="链接" prop="link">
            <el-input
              type="textarea"
              autosize
              :placeholder="processInfo.link"
              clearable
              v-model="processInfo.link"
              style="width: 400px;"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitProcess()">确认处理</el-button>
          <el-button @click="processVisible = false">取消</el-button>
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
      reviewList: [],
      reviewListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      searchProvider: "",
      searchSolver: "",
      reportInfo: {
        projectId: "",
        type: "",
        providerId: "",
        state: 0,
        description: "",
        date: "",
        link: ""
      },
      reportTypeOpts: [
        { label: "评审", value: "review" },
        { label: "缺陷", value: "defect" }
      ],
      reportVisible: false,
      reportFormRules: {
        type: [{ required: true, message: "请选择报告类型", trigger: "blur" }],
        description: [
          { required: true, message: "请添加报告描述", trigger: "blur" }
        ]
      },
      processInfo: {
        reviewDefectId: "",
        projectId: "",
        type: "",
        providerId: "",
        state: 0,
        solverId: "",
        description: "",
        date: "",
        link: ""
      },
      processVisible: false,
      processFormRules: {},
      myFilters: { state: [], type: [] }
    };
  },
  created() {
    this.getReviewList();
    
  },
  computed: {
    ...mapState(["projectBasicId"]),
    ...mapState(["personId"]),
    ...mapState(["roleInProject"]),
    ...mapState(["projectBasicState"])
  },
  methods: {
    getReviewList() {
      axios
        .get("/api/review_defect/project/" + this.projectBasicId)
        .then(response => {
          if (response.data.code === 0) {
            console.log(response.data.data);
            this.reviewList = response.data.data;
            this.total = this.reviewList.length;
            this.reviewListCopy = this.reviewList;
            this.reviewListFilter(this.myFilters);
          } else {
            this.$message.error("获取评审缺陷列表失败！");
          }
        });
    },
    getBySearchProvider() {
      if (this.searchProvider !== "") {
        axios
          .get("/api/review_defect/provider/" + this.searchProvider)
          .then(response => {
            if (response.data.code === 0) {
              console.log("ByProvider");
              console.log(response.data.data);
              this.reviewListCopy = response.data.data;
              this.reviewListCopy.forEach(item => {
                if (item.projectId != this.projectBasicId) {
                  this.reviewListCopy.splice(
                    this.reviewListCopy.indexOf(item),
                    1
                  );
                }
              });

              this.total = this.reviewListCopy.length;
            } else {
              this.$message.error("获取评审缺陷列表失败！");
            }
          });
      } else {
        this.getReviewList();
      }
    },
    providerBlur(searchProvider) {
      searchProvider = "";
      this.getReviewList();
    },
    solverBlur(searchSolver) {
      searchSolver = "";
      this.getReviewList();
    },
    getBySearchSolver() {
      if (this.searchSolver !== "") {
        axios
          .get("/api/review_defect/solver/" + this.searchSolver)
          .then(response => {
            if (response.data.code === 0) {
              console.log("BySolver");
              console.log(response.data.data);
              this.reviewListCopy = response.data.data;
              this.reviewListCopy.forEach(item => {
                if (item.projectId != this.projectBasicId) {
                  this.reviewListCopy.splice(
                    this.reviewListCopy.indexOf(item),
                    1
                  );
                }
              });
              this.total = this.reviewListCopy.length;
            } else {
              this.$message.error("获取评审缺陷列表失败！");
            }
          });
      } else {
        this.getReviewList();
      }
    },
    // 新建项目的评审缺陷
    submitReport() {
      this.$refs.reportFormRef.validate(async valid => {
        if (!valid) return;
        this.reportInfo.projectId = this.projectBasicId;
        this.reportInfo.providerId = this.personId;
        console.log(this.reportInfo);
        axios
          .post("/api/review_defect", JSON.stringify(this.reportInfo), {
            headers: {
              "Content-Type": "application/json;charset=UTF-8"
            }
          })
          .then(response => {
            console.log(response.data);
            this.reportVisible = false;
            if (response.data.code === 0) {
              this.$message.success("添加报告成功！");
              this.getReviewList();
            }
          });
      });
    },
    // 项目内处理评审缺陷
    processReport(objData) {
      this.processInfo = objData;
      console.log(this.processInfo);
      this.processVisible = true;
    },
    submitProcess() {
      axios
        .put("/api/review_defect", JSON.stringify(this.processInfo), {
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code === 0) {
            this.processVisible = false;
            this.$message.success("处理报告成功！");
            this.getReviewList();
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // filterTypeOrState(value, row, column) {
    //   const property = column["property"];
    //   return row[property] === value;
    // },
    reviewListFilter(filters) {
      console.log(filters);
      if (filters.state) {
        this.myFilters.state = filters.state;
      }
      if (filters.type) {
        this.myFilters.type = filters.type;
      }

      if (this.myFilters.state.length == 0) {
        this.reviewListCopy = this.reviewList;
      } else {
        this.reviewListCopy = this.reviewList.filter(
          item => this.myFilters.state.indexOf(item.state) != -1
        );
      }

      if (this.myFilters.type.length != 0) {
        this.reviewListCopy = this.reviewListCopy.filter(
          item => this.myFilters.type.indexOf(item.type) != -1
        );
      }

      this.total = this.reviewListCopy.length;
      this.currentPage = 1;
      this.pageSize = 6;
    },
    reportDialogClosed() {
      this.$refs.reportFormRef.resetFields();
    },
    processDialogClosed() {
      this.$refs.processFormRef.resetFields();
    }
  }
};
</script>

<style scoped>
.search-set {
  width: 120px !important;
}

.el-input--suffix .el-input__inner {
  padding-right: 0px !important;
}

.ml-set {
  margin-left: 20px;
}

.el-dialog__body {
  padding: 0 10px !important;
}

.el-form-item__content {
  margin-left: 30px !important;
}

.el-form-item__label {
  padding: 0;
}

.el-table {
  margin: 15px 0;
}

.el-table-column {
  position: relative;
}

.to-detail {
  background-color: #909399;
  position: absolute;
  right: 15px;
  top: 70%;
  transform: translateY(-50%);
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>