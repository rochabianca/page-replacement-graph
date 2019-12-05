<template>
  <div class="home">
    <h1 class="title">
      Trabalho de SO
    </h1>
    <p class="subtitle">
      Algoritmos de substituição de páginas
    </p>
    <GetData @calculate-results="loadData" />
    <Results :file-data="fileData" />
  </div>
</template>

<script>
import GetData from '@/components/GetData.vue';
import Results from '@/components/Results.vue'

export default {
  name: 'Home',
  data() {
    return {
      fileData: null,
    }
  },
  methods: {
    loadData(res) {
      this.fileData = res;
    }
  },
  components: {
    Results,
    GetData,
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";
.title,
.subtitle {
  text-align: center;
}
.title {
  color: $black;
  font-weight: bold;
  margin-bottom: 15px;
}
.subtitle {
  color: $dark-gray;
  font-weight: lighter;
}
</style>
