<template>
  <div>
    helou there
  </div>
</template>

<script>
// import testAlgoritmMixin from '@/mixins/test-algoritm-mixin';

export default {
  name: 'Results',
  // mixins: [testAlgoritmMixin],
  created() {
    // this.FIFO(this.frames);
    this.SegundaChange(5, 10);
  },
  data() {
    return {
      algorithm: '7W-2W-7R-4W-4R-2R-6R-6R-5W-2W-7R-0R-5W-6W-4R-5R-1R-1W-5W-',
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
      let acertos = 0;
      let memory = [];
      let countToReset = 0;
      console.log('memoria', memory);
      for (let i = 0; i < this.algorithmArray.length; i++) {
        countToReset++;
        console.log('memory: ', memory, 'i = ', i)
        const memoryIndex = memory.findIndex(x => x.value === this.algorithmArray[i].value);
        console.log('memoryIndex: ', memoryIndex)
        if (memoryIndex !== -1) {
          console.log('if 1')
          console.log('index da memoria ', memoryIndex, 'valor: ', memory[memoryIndex], 'algoritmo array: ', this.algorithmArray[i].value);
          acertos++
          if (memory[memoryIndex].bitR !== 1) memory[memoryIndex].bitR = 1;
        } else if (memoryIndex === -1 && memory.length < frames) {
          console.log('else if')
          memory.push({
            value: this.algorithmArray[i].value,
            bitR: 1,
          })
        } else {
          console.log('else 2')
          // verifica a memoria:
          //itens com bitR = 1: bitR setado para zero e movido para o final da memoria
          // itens com bitR = 0: item removido e substituido pelo outro lá
          let stop = 0;
          let j = 0;
          while (stop !== 1) {
            if (memory[j].bitR === 0) {
              memory.splice(j, 1);
              console.log(memory);
              memory.push({
                value: this.algorithmArray[i].value,
                bitR: 1,
              });
              stop = 1;
            } else {
              let temporary = memory[j].value;
              memory.splice(j, 1);
              memory.push({
                value: temporary,
                bitR: 0
              });
              j++;
            }
          }
        }
        if (countToReset === (timeToResetBitR + 1)) {
          console.log('resetou');
          memory = this.resetBitR(memory);
          countToReset = 0;
        }
        console.log('memoria no final da interação: ', memory);
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
