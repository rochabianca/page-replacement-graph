<template>
  <div>
    {{ acertos }}
  </div>
</template>

<script>
import testAlgoritmMixin from '@/mixins/test-algoritm-mixin';

export default {
  name: 'Results',
  mixins: [testAlgoritmMixin],
  created() {
    this.FIFO(this.frames);
  },
  data() {
    return {
      faltas: 0,
      acertos: 0,
      memory: [],
      frames: 70,
    }
  },
  methods: {
    FIFO(frames) {
      let acertos = 0;
      let memory = [];
      console.log('fifo')
      for (let i = 0; i < this.algorithmArray.length; i++) {
        if (memory.includes(this.algorithmArray[i].value)) {
          acertos++;
        } else {
          if (memory.length < frames) {
            memory.push(this.algorithmArray[i].value);
          } else {
            memory.splice(0, 1)
            memory.push(this.algorithmArray[i].value);
          }
        }
      }
      console.log('acertos: ', acertos);
      return {
        acertos,
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
