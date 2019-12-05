import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueGoogleCharts from "vue-google-charts";

Vue.use(VueGoogleCharts);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
