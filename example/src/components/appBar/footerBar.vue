<script>
export default {
  name: "FooterBar",
};
</script>

<template>
  <v-footer color="white" class="footer">
    <v-row justify="center" no-gutters>
      <v-col class="text-center" cols="12">
        Copyright © {{ new Date().getFullYear() }} Zetrix. All rights reserved.
      </v-col>
    </v-row>
  </v-footer>
</template>

<style>
.footer {
  border-top: 1px solid #b2b2b2; /* Set the top border color to grey */
}
</style>
