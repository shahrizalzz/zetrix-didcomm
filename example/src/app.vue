<template>
  <v-app>
    <v-main>
      <NavBar />
      <router-view />
      <FooterBar />
    </v-main>
  </v-app>
</template>

<script>
import { defineComponent } from "vue";
import NavBar from "./components/appBar/navBar.vue";
import FooterBar from "./components/appBar/footerBar.vue";

export default defineComponent({
  name: "App",
  components: {
    NavBar,
    FooterBar,
  },
  data() {
    return {
      //
    };
  },
});
</script>

<style>
main {
  background-color: #f9f9f9;
}

div {
  font-family: "Gilroy", sans-serif !important;
}
</style>
