<template>
  <!-- <i-frame :src="url" /> -->
</template>
<script>
import iFrame from "@/components/iFrame/index";
export default {
  name: "Swagger",
  components: { iFrame },
  data() {
    return {
      // url: __config._BASE_API + "/swagger-ui/index.html"
    };
  },
};
</script>
