<template>
  <el-main>
    <el-card shadow="always">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <div style="font-size:18px">我的评审/缺陷报告</div>
        </el-col>
      </el-row>
      <!-- 评审缺陷列表区域 -->
      <el-table
        :data="reviewListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @filter-change="reviewListFilter"
        border
        stripe
      >
        <el-table-column prop="projectId" label="项目ID" width="145"></el-table-column>
        <el-table-column
          prop="type"
          label="类型"
          width="80"
          :filters="[{ text: '评审类', value: 'review' }, { text: '缺陷类', value: 'defect' }]"
          :column-key="'type'"
          filter-placement="bottom-end"
        >
          >
          <template slot-scope="scope">
            <el-tag type="primary" v-if="scope.row.type == 'review'" effect="plain">评审</el-tag>
            <el-tag type="danger" v-else effect="plain">缺陷</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="日期" width="190"></el-table-column>
        <el-table-column
          prop="state"
          label="状态"
          width="100"
          :filters="[{ text: '已处理', value: 1 }, { text: '待处理', value: 0 }]"
          :column-key="'state'"
          filter-placement="bottom-end"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state === 1" type="success">已处理</el-tag>
            <el-tag v-if="scope.row.state === 0" type="warning">待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理人员" width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.solverId == null" type="info">暂无</el-tag>
            <span v-else>{{ scope.row.solverId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" width="210"></el-table-column>
        <el-table-column label="链接" width="207">
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
      pageSize: 8,
      total: 0,
      myFilters: { state: [], type: [] }
    };
  },
  created() {
    this.getBySearchProvider();
  },
  computed: {
    ...mapState(["personId"])
  },
  methods: {
    getBySearchProvider() {
      axios
        .get("/api/review_defect/provider/" + this.personId)
        .then(response => {
          if (response.data.code === 0) {
            console.log("ByProvider");
            console.log(response.data.data);
            this.reviewList = response.data.data;
            this.total = this.reviewList.length;
          } else {
            this.$message.error("获取评审缺陷列表失败！");
          }
        });
    },
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
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    filterTypeOrState(value, row, column) {
      const property = column["property"];
      return row[property] === value;
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

.el-card {
  padding-top: 10px;
}
</style>