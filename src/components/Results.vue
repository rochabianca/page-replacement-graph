<template>
  <div>
    {{ algorithmArray }}
  </div>
</template>

<script>
export default {
  name: 'Results',
  created() {
    this.FIFO(5);
  },
  data() {
    return {
      algorithm: '7W-2W-7R-4W-4R-2R-6R-6R-5W-2W-7R-0R-5W-6W-4R-5R-1R-1W-5W-',
      faltas: 0,
      acertos: 0,
      memory: [],
      frames: [5, 10]
    }
  },
  methods: {
    FIFO(frames) {
      let acertos = 0;
      let faltas = 0;
      let memory = [];
      console.log('fifo')
      for (let i = 0; i < this.algorithmArray.length; i++) {
        if (memory.includes(this.algorithmArray[i].value)) {
          acertos++;
        } else {
          faltas++;
          if (memory.length < frames) {
            memory.push(this.algorithmArray[i].value);
          } else {
            memory.splice(0, 1)
            memory.push(this.algorithmArray[i].value);
          }
        }
      }
      console.log('acertos: ', acertos);
      console.log('faltas: ', faltas);
      console.log('memoria final: ', memory);
      return {
        acertos,
        memory,
        algoritmo: 'FIFO'
      }
    }
  },
  computed: {
    algorithmArray() {
      let response = this.algorithm.split('-');
      let responseArray = [];
      response.pop()
      for (let i = 0; i < response.length; i++) {
        responseArray.push({
          value: response[i].slice(0, (response[i].length - 1)),
          type: response[i].slice((response[i].length - 1), response[i].length),
        })
      }
      return responseArray;
    }
  }

};
</script>

<style>
</style>
