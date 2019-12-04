<template>
  <div class="home">
    <GetData @loaded="loadAlgorithm" />
    <Results v-if="algorithm" :algorithm="algorithm" />
  </div>
</template>

<script>
import GetData from '@/components/GetData.vue';
import Results from '@/components/Results.vue'

export default {
  name: 'Home',
  data() {
    return {
      algorithm: '',
    }
  },
  methods: {
    loadAlgorithm(res) {
      this.algorithm = res;
    }
  },
  components: {
    Results,
    GetData,
  }
}
</script>
