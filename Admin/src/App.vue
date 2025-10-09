<template>
  <div id="app">
    <router-view />
    <theme-picker />
  </div>
</template>

<script>
import ThemePicker from "@/components/ThemePicker";
import { _initPlayAudio } from "@/plugins/audio/index.js";
export default {
  name: "App",
  components: { ThemePicker },
  mounted() {
    _initPlayAudio();
  },
};
</script>
<style scoped>
#app .theme-picker {
  display: none;
}
</style>
