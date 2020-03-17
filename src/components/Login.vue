<template>
  <div id="pic">
    <img src="../assets/logo.png" />
    <div class="login">
      <h1>登录</h1>
      <el-form
        :model="loginInfo"
        ref="loginInfo"
        label-width="100px"
        class="demo-dynamic center-set"
      >
        <el-form-item
          prop="account"
          label="账号"
          :rules="{ 
        required: true, message: '请输入您的账号', trigger: 'blur' 
    }"
        >
          <el-input v-model="loginInfo.account"></el-input>
        </el-form-item>
        <el-form-item
          prop="password"
          label="密码"
          :rules="{
      required: true, message: '密码不能为空', trigger: 'blur'
    }"
        >
          <el-input v-model="loginInfo.password" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">确认</el-button>
          <el-button @click="addDomain()">注册</el-button>
          <el-button @click="resetForm()">忘记密码</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Cookie from "js-cookie";
import qs from "qs";

axios.defaults.withCredentials = true;
//axios.defaults.baseURL = "http://localhost:8086";

export default {
  name: "Login",
  data() {
    return {
      loginInfo: {
        account: "robert11@qq.com",
        password: "123456"
      }
    };
  },
  methods: {
    submitForm() {
      axios
        .post(
          "/api/login",
          qs.stringify({
            user: this.loginInfo.account,
            password: this.loginInfo.password
          })
        )
        .then(response => {
          if (response.data.code === 0) {
            var token = response.data.data.token;
            var overdue = new Date();
            overdue.setTime(overdue.getTime() + 60 * 1000); // 设置cookie过期时间为1min
            console.log(token);
            Cookie.set("token", token, { expires: overdue });
            this.$message.success("登录成功");
            this.$router.push("/home");
          } else {
            this.$message.error("账号或密码错误！");
          }
          // var $cookie = this.$cookie
          // this.$cookie.set('token', $result.data.token)
          // alert('this' + $result.data.token)
          // Headers:{
          //   // Authorization: this.$cookie.get('token')
          //   Authorization: response.data.token
          // }
        })
        .catch(response => {
          this.$message.error("未知网络错误!");
          console.log("请求失败：" + response);
        });
    },

    resetForm() {
      alert("info test2!");
      axios.post("/api/info", {}).then(function(response) {
        alert("in");
      });
    },

    addDomain() {
      alert("info test!");
      axios
        .post(
          "/api/info",
          {},
          {
            headers: {
              "Access-Control-Allow-Origin": "http://localhost:8080",
              Authorization: "Bearer " + Cookie.get("token")
            }
          }
        )
        .then(function(response) {
          alert(response.data.data);
        })
        .catch(response => {
          this.$message.error("未知网络错误！");
          console.log("请求失败：" + response);
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#pic {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.center-set {
  width: 40%;
  margin-left: 27%;
}
</style>
