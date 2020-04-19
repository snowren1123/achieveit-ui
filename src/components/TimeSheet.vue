<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-tabs type="border-card" style="postion:relative">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-s-platform"></i> 我的项目工时
        </span>
        <el-table
          :data="timesheetListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          @filter-change="filterTimesheetList"
          @sort-change="sortTimesheetList"
          stripe
        >
          <el-table-column prop="projectId" label="项目ID" sortable="custom"></el-table-column>
          <el-table-column label="功能模块">
            <template
              slot-scope="scope"
            >{{scope.row.primaryFunction}} / {{scope.row.secondaryFunction}}</template>
          </el-table-column>
          <el-table-column label="活动范围">
            <template
              slot-scope="scope"
            >{{scope.row.primaryActivity}} / {{scope.row.secondaryActivity}}</template>
          </el-table-column>
          <el-table-column prop="date" label="日期" sortable="custom"></el-table-column>
          <el-table-column label="时间">
            <template
              slot-scope="scope"
            >{{scope.row.startTime.slice(0,5)}} 至 {{scope.row.endTime.slice(0,5)}}</template>
          </el-table-column>
          <el-table-column
            prop="state"
            label="状态"
            :filters="[{ text: '草稿', value: '草稿' }, { text: '已提交', value: '已提交' },{ text: '已确认', value: '已确认' },{ text: '打回', value: '打回' }]"
            :column-key="'state'"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.state == '草稿'" type="warning">{{scope.row.state}}</el-tag>
              <el-tag v-if="scope.row.state == '已提交'">{{scope.row.state}}</el-tag>
              <el-tag v-if="scope.row.state == '已确认'" type="success">{{scope.row.state}}</el-tag>
              <el-tag v-if="scope.row.state == '打回'" type="danger">{{scope.row.state}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="135">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="修改"
                placement="top"
                v-if="scope.row.state == '草稿' || scope.row.state == '打回'"
              >
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  plain
                  @click="editTimeSheet(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="提交"
                placement="top"
                v-if="scope.row.state == '草稿' || scope.row.state == '打回'"
              >
                <el-button
                  type="danger"
                  icon="el-icon-check"
                  size="mini"
                  circle
                  plain
                  @click="submitTimeSheet(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除"
                placement="top"
                v-if="scope.row.state == '草稿'"
              >
                <el-button
                  class="el-icon-delete"
                  type="danger"
                  size="mini"
                  circle
                  plain
                  @click="deleteTimeSheet(scope.row)"
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
      </el-tab-pane>

      <el-tab-pane label="待审批工时">
        <span slot="label">
          <i class="el-icon-mobile-phone"></i> 待审批工时
        </span>
        <el-table
          :data="timesheetListCopy1.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
          @sort-change="sortTimesheetList1"
          stripe
        >
          <el-table-column prop="employeeId" label="员工ID" width="90" sortable="custom"></el-table-column>
          <el-table-column prop="projectId" label="项目ID" width="140" sortable="custom"></el-table-column>
          <el-table-column label="功能模块">
            <template
              slot-scope="scope"
            >{{scope.row.primaryFunction}} / {{scope.row.secondaryFunction}}</template>
          </el-table-column>
          <el-table-column label="活动范围">
            <template
              slot-scope="scope"
            >{{scope.row.primaryActivity}} / {{scope.row.secondaryActivity}}</template>
          </el-table-column>
          <el-table-column prop="date" label="日期" width="120" sortable="custom"></el-table-column>
          <el-table-column label="时间" width="140">
            <template
              slot-scope="scope"
            >{{scope.row.startTime.slice(0,5)}} 至 {{scope.row.endTime.slice(0,5)}}</template>
          </el-table-column>
          <el-table-column label="操作" width="95">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" content="通过" placement="top">
                <el-button
                  type="success"
                  icon="el-icon-check"
                  size="mini"
                  circle
                  plain
                  @click="checkTimeSheet(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="打回" placement="top">
                <el-button
                  type="danger"
                  icon="el-icon-close"
                  size="mini"
                  circle
                  plain
                  @click="rejectTimeSheet(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[6, 10, 15, 20]"
          :page-size="pageSize1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total1"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="新增工时">
        <span slot="label">
          <i class="el-icon-circle-plus-outline"></i>新增工时
        </span>
        <el-form
          :model="timesheetInfo"
          label-width="100px"
          label-position="left"
          :rules="addDialogFormRules"
          ref="addDialogFormRef"
        >
          <el-form-item label="一级功能" prop="primaryFunction">
            <el-select
              v-model="timesheetInfo.primaryFunction"
              clearable
              placeholder="请选择一级功能"
              @change="getSecondaryFunctions"
              @clear="clearPrimaryFunctions"
            >
              <el-option v-for="item in primaryFunctions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级功能" prop="secondaryFunction">
            <el-select v-model="timesheetInfo.secondaryFunction" clearable placeholder="请选择二级功能">
              <el-option v-for="item in secondaryFunctions" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="一级活动" prop="primaryActivity">
            <el-select
              v-model="timesheetInfo.primaryActivity"
              clearable
              placeholder="请选择一级活动"
              @change="getSecondaryActivities"
              @clear="clearPrimaryActivities"
            >
              <el-option v-for="item in primaryActivities" :key="item" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="二级活动" prop="secondaryActivity">
            <el-select v-model="timesheetInfo.secondaryActivity" clearable placeholder="请选择二级活动">
              <el-option
                v-for="item in secondaryActivities"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作日期" prop="date">
            <el-date-picker
              v-model="timesheetInfo.date"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="时间范围" prop="time">
            <el-time-picker
              v-model="timesheetInfo.startTime"
              placeholder="开始时间"
              value-format="HH:mm:ss"
            ></el-time-picker>
            <el-time-picker
              v-model="timesheetInfo.endTime"
              placeholder="结束时间"
              value-format="HH:mm:ss"
            ></el-time-picker>
          </el-form-item>
        </el-form>
        <el-button type="warning" @click="submitToBoss()">确认提交</el-button>
        <el-button type="primary" @click="saveAsDraft()">存为草稿</el-button>
      </el-tab-pane>
    </el-tabs>

    <!-- 修改工时对话框 -->
    <el-dialog title="修改工时对话框" :visible.sync="addDialogFormVisible" @close="addDialogClosed">
      <el-form
        :model="timesheetInfo"
        label-width="100px"
        label-position="left"
        :rules="addDialogFormRules"
        ref="addDialogFormRef"
      >
        <el-form-item label="一级功能" prop="primaryFunction">
          <el-select
            v-model="timesheetInfo.primaryFunction"
            clearable
            placeholder="请选择一级功能"
            @change="getSecondaryFunctions"
            @clear="clearPrimaryFunctions"
          >
            <el-option v-for="item in primaryFunctions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级功能" prop="secondaryFunction">
          <el-select v-model="timesheetInfo.secondaryFunction" clearable placeholder="请选择二级功能">
            <el-option v-for="item in secondaryFunctions" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一级活动" prop="primaryActivity">
          <el-select
            v-model="timesheetInfo.primaryActivity"
            clearable
            placeholder="请选择一级活动"
            @change="getSecondaryActivities"
            @clear="clearPrimaryActivities"
          >
            <el-option v-for="item in primaryActivities" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级活动" prop="secondaryActivity">
          <el-select v-model="timesheetInfo.secondaryActivity" clearable placeholder="请选择二级活动">
            <el-option v-for="item in secondaryActivities" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作日期" prop="date">
          <el-date-picker
            v-model="timesheetInfo.date"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="时间范围" prop="time">
          <el-time-picker
            v-model="timesheetInfo.startTime"
            placeholder="开始时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
          <el-time-picker
            v-model="timesheetInfo.endTime"
            placeholder="结束时间"
            value-format="HH:mm:ss"
          ></el-time-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="submitToBoss()">确认提交</el-button>
        <el-button type="primary" @click="saveAsDraft()">存为草稿</el-button>
        <el-button @click="addDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      // 分页数据
      timesheetList: [],
      timesheetListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      col: {},

      // 新增工时的数据
      primaryFunctions: [],
      secondaryFunctions: [],
      primaryActivities: [],
      secondaryActivities: [],
      flag: false,
      addDialogFormVisible: false,
      addDialogFormRules: {
        projectId: [
          { required: true, message: "请选择项目ID", trigger: "change" }
        ],
        primaryFunction: [
          { required: true, message: "请选择一级功能", trigger: "change" }
        ],
        secondaryFunction: [
          { required: true, message: "请选择二级功能", trigger: "change" }
        ],
        primaryActivity: [
          { required: true, message: "请选择一级活动", trigger: "change" }
        ],
        secondaryActivity: [
          { required: true, message: "请选择二级活动", trigger: "change" }
        ],
        date: [
          {
            type: "string",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      timesheetInfo: {
        projectId: "",
        primaryFunction: "",
        secondaryFunction: "",
        primaryActivity: "",
        secondaryActivity: "",
        date: "",
        startTime: "",
        endTime: "",
        state: ""
      },
      myFilters: [],

      timesheetList1: [],
      timesheetListCopy1: [],
      currentPage1: 1,
      pageSize1: 6,
      total1: 0,
      col1: {}
    };
  },
  created() {
    this.timesheetInfo.projectId = this.projectBasicId;
    this.getTimeSheetList();
    this.getTimeSheetList1();
    this.getPrimaryFunctions();
    this.getPrimaryActivities();
  },
  computed: {
    ...mapState([
      "projectBasicId",
      "personId",
      "roleInProject",
      "projectBasicState"
    ])
  },
  methods: {
    // 分页方法
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },

    getTimeSheetList() {
      axios.get("/api/timesheet/user").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.timesheetList = response.data.data;
          this.timesheetListCopy = this.timesheetList;
          this.total = this.timesheetListCopy.length;
          this.filterTimesheetList(this.myFilters);
        } else {
          this.$message.error("获取工时列表失败！");
        }
      });
    },
    getTimeSheetList1() {
      axios.get("/api/timesheet/boss").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.timesheetList1 = response.data.data;
          this.timesheetListCopy1 = this.timesheetList1;
          this.total1 = this.timesheetListCopy1.length;
          this.sortTimesheetList1(this.col1);
        } else {
          this.$message.error("获取待审核工时列表失败！");
        }
      });
    },
    // 新增工时的方法
    clearPrimaryFunctions() {
      this.timesheetInfo.secondaryFunction = "";
      this.secondaryFunctions = [];
    },
    getPrimaryFunctions() {
      if (!this.flag) {
        this.timesheetInfo.primaryFunction = "";
        this.secondaryFunctions = [];
        this.timesheetInfo.secondaryFunction = "";
      }
      axios
        .get("/api/timesheet/primaryfunction", {
          params: {
            projectId: this.timesheetInfo.projectId
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.primaryFunctions = response.data.data;
          } else {
            this.$message.error("获取可选一级功能失败！");
          }
        });
    },
    getSecondaryFunctions() {
      if (!this.flag) this.timesheetInfo.secondaryFunction = "";
      axios
        .get("/api/timesheet/secondaryfunction", {
          params: {
            projectId: this.timesheetInfo.projectId,
            primaryFunction: this.timesheetInfo.primaryFunction
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.secondaryFunctions = response.data.data;
          } else {
            this.$message.error("获取可选二级功能失败！");
          }
        });
    },
    getPrimaryActivities() {
      axios.get("/api/timesheet/primaryactivity").then(response => {
        console.log(response);
        if (response.data.code === 0) {
          this.primaryActivities = response.data.data;
        } else {
          this.$message.error("获取可选一级活动失败！");
        }
      });
    },
    clearPrimaryActivities() {
      this.timesheetInfo.secondaryActivity = "";
      this.secondaryActivities = [];
    },
    getSecondaryActivities() {
      if (!this.flag) this.timesheetInfo.secondaryActivity = "";
      axios
        .get("/api/timesheet/secondaryactivity", {
          params: {
            primaryActivity: this.timesheetInfo.primaryActivity
          }
        })
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.secondaryActivities = response.data.data;
          } else {
            this.$message.error("获取可选二级活动失败！");
          }
        });
    },
    addTimeSheet() {
      this.clearProjectsIds();
      this.clearPrimaryActivities();
      this.getPrimaryFunctions();
      this.getPrimaryActivities();
      this.addDialogFormVisible = true;
    },
    addDialogClosed() {
      this.$refs.addDialogFormRef.resetFields();
      for (var item in this.timesheetInfo) {
        this.timesheetInfo[item] = "";
      }
    },
    submitToBoss() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        this.timesheetInfo.state = "已提交";
        this.submitForm(true);
      });
    },
    saveAsDraft() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;
        this.timesheetInfo.state = "草稿";
        this.submitForm(false);
      });
    },
    submitForm(state) {
      console.log(this.timesheetInfo);
      axios
        .post("/api/timesheet", qs.stringify(this.timesheetInfo))
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
            this.getTimeSheetList1();
            this.getPrimaryFunctions();
            this.getPrimaryActivities();
            this.addDialogClosed();
            console.log(this.timesheetInfo);
            if (state)
              this.$store.commit(
                "setCheckTimeSheetTotal",
                this.checkTimeSheetTotal + 1
              );
            this.$message.success("成功！");
          } else {
            this.$message.error(response.data.data);
          }
        });
      this.addDialogFormVisible = false;
    },

    // 表格每列按钮修改工时
    editTimeSheet(temp) {
      this.flag = true;
      Object.assign(this.timesheetInfo, temp);
      this.getPrimaryFunctions();
      this.getSecondaryFunctions();
      this.getPrimaryActivities();
      this.getSecondaryActivities();
      this.addDialogFormVisible = true;
      this.flag = false;
    },
    // 表格每列按钮提交工时
    async submitTimeSheet(temp) {
      const confirmResult = await this.$confirm(
        "此操作将提交该工时记录，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消提交！");
      }

      temp.state = "已提交";
      axios.post("/api/timesheet", qs.stringify(temp)).then(response => {
        console.log(response);
        if (response.data.code === 0) {
          this.getTimeSheetList();
          this.getTimeSheetList1();
          this.getPrimaryFunctions();
          this.getPrimaryActivities();
          this.addDialogClosed();
          this.$store.commit(
            "setCheckTimeSheetTotal",
            this.checkTimeSheetTotal + 1
          );
          this.$message.success("提交成功！");
        } else {
          this.getTimeSheetList();
          this.getTimeSheetList1();
          this.getPrimaryFunctions();
          this.getPrimaryActivities();
          this.addDialogClosed();
          this.$message.error(response.data.data);
        }
      });
    },

    // 表格筛选功能
    filterTimesheetList(filters) {
      this.myFilters = filters;
      if (this.myFilters.state) {
        if (this.myFilters.state.length == 0) {
          this.timesheetListCopy = this.timesheetList;
        } else {
          this.timesheetListCopy = this.timesheetList.filter(
            item => this.myFilters.state.indexOf(item.state) != -1
          );
        }
        this.total = this.timesheetListCopy.length;
        this.pageSize = 6;
        this.currentPage = 1;
      }
      this.sortTimesheetList(this.col);
    },

    // 表格排序功能
    sortTimesheetList(column) {
      this.col = column;
      this.timesheetListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.timesheetListCopy.reverse();
      }
    },

    // 删除工时的操作
    async deleteTimeSheet(row) {
      const confirmResult = await this.$confirm(
        "此操作将删除该工时记录，是否继续？",
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
        .delete("/api/timesheet?timesheetId=" + row.timesheetId)
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
            this.$message.success("删除成功！");
          } else {
            this.$message.error("删除失败！");
          }
        });
    },

    // 审核工时
    async checkTimeSheet(temp) {
      const confirmResult = await this.$confirm(
        "此操作将审核通过该工时记录，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消审核！");
      }

      temp.state = "已确认";
      this.submitTimeSheet1(temp);
    },
    async rejectTimeSheet(temp) {
      const confirmResult = await this.$confirm(
        "此操作将打回该工时记录，是否继续？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作！");
      }

      temp.state = "打回";
      this.submitTimeSheet1(temp);
    },
    submitTimeSheet1(temp) {
      axios
        .post(
          "/api/timesheet/confirm",
          qs.stringify({ timesheetId: temp.timesheetId, state: temp.state })
        )
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
            this.getTimeSheetList1();
            this.$store.commit(
              "setCheckTimeSheetTotal",
              this.checkTimeSheetTotal - 1
            );
            this.$message.success("操作成功！");
          } else {
            this.$message.error(response.data.data);
          }
        });
    },
    // 表格排序功能
    sortTimesheetList1(column) {
      this.col1 = column;
      this.timesheetListCopy1.sort(this.$compare(this.col1["prop"]));
      if (this.col1["order"] == "descending") {
        this.timesheetListCopy1.reverse();
      }
    }
  }
};
</script>

<style scoped>
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
  margin-bottom: 15px;
}

.el-table-column {
  position: relative;
}

p {
  font-size: 13px;
  line-height: 1.7;
}
</style>