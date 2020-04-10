<template>
  <!-- 内容主体区域 -->
  <el-main>
    <!-- 相关风险列表 -->
    <el-card shadow="always">
      <el-table
        :data="riskOwnListCopy.slice((currentPage-1)*pageSize,currentPage*pageSize)"
        @sort-change="sortRiskOwn"
        border
        stripe
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="风险影响度">
                <span>{{ props.row.influence }}</span>
              </el-form-item>
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
        <el-table-column label="风险状态" prop="riskState"></el-table-column>
        <el-table-column label="风险跟踪频度" prop="riskTrackFrequency" sortable="custom"></el-table-column>
        <el-table-column label="所属项目" prop="projectId"></el-table-column>
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
      riskOwnList: [],
      riskOwnListCopy: [],
      currentPage: 1,
      pageSize: 6,
      total: 0
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
      console.log(column);
      this.riskOwnListCopy.sort(this.$compare(column["prop"]));
      if (column["order"] == "descending") {
        this.riskOwnListCopy.reverse();
      }
    }
  }
};
</script>

<style scoped>
.el-table {
  margin: 15px 0;
}

.el-card {
  padding-top: 10px;
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