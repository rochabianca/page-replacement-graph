<template>
  <div>
    <GChart
      style="max-width: 100%"
      type="BarChart"
      :data="chartData"
      :options="chartOptions"
    />

    <div class="mt-60 tbl-header table-bg">
      <table cellpadding="0" cellspacing="0" border="0">
        <thead>
          <tr>
            <th>Frames</th>
            <th>FIFO</th>
            <th>Segunda Chance</th>
            <th>MRU</th>
            <th>NUR</th>
            <th>Otimo</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="tbl-content table-bg">
      <table cellpadding="0" cellspacing="0" border="0">
        <tbody>
          <tr v-for="alg in algorithmTable" :key="alg.frames">
            <td>{{ alg.frames }}</td>
            <td>{{ alg.acertosFifo }}</td>
            <td>{{ alg.acertosSegundaChance }}</td>
            <td>{{ alg.acertosMRU }}</td>
            <td>{{ alg.acertosNUR }}</td>
            <td>{{ alg.acertosOtimo }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'

export default {
  name: 'Results',
  props: {
    fileData: Object,
  },
  created() {
    this.createGraph();
  },
  watch: {
    fileData() {
      this.createGraph();
    }
  },
  components: {
    GChart
  },
  data() {
    return {
      algoritmnsGraph: [],
      algorithmTable: [],
      chartData: [
        ['Frames', 'FIFO', 'MRU', 'NRU', 'Segunda Chance', 'Otimo'],
      ],
      chartOptions: {
        bars: 'horizontal', // Required for Material Bar Charts.
        hAxis: { format: 'decimal' },
        height: 400,
        colors: ['#1b9e77', '#E60D1D', '#7570b3', '#35495d', '#999']
      }
    }
  },
  methods: {
    async createGraph() {
      for (let i = 0; i < this.fileData.frames.length; i++) {
        const acertosFifo = await this.FIFO(this.fileData.frames[i]);
        const acertosMRU = await this.MRU(this.fileData.frames[i]);
        const acertosNUR = await this.NRU(this.fileData.frames[i], this.fileData.timeToResetBitR);
        const acertosSegundaChance = await this.SegundaChange(this.fileData.frames[i], this.fileData.timeToResetBitR);
        // const acertosOtimo = await this.Otimo(this.fileData.frames[i]);

        await this.chartData.push([
          `${this.fileData.frames[i]}`, acertosFifo, acertosMRU, acertosNUR, acertosSegundaChance, 0
        ])
        await this.algorithmTable.push({
          frames: this.fileData.frames[i],
          acertosFifo,
          acertosMRU,
          acertosNUR,
          acertosSegundaChance,
          acertosOtimo: 0,
        })
      }
    },
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
      // console.log('acertos FIFO: ', acertos);
      const finalResult = {
        algoritmo: 'FIFO',
        acertos,
      }
      this.algoritmnsGraph.push(finalResult)
      return acertos;
    },
    SegundaChange(frames, timeToResetBitR) {
      let acertos = 0;
      let memory = [];
      let countToReset = 0;

      for (let i = 0; i < this.algorithmArray.length; i++) {
        const memoryIndex = memory.findIndex(x => x.value === this.algorithmArray[i].value);
        if (memoryIndex !== -1) {
          acertos++
          memory[memoryIndex].bitR = 1;
        } else if (memory.length < frames) {
          memory.push({
            value: this.algorithmArray[i].value,
            bitR: 1,
          })
        } else {
          // verifica a memoria:
          //itens com bitR = 1: bitR setado para zero e movido para o final da memoria
          // itens com bitR = 0: item removido e substituido pelo outro lá
          let stop = 0;
          while (stop !== 1) {
            if (memory[0].bitR === 0) {
              memory.splice(0, 1);
              memory.push({
                value: this.algorithmArray[i].value,
                bitR: 1,
              });
              stop = 1;
            } else {
              let temporary = memory[0].value;
              memory.splice(0, 1);
              memory.push({
                value: temporary,
                bitR: 0
              });
            }
          }
        }
        countToReset++;
        if (countToReset === timeToResetBitR + 1) {
          memory = this.resetBitR(memory);
          countToReset = 0;
        }
      }
      return acertos;
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
      return acertos;
    },
    NRU(frames, timeToResetBitR) {
      let acertos = 0, memory = [], countToResetBitR = 0;
      for (let i = 0; i < this.algorithmArray.length; i++) {
        const memoryIndex = memory.findIndex(x => x.value === this.algorithmArray[i].value);
        if (memoryIndex !== -1) {
          acertos++;
          // console.log('acerto: ', memory[memoryIndex])
          memory[memoryIndex].bitR = 1;
          if (this.algorithmArray[i].type === 'W' && memory[memoryIndex].bitW !== 1) memory[memoryIndex].bitW = 1;
          // console.log('ao final: ', memory[memoryIndex])
        } else if (memory.length < frames) {
          let bitRvalue = 1, bitWvalue = 0;
          // if (this.algorithmArray[i].type === 'R') bitRvalue = 1;
          if (this.algorithmArray[i].type === 'W') bitWvalue = 1;
          memory.push({
            value: this.algorithmArray[i].value,
            bitR: bitRvalue,
            bitW: bitWvalue,
          });
        } else {
          let indextoSplice = 0, bitWvalue = 0;

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
              } else {
                const indexClassThree = memory.findIndex(x => x.bitR === 1 && x.bitW === 1);
                if (indexClassThree !== -1) {
                  indextoSplice = indexClassThree;
                }
              }
            }
          }
          memory.splice(indextoSplice, 1)
          memory.push({
            value: this.algorithmArray[i].value,
            bitR: 1,
            bitW: bitWvalue,
          });
        }
        countToResetBitR++;
        if (countToResetBitR === timeToResetBitR) {
          memory = this.resetBitR(memory);
          countToResetBitR = 0;
        }
      }
      // console.log('acertos NRU: ', acertos, 'memoria final: ', memory);
      const finalResult = {
        algoritmo: 'nru',
        acertos,
      }
      this.algoritmnsGraph.push(finalResult)
      return acertos;
    },
    Otimo(frames) {
      let pages = [];
      for (let i = 0; i < this.algorithmArray.length; i++) {
        // let a = parseInt(this.algorithmArray[i].value.replace(/[^0-9]/g, ''));
        pages.push(this.algorithmArray[i].value);
        // pages.push(pages.push(this.algorithmArray[i].value););
      }
      let acertos = 0, temp = [], flag1, flag2, flag3, pos, max, faults = 0;
      for (let i = 0; i < frames; ++i) {
        frames[i] = -1;
      }
      for (let i = 0; i < this.algorithmArray.length; ++i) {
        flag1 = flag2 = 0;
        for (let j = 0; j < frames; ++j) {
          if (frames[j] == pages[i]) {
            flag1 = flag2 = 1;
          }
        }
        if (flag1 == 0) {
          for (let j = 0; j < frames; ++j) {
            if (frames[j] == -1) {
              faults++;
              frames[j] = pages[i];
              flag2 = 1;
            }
          }
          acertos++;
        }

        if (flag2 == 0) {
          flag3 = 0;
          for (let j = 0; j < frames; ++j) {
            temp[j] = -1;
            for (let k = i + 1; k < this.algorithmArray.length; ++k) {
              if (frames[j] == pages[k]) {
                temp[j] = k;
              }
            }
          }

          for (let j = 0; j < frames; ++j) {
            if (temp[j] == -1) {
              pos = j;
              flag3 = 1;
            }
          }

          if (flag3 == 0) {
            max = temp[0];
            pos = 0;
            for (let j = 1; j < frames; ++j) {
              if (temp[j] > max) {
                max = temp[j];
                pos = j;
              }
            }
          }

          frames[pos] = pages[i];
          faults++;
        }
        // for (let j = 0; j < frames; j++) {
        //   // console.log("%d\t", frames[j]);
        // }
      }
      console.log("\n\nTotal Page Faults = %d", faults);
      // console.log("\n\nTotal acertos = %d", acertos);
      return acertos;
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
      let response = this.fileData.algorithm.split('-');
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

<style lang="scss" scoped>
.mt-60 {
  margin-top: 60px;
}
table {
  width: 100%;
  table-layout: fixed;
}
.tbl-header {
  background-color: rgba(255, 255, 255, 0.3);
}
.tbl-content {
  height: 300px;
  overflow-x: auto;
  margin-top: 0px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}
th {
  padding: 20px 15px;
  text-align: left;
  font-weight: 500;
  font-size: 12px;
  color: #fff;
  text-transform: uppercase;
}
td {
  padding: 15px;
  text-align: left;
  vertical-align: middle;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
  border-bottom: solid 1px rgba(255, 255, 255, 0.1);
}

/* demo styles */

.table-bg {
  background: -webkit-linear-gradient(left, #25c481, #25b7c4);
  background: linear-gradient(to right, #25c481, #25b7c4);
}
section {
  margin: 50px;
}

/* follow me template */
.made-with-love {
  margin-top: 40px;
  padding: 10px;
  clear: left;
  text-align: center;
  font-size: 10px;
  font-family: arial;
  color: #fff;
}
.made-with-love i {
  font-style: normal;
  color: #f50057;
  font-size: 14px;
  position: relative;
  top: 2px;
}
.made-with-love a {
  color: #fff;
  text-decoration: none;
}
.made-with-love a:hover {
  text-decoration: underline;
}

/* for custom scrollbar for webkit browser*/

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
</style>
