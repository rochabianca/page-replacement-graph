<template>
  <div class="file-input">
    <input @change="loadTextFromFile" type="file" id="file" />
    <span class="button">Escolher arquivo</span>
    <span class="label" v-if="file === ''">Nenhum arquivo selecionado</span>
    <span v-else class="label">{{ filename }}</span>
  </div>
</template>

<script>
export default {
  name: 'GetFile',
  data() {
    return {
      filename: '',
      file: '',
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
        this.$emit("input", e.target.result);
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
@import "@/assets/variables.scss";

.file-input {
  display: inline-block;
  text-align: left;
  background: #fff;
  padding: 5px;
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
  background: $gray;
  padding: 8px 16px;
  border-radius: 5px;
  margin-right: 8px;
  transition: all ease 0.3s;
}

.file-input:hover > .button {
  background: $black;
  color: white;
}

.file-input > .label {
  color: $black;
  white-space: nowrap;
  opacity: 0.3;
}

.file-input.-chosen > .label {
  opacity: 1;
}
</style>

