<script>
import Contact from "@/contents/landing/contact.vue";
import Message from "@/contents/landing/message.vue";
import DIDComm from "../../lib/didcomm";

export default {
  components: {
    Contact,
    Message
  },
  mixins: [DIDComm],
  async mounted() {
    this.getMediatorDid();
    await this.checkDid();
  },
  methods: {
    copyAddress(address) {
      const textField = document.createElement("textarea");
      textField.innerText = address;
      document.body.appendChild(textField);
      textField.select();
      document.execCommand("copy");
      textField.remove();
      this.snackbar = true;
    },
  },
  name: "MainPage",
  data() {
    return {
      snackbar: false,
      copyText: "DID copied",
      timeout: 2000,
    };
  },
};
</script>

<template>
  <v-row>
    <v-col>
      <v-card class="ma-2">
        <v-card-text>
          <div v-if="did">
            <span>Your DID: <b>{{ did }}</b></span>
            <v-btn icon="mdi-content-copy" variant="plain" size="x-small" @click="copyAddress(did)"></v-btn>
          </div>
          <div v-else>
            <span>Creating DID...</span>
          </div>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row no-gutters justify="center" class="d-flex">
    <v-col cols="12" sm="4" md="4" lg="4">
      <Contact></Contact>
    </v-col>
    <v-col cols="12" sm="8" md="8" lg="8">
      <Message></Message>
    </v-col>
  </v-row>
  <v-snackbar v-model="snackbar" :timeout="timeout">
    {{ copyText }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style></style>
