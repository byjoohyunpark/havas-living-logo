<template>
  <div id="app">
    <Logo />
  </div>
</template>
<script>
import Logo from "./components/Logo/Logo.vue";

export default {
  name: "app",
  data() {
    return {};
  },
  components: {
    Logo
  }
};
</script>
<style>
body {
  background-color: #000;
  margin: 0;
  overflow: hidden;
}
</style>