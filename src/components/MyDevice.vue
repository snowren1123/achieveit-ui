<template>
  <!-- 内容主体区域 -->
  <el-main>
    <el-tabs type="border-card" style="postion:relative">
      <el-tab-pane label="我的设备">
        <span slot="label">
          <i class="el-icon-mobile-phone"></i> 我的设备
        </span>
        <el-table
          :data="myDeviceListCopy.slice((currentPage1-1)*pageSize1,currentPage1*pageSize1)"
          @filter-change="filterMyDeviceList"
          @sort-change="sortMyDevice"
          stripe
        >
          <el-table-column prop="projectId" label="项目ID" sortable="custom"></el-table-column>
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
          <el-table-column prop="lastVerifyDate" label="上次核对">
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
      myDeviceList: [],
      myDeviceListCopy: [],
      currentPage1: 1,
      pageSize1: 6,
      total1: 0,
      col: {},
      myFilters: []
    };
  },
  created() {
    this.getMyDeviceList();
  },
  computed: {
    ...mapState(["personId"])
  },
  methods: {
    // 分页方法
    handleSizeChange1(val) {
      this.pageSize1 = val;
    },
    handleCurrentChange1(val) {
      this.currentPage1 = val;
    },

    // 表格数据方法
    getMyDeviceList() {
      axios.get("/api/device/owner/" + this.personId).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.myDeviceList = response.data.data;
          this.myDeviceListCopy = this.myDeviceList;
          this.total1 = this.myDeviceListCopy.length;
          this.filterMyDeviceList(this.myFilters);
        } else {
          this.$message.error("获取我的设备列表失败！");
        }
      });
    },

    // 核对设备
    checkDevice(tempDevice) {
      axios.put("/api/device/check", tempDevice).then(response => {
        console.log(response);
        if (response.data.code == 0) {
          this.$message.success("核对设备成功");
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
          this.getMyDeviceList();
        } else {
          this.$message.error("归还设备失败");
        }
      });
    },

    // 设备排序
    sortMyDevice(column) {
      this.col = column;
      this.myDeviceListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.myDeviceListCopy.reverse();
      }
    },

    // 表格筛选方法
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
      this.sortMyDevice(this.col);
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