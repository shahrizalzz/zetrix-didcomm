import { createApp } from "vue";
import App from "./app.vue";
import router from "./router";
import store from "./store";
import { loadFonts } from "./plugins/webfontloader";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import "@mdi/font/css/materialdesignicons.css"; // Ensure this line is present
// import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { VDateInput } from "vuetify/labs/VDateInput";
import "./assets/styles/fonts.css";
import "./assets/styles/colors.css";
import "./assets/styles/containers.css";
import "./assets/styles/buttons.css";
import "./assets/styles/icons.css";
import axios from "axios";

loadFonts();

axios.defaults.baseURL = process.env.VUE_APP_API_BASE_URL;

const vuetify = createVuetify({
  components: {
    VDateInput,
  },
  directives,
  icons: {
    defaultSet: "mdi", // Ensure default icon set is mdi
  },
});

createApp(App).use(router).use(store).use(vuetify).mount("#app");
