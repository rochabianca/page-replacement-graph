<template>
  <div class="get-data">
    <div class="get-data__input">
      <label>Escolha seu arquivo</label>
      <get-file v-model="file" />
    </div>

    <div class="get-data__input">
      <label for="frames">Quantidade de Frames</label>
      <input
        class="get-data__input--input"
        id="frames"
        v-model="frames"
        type="text"
      />
    </div>
    <div class="get-data__input">
      <label for="frames">Tempo para resetar o bit R</label>
      <input
        class="get-data__input--input"
        v-model="timeToResetBitR"
        type="number"
      />
    </div>
    <div class="get-data__input">
      <button @click="calculate" class="btn">Calcular</button>
    </div>
  </div>
</template>

<script>
import GetFile from './GetFile';

export default {
  name: 'GetData',
  components: {
    GetFile
  },
  data() {
    return {
      file: '',
      frames: '',
      timeToResetBitR: 0,
    }
  },
  methods: {
    calculate() {
      this.$emit('calculate-results', {
        algorithm: this.file,
        frames: this.framesArray,
        timeToResetBitR: this.timeToResetBitR,
      })
    },
  },
  computed: {
    framesArray() {
      return this.frames.split(',').map(function (item) {
        return parseInt(item, 10);
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/variables.scss";

.get-data {
  margin-top: 60px;
  margin-bottom: 60px;
  background-color: $primary;
  padding: 30px 15px;
  display: flex;
  align-items: flex-end;
  .get-data__input {
    margin: 0 15px;
    label {
      font-size: 18px;
      display: block;
      color: white;
      margin-bottom: 5px;
    }
    .get-data__input--input {
      padding: 5px;
      height: 35px;
      border: none;
      border-radius: 5px;
      width: 100%;
    }
  }
}

.btn {
  width: 160px;
  height: 46px;
  border-radius: 5px;
  font-size: 16px;
  text-transform: uppercase;
  background: $black;
  color: white;
  transition: all ease 0.3s;
  border: none;

  &:hover {
    background: white;
    color: $black;
  }
}
</style>
