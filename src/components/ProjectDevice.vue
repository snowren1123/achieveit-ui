<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-tabs type="border-card" style="postion:relative">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-s-platform"></i> 项目设备
        </span>
        <el-table
          :data="deviceListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          @filter-change="filterDeviceList"
          @sort-change="sortDevice"
          border
          stripe
        >
          <el-table-column prop="deviceId" label="设备ID" sortable="custom"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="checkinDate" label="分配日期" sortable="custom">
            <template slot-scope="scope">{{scope.row.checkinDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column
            prop="returnDate"
            label="归还日期"
            :filters="[{ text: '已归还', value: '已归还' },{ text: '未归还', value: '未归还' }]"
            :column-key="'returnDate'"
            :filter-multiple="false"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.returnDate != null">{{scope.row.returnDate.slice(0,10)}}</span>
              <span v-else>暂未归还</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalUseTime" label="使用期限" sortable="custom">
            <template slot-scope="scope">{{scope.row.totalUseTime}}个月</template>
          </el-table-column>
          <el-table-column prop="lastVerifyDate" label="上次核对" sortable="custom">
            <template slot-scope="scope">{{scope.row.lastVerifyDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column prop="deviceManagerId" label="使用者ID"></el-table-column>
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

      <el-tab-pane label="我的项目设备">
        <span slot="label">
          <i class="el-icon-mobile-phone"></i> 我的项目设备
        </span>
        <el-table
          :data="myDeviceListCopy.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
          @filter-change="filterMyDeviceList"
          @sort-change="sortMyDevice"
          border
          stripe
        >
          <el-table-column prop="deviceId" label="设备ID" sortable="custom"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="checkinDate" label="分配日期" sortable="custom">
            <template slot-scope="scope">{{scope.row.checkinDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column
            prop="returnDate"
            label="归还日期"
            :filters="[{ text: '已归还', value: '已归还' },{ text: '未归还', value: '未归还' }]"
            :column-key="'returnDate'"
            :filter-multiple="false"
            filter-placement="bottom-end"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.returnDate != null">{{scope.row.returnDate.slice(0,10)}}</span>
              <span v-else>暂未归还</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalUseTime" label="使用期限" sortable="custom">
            <template slot-scope="scope">{{scope.row.totalUseTime}}个月</template>
          </el-table-column>
          <el-table-column prop="lastVerifyDate" label="上次核对" sortable="custom">
            <template slot-scope="scope">{{scope.row.lastVerifyDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column label="操作" width="95">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="核对"
                placement="top"
                v-if="scope.row.returnDate == null"
              >
                <el-button
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  circle
                  plain
                  @click="checkDevice(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="归还"
                placement="top"
                v-if="scope.row.returnDate == null"
              >
                <el-button
                  type="danger"
                  icon="el-icon-check"
                  size="mini"
                  circle
                  plain
                  @click="returnDevice(scope.row)"
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

      <el-tab-pane label="分配设备">
        <span slot="label">
          <i class="el-icon-circle-plus-outline"></i> 分配设备
        </span>
        <el-form
          :model="newDeviceInfo"
          label-width="100px"
          label-position="left"
          :rules="addDialogFormRules"
          ref="addDialogFormRef"
        >
          <el-form-item label="可选设备" prop="device">
            <el-select v-model="newDeviceInfo.deviceId" placeholder="请选择">
              <el-option
                v-for="item in newDeviceList"
                :key="item.deviceId"
                :label="item.type"
                :value="item.deviceId"
              >
                <span style="float: left">{{ item.deviceId }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目成员" prop="deviceManagerId">
            <el-select v-model="newDeviceInfo.deviceManagerId" clearable placeholder="请选择项目成员">
              <el-option
                v-for="item in projectMembers"
                :key="item.employeeId"
                :label="item.employeeId"
                :value="item.employeeId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="使用期限(月)" prop="totalUseTime">
            <el-input
              v-model="newDeviceInfo.totalUseTime"
              placeholder="请输入使用期限"
              type="number"
              style="width:217px;"
            ></el-input>
          </el-form-item>
          <!-- 
          <el-form-item label="分配日期" prop="checkinDate">
            <el-date-picker
              type="datetime"
              placeholder="分配日期"
              v-model="newDeviceInfo.checkinDate"
              style="width:217px;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="上次核对" prop="lastVerifyDate">
            <el-date-picker
              type="datetime"
              placeholder="上次核对"
              v-model="newDeviceInfo.lastVerifyDate"
              style="width:217px;"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          -->
        </el-form>
        <el-button type="primary" @click="submitForm()">确认</el-button>
      </el-tab-pane>
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
      // 分页数据
      deviceList: [],
      deviceListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0,
      col: {},
      myFilters: [],

      myDeviceList: [],
      myDeviceListCopy: [],
      currentPage1: 1,
      pageSize1: 6,
      total1: 0,
      col1: {},
      myFilters1: [],

      // 分配设备数据
      addDialogFormRules: {
        deviceManagerId: [
          { required: true, message: "请选择成员", trigger: "change" }
        ],
        totalUseTime: [
          { required: true, message: "请输入使用期限", trigger: "change" }
        ]
      },
      newDeviceList: [],
      projectMembers: [],
      newDeviceInfo: {
        deviceId: "",
        type: "",
        totalUseTime: "",
        checkinDate: null,
        lastVerifyDate: null
      }
    };
  },
  created() {
    this.getDeviceList();
    this.getMyDeviceList();
    this.getNewDevice();
    this.getProjectMembers();
  },
  computed: {
    ...mapState(["projectBasicId", "personId"])
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

    // 表格数据方法
    getDeviceList() {
      axios.get("/api/device/project/" + this.projectBasicId).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.deviceList = response.data.data;
          this.deviceListCopy = this.deviceList;
          this.total = this.deviceListCopy.length;
          this.filterDeviceList(this.myFilters);
        } else {
          this.$message.error("获取项目设备列表失败！");
        }
      });
    },
    getMyDeviceList() {
      axios.get("/api/device/owner/" + this.personId).then(response => {
        console.log(this.personId);
        console.log(response.data);
        if (response.data.code === 0) {
          this.myDeviceList = response.data.data;
          this.myDeviceList = this.myDeviceList.filter(
            item => item.projectId == this.projectBasicId
          );
          this.myDeviceListCopy = this.myDeviceList;
          this.total1 = this.myDeviceListCopy.length;
          this.filterMyDeviceList(this.myFilters1);
        } else {
          this.$message.error("获取我的设备列表失败！");
        }
      });
    },

    // 分配设备方法
    getNewDevice() {
      axios.get("/api/device/new").then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.newDeviceList = response.data.data;
        } else {
          this.$message.error("获取可选设备列表失败！");
        }
      });
    },
    getProjectMembers() {
      axios.get("/api/member/" + this.projectBasicId).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.projectMembers = response.data.data;
        } else {
          this.$message.error("获取可选项目成员失败！");
        }
      });
    },
    submitForm() {
      var temp = this.newDeviceList.find(
        item => item.deviceId == this.newDeviceInfo.deviceId
      );
      this.newDeviceInfo.type = temp.type;
      this.newDeviceInfo.projectId = this.projectBasicId;

      console.log(this.newDeviceInfo);
      return;
      axios.post("/api/device", this.newDeviceInfo).then(response => {
        console.log(response);
        if (response.data.code == 0) {
          this.$message.success("分配设备成功");
          this.$refs.addDialogFormRef.resetFields();
          this.newDeviceInfo.deviceId = "";
          this.getDeviceList();
          this.getMyDeviceList();
          this.getNewDevice();
        } else {
          this.$message.error("分配设备失败");
        }
      });
    },

    // 核对设备
    checkDevice(tempDevice) {
      axios.put("/api/device/check", tempDevice).then(response => {
        console.log(response);
        if (response.data.code == 0) {
          this.$message.success("核对设备成功");
          this.getDeviceList();
          this.getMyDeviceList();
        } else {
          this.$message.error("核对设备失败");
        }
      });
    },

    // 归还设备
    returnDevice(tempDevice) {
      axios.put("/api/device/return", tempDevice).then(response => {
        console.log(response);
        if (response.data.code == 0) {
          this.$message.success("归还设备成功");
          this.getDeviceList();
          this.getMyDeviceList();
        } else {
          this.$message.error("归还设备失败");
        }
      });
    },

    // 设备排序
    sortDevice(column) {
      this.col = column;
      this.deviceListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.deviceListCopy.reverse();
      }
    },
    sortMyDevice(column) {
      this.col1 = column;
      this.myDeviceListCopy.sort(this.$compare(this.col1["prop"]));
      if (this.col1["order"] == "descending") {
        this.myDeviceListCopy.reverse();
      }
    },

    // 设备筛选
    filterDeviceList(filters) {
      this.myFilters = filters;
      console.log(filters);
      if (this.myFilters.returnDate) {
        if (this.myFilters.returnDate.length == 0) {
          this.deviceListCopy = this.deviceList;
        } else if (this.myFilters.returnDate[0] == "已归还") {
          this.deviceListCopy = this.deviceList.filter(
            item => item.returnDate != null
          );
        } else if (this.myFilters.returnDate[0] == "未归还") {
          this.deviceListCopy = this.deviceList.filter(
            item => item.returnDate == null
          );
        }
        this.total = this.deviceListCopy.length;
        this.pageSize = 6;
        this.currentPage = 1;
      }
      this.sortDevice(this.col);
    },
    filterMyDeviceList(filters) {
      this.myFilters = filters;
      console.log(filters);
      if (this.myFilters.returnDate) {
        if (this.myFilters.returnDate.length == 0) {
          this.myDeviceListCopy = this.myDeviceList;
        } else if (this.myFilters.returnDate[0] == "已归还") {
          this.myDeviceListCopy = this.myDeviceList.filter(
            item => item.returnDate != null
          );
        } else if (this.myFilters.returnDate[0] == "未归还") {
          this.myDeviceListCopy = this.myDeviceList.filter(
            item => item.returnDate == null
          );
        }
        this.total1 = this.myDeviceListCopy.length;
        this.pageSize1 = 6;
        this.currentPage1 = 1;
      }
      this.sortMyDevice(this.col1);
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