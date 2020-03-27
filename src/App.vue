<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  created() {
    //在页面刷新时将vuex里的信息保存到localStorage里
    window.addEventListener("beforeunload", () => {
      localStorage.setItem("messageStore", JSON.stringify(this.$store.state));
    });

    //在页面加载时读取localStorage里的状态信息
    localStorage.getItem("messageStore") &&
      this.$store.replaceState(
        Object.assign(
          this.$store.state,
          JSON.parse(localStorage.getItem("messageStore"))
        )
      );
  }
};
</script>

<style>
</style>
