<template>
  <!-- 内容主体区域 -->
  <el-main>
    <!-- 相关风险列表 -->
    <el-card shadow="always">
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="8">
          <div style="font-size:18px">我负责的风险信息</div>
        </el-col>
      </el-row>
      <el-table
        :data="riskOwnListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @sort-change="sortRiskOwn"
        @filter-change="filterRiskOwn"
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="风险描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="风险应对策略">
                <span>{{ props.row.reactiveStrategy }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="风险ID" prop="riskId" sortable="custom"></el-table-column>
        <el-table-column label="风险类型" prop="type"></el-table-column>
        <el-table-column label="风险等级" prop="riskLevel" sortable="custom"></el-table-column>
        <el-table-column
          label="风险状态"
          prop="riskState"
          :filters="[{ text: '潜在', value: '潜在' },{ text: '正常', value: '正常' },{ text: '异常', value: '异常' },{ text: '紧急', value: '紧急' },{ text: '已解决', value: '已解决' }]"
          :column-key="'riskState'"
          filter-placement="bottom-end"
        ></el-table-column>
        <el-table-column label="风险影响度" prop="influence"></el-table-column>
        <el-table-column label="风险跟踪频度" prop="riskTrackFrequency" sortable="custom"></el-table-column>
        <el-table-column label="所属项目" prop="projectId" sortable="custom"></el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[8, 10, 15, 20]"
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
      riskOwnList: [],
      riskOwnListCopy: [],
      currentPage: 1,
      pageSize: 8,
      total: 0,
      col: {},
      myFilters: []
    };
  },
  created() {
    this.getRiskOwnList();
  },
  computed: {
    ...mapState(["personId"])
  },
  methods: {
    getRiskOwnList() {
      axios.get("/api/risk/owner/" + this.personId).then(response => {
        console.log(response.data);
        if (response.data.code === 0) {
          this.riskOwnList = response.data.data;
          this.riskOwnListCopy = this.riskOwnList;
          this.total = this.riskOwnListCopy.length;
          this.filterRiskOwn(this.myFilters);
        } else {
          this.$message.error("获取责任风险列表失败！");
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },
    // 责任风险排序
    sortRiskOwn(column) {
      this.col = column;
      this.riskOwnListCopy.sort(this.$compare(this.col["prop"]));
      if (this.col["order"] == "descending") {
        this.riskOwnListCopy.reverse();
      }
    },

    // 相关风险筛选
    filterRiskOwn(filters) {
      this.myFilters = filters;
      if (this.myFilters.riskState) {
        if (this.myFilters.riskState.length == 0) {
          this.riskOwnListCopy = this.riskOwnList;
        } else {
          this.riskOwnListCopy = this.riskOwnList.filter(
            item => this.myFilters.riskState.indexOf(item.riskState) != -1
          );
        }
        this.total = this.riskOwnListCopy.length;
        this.pageSize = 8;
        this.currentPage = 1;
      }
      this.sortRiskOwn(this.col);
    }
  }
};
</script>

<style scoped>
.el-table {
  margin-bottom: 15px;
}

.demo-table-expand label {
  font-weight: bolder;
  width: 90px;
  color: #99a9bf;
}

.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>