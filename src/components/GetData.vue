<template>
  <div>
    <div class="file-input">
      <input @change="loadTextFromFile" type="file" id="file" />
      <span class="button">Escolher arquivo</span>
      <span class="label" v-if="file === ''">Nenhum arquivo selecionado</span>
      <span v-else class="label">{{ filename }}</span>
    </div>

    <input v-model="frames" type="text" />
    <input v-model="timeToResetBitR" type="number" />
  </div>
</template>

<script>
export default {
  name: 'GetData',
  data() {
    return {
      filename: '',
      file: '',
      frames: '',
      timeToResetBitR: 0,
    }
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      this.getFileName(ev.target.files[0].name);

      reader.onload = e => {
        console.log(e)
        this.file = e.target.result;
        // this.$emit("loaded", e.target.result);
      }
      reader.readAsText(file);
    },
    getFileName(filename) {
      this.filename = filename.slice(0, 25) + '...'
    }
  }
};
</script>

<style lang="scss" scoped>
.file-input {
  display: inline-block;
  text-align: left;
  background: #fff;
  border: 2px solid #1017e4;
  padding: 10px;
  width: 400px;
  position: relative;
  border-radius: 5px;
}

.file-input > [type="file"] {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  z-index: 10;
  cursor: pointer;
}

.file-input > .button {
  display: inline-block;
  cursor: pointer;
  background: #eee;
  padding: 8px 16px;
  border-radius: 2px;
  margin-right: 8px;
}

.file-input:hover > .button {
  background: dodgerblue;
  color: white;
}

.file-input > .label {
  color: #333;
  white-space: nowrap;
  opacity: 0.3;
}

.file-input.-chosen > .label {
  opacity: 1;
}
</style>
