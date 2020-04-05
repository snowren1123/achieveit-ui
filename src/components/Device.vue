<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-tabs type="border-card" style="postion:relative">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-s-platform"></i> 项目设备
        </span>
        <el-table
          :data="deviceList.slice((currentPage-1)*pageSize,currentPage*pageSize)"
          border
          stripe
        >
          <el-table-column prop="deviceId" label="设备ID"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="checkinDate" label="分配日期">
            <template slot-scope="scope">{{scope.row.checkinDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column prop="returnDate" label="归还日期">
            <template slot-scope="scope">
              <span v-if="scope.row.returnDate != null">{{scope.row.returnDate.slice(0,10)}}</span>
              <span v-else>暂未归还</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalUseTime" label="使用期限">
            <template slot-scope="scope">{{scope.row.totalUseTime}}个月</template>
          </el-table-column>
          <el-table-column prop="lastVerifyDate" label="上次核对">
            <template slot-scope="scope">{{scope.row.lastVerifyDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column prop="deviceManagerId" label="管理者ID"></el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 4, 6, 10]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-tab-pane>

      <el-tab-pane label="我的设备">
        <span slot="label">
          <i class="el-icon-mobile-phone"></i> 我的设备
        </span>
        <el-table
          :data="myDeviceList.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
          border
          stripe
        >
          <el-table-column prop="deviceId" label="设备ID"></el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="checkinDate" label="分配日期">
            <template slot-scope="scope">{{scope.row.checkinDate.slice(0,10)}}</template>
          </el-table-column>
          <el-table-column prop="returnDate" label="归还日期">
            <template slot-scope="scope">
              <span v-if="scope.row.returnDate != null">{{scope.row.returnDate.slice(0,10)}}</span>
              <span v-else>暂未归还</span>
            </template>
          </el-table-column>
          <el-table-column prop="totalUseTime" label="使用期限">
            <template slot-scope="scope">{{scope.row.totalUseTime}}个月</template>
          </el-table-column>
          <el-table-column prop="lastVerifyDate" label="上次核对">
            <template slot-scope="scope">{{scope.row.lastVerifyDate.slice(0,10)}}</template>
          </el-table-column>
        </el-table>

        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange1"
          @current-change="handleCurrentChange1"
          :current-page="currentPage1"
          :page-sizes="[2, 4, 6, 10]"
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
            <el-select v-model="device" placeholder="请选择">
              <el-option
                v-for="item in newDeviceList"
                :key="item.deviceId"
                :label="item.type"
                :value="item"
              >
                <span style="float: left">{{ item.deviceId }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.type }}</span>
              </el-option>
            </el-select>
          </el-form-item>
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
      currentPage: 1,
      pageSize: 2,
      total: 0,

      myDeviceList: [],
      currentPage1: 1,
      pageSize1: 2,
      total1: 0,

      deviceBasicInfo: {
        projectId: "",
        deviceId: "",
        type: "",
        state: 0,
        deviceManagerId: "",
        checkinDate: "",
        totalUseTime: 0,
        lastVerifyDate: ""
      },

      // 分配设备数据
      addDialogFormRules: {},
      device: "",
      newDeviceList: [],
      newDeviceInfo: {
        projectId: this.projectBasicId,
        deviceId: "",
        type: ""
      }
    };
  },
  created() {
    this.getDeviceList();
    this.getMyDeviceList();
    this.getNewDevice();
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
          this.total = this.deviceList.length;
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
          //   this.myDeviceList = this.myDeviceList.filter(
          //     item => item.projectId == this.projectBasicId
          //   );
          this.total1 = this.myDeviceList.length;
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
    submitForm() {
      this.deviceBasicInfo.deviceId = this.device.deviceId;
      this.deviceBasicInfo.type = this.device.type;
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