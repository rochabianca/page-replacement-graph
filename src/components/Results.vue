<template>
  <div>
    {{ algorithmArray }}
  </div>
</template>

<script>
export default {
  name: 'Results',
  data() {
    return {
      algorithm: '7W-2W-7R-4W-4R-2R-6R-6R-5W-2W-7R-0R-5W-6W-4R-5R-1R-1W-5W-',
      frames: [5, 10]
    }
  },
  methods: {
    FIFO(alg) {
      console.log(alg)
    }
  },
  computed: {
    algorithmArray() {
      let response = this.algorithm.split('-');
      response.pop()
      return response;
    }
  }

};
</script>

<style>
</style>
