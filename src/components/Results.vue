<template>
  <div>
    helou there
  </div>
</template>

<script>
import testAlgoritmMixin from '@/mixins/test-algoritm-mixin';

export default {
  name: 'Results',
  mixins: [testAlgoritmMixin],
  created() {
    // this.FIFO(this.frames);
    this.SegundaChange(this.frames, 500);
  },
  data() {
    return {
      faltas: 0,
      acertos: 0,
      memory: [],
      frames: 70,
      algoritmnsGraph: [],
    }
  },
  methods: {
    FIFO(frames) {
      let acertos = 0;
      let memory = [];
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
      console.log('acertos FIFO: ', acertos);
      const finalResult = {
        algoritmo: 'FIFO',
        acertos,
      }
      this.algoritmnsGraph.push(finalResult)
      return finalResult;
    },
    SegundaChange(frames, timeToResetBitR) {
      console.log(frames, timeToResetBitR);
      let acertos = 0;
      let memory = [];
      let countToReset = 0;
      for (let i = 0; i < this.algorithmArray.length; i++) {
        countToReset++;
        if (countToReset === timeToResetBitR) {
          memory = this.resetBitR(memory);
        }
        const memoryIndex = memory.findIndex(x => x.value === this.algorithmArray[i].value);
        if (memoryIndex !== -1) {
          acertos++
          memory[memoryIndex].bitR = 1;
        } else {
          if (memory.length < frames) {
            memory.push({
              value: this.algorithmArray[i].value,
              bitR: 1,
            })
          } else {
            console.log('else')
            // verifica a memoria:
            //itens com bitR = 1: bitR setado para zero e movido para o final da memoria
            // itens com bitR = 0: item removido e substituido pelo outro lá
          }
        }
      }

      console.log(acertos)
    },
    resetBitR(memory) {
      for (let i = 0; i < memory.length; i++) {
        memory[i].bitR = 0;
      }
      return memory;
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
