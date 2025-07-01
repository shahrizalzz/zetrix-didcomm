<script>
export default {
  data() {
    return {
    };
  },
  name: "NavBar",
};
</script>

<template>
  <v-app-bar :elevation="1" color="white">
    <v-app-bar-title>
      <v-img :width="150" aspect-ratio="16/9" cover src="../../assets/images/Zetrix-Logo-small-black.png"
        class="responsive-img"></v-img>
    </v-app-bar-title>
  </v-app-bar>
</template>

<style>
.responsive-img {
  max-width: 100%;
  height: auto;
  cursor: pointer;
}

</style>
