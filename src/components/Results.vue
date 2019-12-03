<script>
// import testAlgoritmMixin from '@/mixins/test-algoritm-mixin';
import { Bar } from 'vue-chartjs';

export default {
  name: 'Results',
  extends: Bar,
  // mixins: [Bar],
  // mixins: [testAlgoritmMixin],
  created() {
    // this.FIFO(5);
    // this.SegundaChange(5, 10);
    // this.MRU(5);
    this.NRU(4, 10);
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
  data() {
    return {
      algorithm: '2W-1R-5R-5W-2R-0W-2R-7R-1W-7W-2R-7W-4R-2R-6W-1W-2W-3W-7R-5R-',
      frames: 70,
      loaded: false,
      algoritmnsGraph: [],
      chartdata: {
        labels: ['Algoritmo', 'Frames'],
        datasets: [],
        type: Object,
        default: null
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    }
  },
  methods: {
    FIFO(frames) {
      let acertos = 0, memory = [];
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
      this.chartdata.datasets.push({
        label: 'Fifo',
        backgroundColor: '#f87979',
        data: [acertos, frames]
      })
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
    MRU(frames) {
      let acertos = 0;
      let memory = [];
      for (let i = 0; i < this.algorithmArray.length; i++) {
        if (memory.includes(this.algorithmArray[i].value)) {
          acertos++;
          let temporary = this.algorithmArray[i].value;
          const memoryIndex = memory.findIndex(x => x === this.algorithmArray[i].value);
          if (memoryIndex !== (memory.length - 1)) {
            memory.splice(memoryIndex, 1);
            memory.push(temporary);
          }
        } else {
          if (memory.length < frames) {
            memory.push(this.algorithmArray[i].value);
          } else {
            memory.splice(0, 1)
            memory.push(this.algorithmArray[i].value);
          }
        }
      }
      console.log('acertos MRU: ', acertos);
      this.chartdata.datasets.push({
        label: 'MRU',
        backgroundColor: '#F6A767',
        data: [acertos, frames]
      })
    },
    NRU(frames, timeToResetBitR) {
      let acertos = 0, memory = [], countToResetBitR = 0;
      for (let i = 0; i < this.algorithmArray.length; i++) {
        const memoryIndex = memory.findIndex(x => x.value === this.algorithmArray[i].value);
        if (memoryIndex !== -1) {
          acertos++;
          console.log('acerto: ', memory[memoryIndex])
          if (this.algorithmArray[i].type === 'R' && memory[memoryIndex].bitR !== 1) memory[memoryIndex].bitR = 1;
          if (this.algorithmArray[i].type === 'W' && memory[memoryIndex].bitW !== 1) memory[memoryIndex].bitW = 1;
          console.log('ao final: ', memory[memoryIndex])
        } else if (memory.length < frames) {
          let bitRvalue = 0, bitWvalue = 0;
          if (this.algorithmArray[i].type === 'R') bitRvalue = 1;
          if (this.algorithmArray[i].type === 'W') bitWvalue = 1;

          memory.push({
            value: this.algorithmArray[i].value,
            bitR: bitRvalue,
            bitW: bitWvalue,
          });
        } else {
          let indextoSplice = 0, bitRvalue = 0, bitWvalue = 0;

          if (this.algorithmArray[i].type === 'R') bitRvalue = 1;
          if (this.algorithmArray[i].type === 'W') bitWvalue = 1;

          const indexClassZero = memory.findIndex(x => x.bitR === 0 && x.bitW === 0);
          if (indexClassZero !== -1) {
            indextoSplice = indexClassZero;
          } else {
            const indexClassOne = memory.findIndex(x => x.bitR === 0 && x.bitW === 1);
            if (indexClassOne !== -1) {
              indextoSplice = indexClassOne;
            } else {
              const indexClassTwo = memory.findIndex(x => x.bitR === 1 && x.bitW === 0);
              if (indexClassTwo !== -1) {
                indextoSplice = indexClassTwo;
              }
            }
          }
          memory.splice(indextoSplice, 1)
          memory.push({
            value: this.algorithmArray[i].value,
            bitR: bitRvalue,
            bitW: bitWvalue,
          });
        }
        countToResetBitR++;
        if (countToResetBitR === timeToResetBitR) {
          memory = this.resetBitR(memory);
          countToResetBitR = 0;
        }
      }
      console.log('acertos NRU: ', acertos, 'memoria final: ', memory);
      const finalResult = {
        algoritmo: 'nru',
        acertos,
      }
      this.algoritmnsGraph.push(finalResult)
      this.chartdata.datasets.push({
        label: 'NRU',
        backgroundColor: '#f87979',
        data: [acertos, frames]
      })
      return finalResult;
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
