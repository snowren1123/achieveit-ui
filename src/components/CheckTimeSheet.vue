<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-card shadow="always">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <div style="font-size:18px">待审核工时列表</div>
        </el-col>
      </el-row>
      <!-- 工时列表区域 -->
      <el-table
        :data="timesheetListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @sort-change="sortTimesheetList"
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
        <el-table-column prop="state" label="状态" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state == '已提交'">{{scope.row.state}}</el-tag>
          </template>
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
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[6, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </el-main>
</template>

<script>
import axios from "axios";
import qs from "qs";
import { mapState } from "vuex";

export default {
  data() {
    return {
      timesheetList: [],
      timesheetListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      col: {}
    };
  },
  created() {
    this.getTimeSheetList();
  },
  computed: {
    ...mapState(["personId"]),
    checkTimeSheetTotal: {
      //需要监听的数据
      get() {
        return this.$store.state.checkTimeSheetTotal;
      },
      set(val) {}
    }
  },
  watch: {
    checkTimeSheetTotal(newVal, oldVal) {}
  },
  methods: {
    getTimeSheetList() {
      axios.get("/api/timesheet/boss").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.timesheetList = response.data.data;
          this.timesheetListCopy = this.timesheetList;
          this.total = this.timesheetListCopy.length;
          this.sortTimesheetList(this.col);
        } else {
          this.$message.error("获取待审核工时列表失败！");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
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
      this.submitTimeSheet(temp);
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
      this.submitTimeSheet(temp);
    },
    submitTimeSheet(temp) {
      axios
        .post(
          "/api/timesheet/confirm",
          qs.stringify({ timesheetId: temp.timesheetId, state: temp.state })
        )
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.getTimeSheetList();
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
    sortTimesheetList(column) {
      this.col = column;
      this.timesheetListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.timesheetListCopy.reverse();
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
  margin: 15px 0;
}

.el-table-column {
  position: relative;
}

p {
  font-size: 13px;
  line-height: 1.7;
}

.el-card {
  padding-top: 10px;
}
</style>