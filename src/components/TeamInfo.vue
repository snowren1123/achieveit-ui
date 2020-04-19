<template>
  <el-main>
    <el-row :gutter="20">
      <template v-for="member in members">
        <el-col :span="8" v-bind:key="member.index">
          <el-card :shadow="(member.role != '项目经理') ? 'hover' : 'always'">
            <div slot="header" class="clearfix">
              <span>{{ member.employeeName }}</span>
              <el-button
                v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
                icon="el-icon-delete"
                circle
                style="float: right"
                size="mini"
                type="danger"
                plain
                @click="deleteMember(member.employeeId)"
              ></el-button>
              <el-button
                v-show="((projectBasicState == '同意立项') || (projectBasicState == '进行中') || (projectBasicState == '已交付')) && (roleInProject == '项目经理')"
                icon="el-icon-edit"
                circle
                style="float: right; margin-right: 6px"
                size="mini"
                type="primary"
                plain
                @click="editMemberDialogShow(member)"
              ></el-button>
            </div>
            <div class="text">
              <p>
                <b>职位：</b>
                <span>{{ member.role }}</span>
              </p>
              <p>
                <b>邮箱：</b>
                <span>{{ member.email }}</span>
              </p>
              <p>
                <b>手机号：</b>
                <span>{{ member.telephone }}</span>
              </p>
              <p>
                <b>部门：</b>
                <span>{{ member.department }}</span>
              </p>
            </div>
          </el-card>
        </el-col>
      </template>
      <template>
        <el-col :span="8">
          <el-card shadow="hover" class="add_card" v-show="roleInProject == '项目经理'">
            <i class="el-icon-plus add_icon" @click="addMemberDialogShow"></i>
          </el-card>
        </el-col>
      </template>
    </el-row>

    <!-- 新增成员对话框 -->
    <el-dialog title="新增成员" :visible.sync="addDialogFormVisible" @close="addDialogClosed">
      <el-form
        :model="memberInfo"
        label-width="130px"
        label-position="left"
        :rules="addDialogFormRules"
        ref="addDialogFormRef"
      >
        <el-form-item label="人员名称" prop="employeeId">
          <el-select v-model="memberInfo.employeeId" clearable placeholder="请选择人员">
            <el-option
              v-for="item in employees"
              :key="item.employeeId"
              :label="item.employeeName + '(' + item.title + ')'"
              :value="item.employeeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职位" prop="role">
          <el-select v-model="memberInfo.role" multiple placeholder="请选择职位">
            <el-option v-for="item in roles" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目上级" prop="bossInProjectId">
          <el-select v-model="memberInfo.bossInProjectId" clearable placeholder="请选择项目上级">
            <el-option
              v-for="item in members"
              :key="item.employeeId"
              :label="item.employeeName"
              :value="item.employeeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问git权限" prop="accessGit">
          <el-radio-group v-model="memberInfo.accessGit">
            <el-radio border label="R">读权限</el-radio>
            <el-radio border label="W">写权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="访问服务器权限" prop="accessFileSystem">
          <el-radio-group v-model="memberInfo.accessFileSystem">
            <el-radio border label="R">读权限</el-radio>
            <el-radio border label="W">写权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加入邮件列表" prop="inEmailList">
          <el-switch v-model="inEmailList"></el-switch>
        </el-form-item>
        <el-form-item label="是否登记工时" prop="inTimesheetModule">
          <el-switch v-model="inTimesheetModule"></el-switch>
        </el-form-item>
        <el-form-item label="缺陷跟踪管理权限" prop="faultTrack">
          <el-switch v-model="faultTrack"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addSubmitForm()">确认</el-button>
        <el-button @click="addDialogFormVisible = false">取消</el-button>
      </div>
    </el-dialog>

    <!-- 修改成员对话框 -->
    <el-dialog title="修改成员信息" :visible.sync="editDialogFormVisible" @close="editDialogClosed">
      <el-form
        :model="editMemberInfo"
        label-width="130px"
        label-position="left"
        :rules="editDialogFormRules"
        ref="editDialogFormRef"
      >
        <el-form-item label="职位" prop="role">
          <el-select v-model="editMemberInfo.role" multiple clearable placeholder="请选择职位">
            <el-option v-for="item in roles" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目上级" prop="bossInProjectId">
          <el-select v-model="editMemberInfo.bossInProjectId" clearable placeholder="请选择项目上级">
            <el-option
              v-for="item in members"
              :key="item.employeeId"
              :label="item.employeeName"
              :value="item.employeeId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="访问git权限" prop="accessGit">
          <el-radio-group v-model="editMemberInfo.accessGit">
            <el-radio border label="R">读权限</el-radio>
            <el-radio border label="W">写权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="访问服务器权限" prop="accessFileSystem">
          <el-radio-group v-model="editMemberInfo.accessFileSystem">
            <el-radio border label="R">读权限</el-radio>
            <el-radio border label="W">写权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加入邮件列表" prop="inEmailList">
          <el-switch v-model="inEmailList"></el-switch>
        </el-form-item>
        <el-form-item label="是否登记工时" prop="inTimesheetModule">
          <el-switch v-model="inTimesheetModule"></el-switch>
        </el-form-item>
        <el-form-item label="缺陷跟踪管理权限" prop="faultTrack">
          <el-switch v-model="faultTrack"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editSubmitForm()">确认</el-button>
        <el-button @click="editDialogFormVisible = false">取消</el-button>
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
      members: [],
      employees: [],
      roles: [],
      inEmailList: false,
      inTimesheetModule: false,
      faultTrack: false,
      memberInfo: {
        projectId: "",
        employeeId: "",
        role: [],
        bossInProjectId: "",
        accessGit: "",
        accessFileSystem: "",
        inEmailList: "",
        inTimesheetModule: "",
        faultTrack: ""
      },
      addDialogFormVisible: false,
      addDialogFormRules: {
        employeeId: [
          { required: true, message: "请选择人员", trigger: "change" }
        ],
        role: [{ required: true, message: "请选择职位", trigger: "change" }],
        bossInProjectId: [
          { required: true, message: "请选择项目上级", trigger: "change" }
        ]
      },
      editMemberInfo: {
        projectId: "",
        employeeId: "",
        role: [],
        bossInProjectId: "",
        accessGit: "",
        accessFileSystem: "",
        inEmailList: "",
        inTimesheetModule: "",
        faultTrack: ""
      },
      editDialogFormVisible: false,
      editDialogFormRules: {
        role: [{ required: true, message: "请选择职位", trigger: "change" }],
        bossInProjectId: [
          { required: true, message: "请选择项目上级", trigger: "change" }
        ]
      }
    };
  },

  created() {
    this.getProjectMembers();
  },

  computed: {
    ...mapState(["projectBasicId"]),
    ...mapState(["roleInProject"]),
    ...mapState(["projectBasicState"])
  },

  methods: {
    getProjectMembers() {
      this.members = [];
      axios.get("/api/member/" + this.projectBasicId).then(response => {
        if (response.data.code === 0) {
          var temp = response.data.data;
          temp.forEach(item => {
            this.getUserInfo(item);
          });
          console.log(this.members);
        }
      });
    },
    // 根据id获取成员的详细信息
    getUserInfo(item) {
      axios.get("/api/employee/" + item.employeeId).then(response => {
        if (response.data.code === 0) {
          Object.assign(item, response.data.data);
          this.members.push(item);
        } else {
          this.$message.error("获取用户信息失败！");
        }
      });
    },
    async deleteMember(employeeId) {
      const confirmResult = await this.$confirm(
        "此操作将从项目中删除该成员，是否继续？",
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
        .delete(
          "/api/member?projectId=" +
            this.projectBasicId +
            "&employeeId=" +
            employeeId
        )
        .then(response => {
          console.log(response);
          if (response.data.code === 0) {
            this.$message.success("删除成员成功");
            this.getProjectMembers();
          } else {
            this.$message.error("删除成员失败");
          }
        });
    },
    addDialogClosed: function() {
      this.$refs.addDialogFormRef.resetFields();
      this.inEmailList = false;
      this.inTimesheetModule = false;
      this.faultTrack = false;
    },
    addMemberDialogShow() {
      this.memberInfo.projectId = this.projectBasicId;

      axios
        .get("/api/addibleEmployee/" + this.projectBasicId)
        .then(response => {
          if (response.data.code === 0) {
            this.employees = response.data.data;
          } else {
            this.$message.error("获取可选人员失败！");
          }
        });

      axios.get("/api/role").then(response => {
        if (response.data.code === 0) {
          this.roles = response.data.data;
        } else {
          this.$message.error("获取可选职位失败！");
        }
      });

      this.addDialogFormVisible = true;
    },
    addSubmitForm() {
      this.$refs.addDialogFormRef.validate(async valid => {
        if (!valid) return;

        this.memberInfo.inEmailList = this.inEmailList ? 1 : 0;
        this.memberInfo.inTimesheetModule = this.inTimesheetModule ? 1 : 0;
        this.memberInfo.faultTrack = this.faultTrack ? 1 : 0;
        console.log(this.memberInfo);

        axios
          .post(
            "/api/member",
            qs.stringify(this.memberInfo, { indices: false })
          )
          .then(response => {
            console.log(response);
            if (response.data.code === 0) {
              this.$message.success("新增成员成功");
              this.getProjectMembers();
            } else {
              this.$message.error("新增成员失败");
            }
          });

        this.addDialogFormVisible = false;
      });
    },
    editDialogClosed: function() {
      this.$refs.editDialogFormRef.resetFields();
      this.inEmailList = false;
      this.inTimesheetModule = false;
      this.faultTrack = false;
    },
    editMemberDialogShow(member) {
      this.editMemberInfo.projectId = this.projectBasicId;

      axios.get("/api/role").then(response => {
        if (response.data.code === 0) {
          this.roles = response.data.data;
        } else {
          this.$message.error("获取可选职位失败！");
        }
      });

      axios.get("/api/employees/org_config").then(response => {
        if (response.data.code === 0) {
          this.employees = response.data.data;
        } else {
          this.$message.error("获取可选人员失败！");
        }
      });

      for (var key in this.editMemberInfo) {
        if (key === "role") {
          this.editMemberInfo[key] = JSON.parse(
            JSON.stringify(member[key].split(","))
          );
          console.log(this.editMemberInfo[key]);
        } else this.editMemberInfo[key] = member[key];
      }

      this.inEmailList = this.editMemberInfo.inEmailList == 1 ? true : false;
      this.inTimesheetModule =
        this.editMemberInfo.inTimesheetModule == 1 ? true : false;
      this.faultTrack = this.editMemberInfo.faultTrack == 1 ? true : false;

      this.editDialogFormVisible = true;
    },
    editSubmitForm() {
      this.$refs.editDialogFormRef.validate(async valid => {
        if (!valid) return;

        this.editMemberInfo.inEmailList = this.inEmailList ? 1 : 0;
        this.editMemberInfo.inTimesheetModule = this.inTimesheetModule ? 1 : 0;
        this.editMemberInfo.faultTrack = this.faultTrack ? 1 : 0;
        console.log(this.editMemberInfo);

        axios
          .put(
            "/api/member",
            qs.stringify(this.editMemberInfo, { indices: false })
          )
          .then(response => {
            console.log(response);
            if (response.data.code === 0) {
              this.$message.success("修改成员信息成功");
              this.getProjectMembers();
            } else {
              this.$message.error("修改成员信息失败");
            }
          });

        this.editDialogFormVisible = false;
      });
    }
  }
};
</script>

<style scoped>
.el-card__body {
  padding-top: 10px;
}
.el-card__header {
  padding: 13px 20px;
}
.el-row {
  margin-bottom: 20px;
}
.el-col {
  margin-bottom: 20px;
}
.text {
  font-size: 14px;
}
.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.clearfix {
  position: relative;
}
.clearfix span {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.box-card {
  width: 480px;
}
.add_card {
  position: relative;
  height: 238px;
}
.add_card .add_icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  padding: 20px;
}
</style>