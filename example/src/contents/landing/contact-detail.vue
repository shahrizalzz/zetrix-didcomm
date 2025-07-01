<script>
export default {
  props: {
    recipient: {
      type: Object, // Replace with the correct data type (e.g., Object, Array) if `currentRecipient` is not a string
      required: true,
    },
  },
  computed: {
    processMessages() {
      const recipientMessage = this.$store.state.recipientMessage || [];

      // Ensure it's an array and filter by recipientDid
      if (Array.isArray(recipientMessage)) {
        return recipientMessage.filter((item) => {
          // Check if the item has a `recipientDid` property matching `recipient`
          return item.recipientDid === this.recipient.did;
        });
      }

      // Return an empty array if recipientMessage is not an array
      return [];
    }
  },
  data() {
    return {
      dialog: false,
      rawMsg: null,
    };
  },
  methods: {
    viewMessage(rawMsg) {
      this.dialog = true
      this.rawMsg = JSON.stringify(rawMsg, null, 2); // Pretty print the JSON
    },
  }
};
</script>

<template>
  <div class="spacer"></div>
  <v-card class="mb-4 pb-4" v-for="(message, index) in processMessages" :key="index">
    <v-card-title class="d-flex justify-space-between"
      :style="{ backgroundColor: message.comm === 'Received' ? 'royalblue' : 'green', color: 'white' }">
      <span>{{ message.title }} - {{ message.time }}</span>
      <span>
        {{ message.comm }}
        <v-icon>
          {{ message.comm === 'Received' ? 'mdi-arrow-left' : 'mdi-arrow-right' }}
        </v-icon>
      </span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text class="ml-2">
      <div v-if="message.type === 'list'">
        <ul>
          <li v-for="(item, idx) in message.items" :key="idx">
            <a :href="item.id" target="_blank">{{ item.id }}</a>
          </li>
        </ul>
      </div>
      <div v-else>
        <p>{{ message.content }}</p>
      </div>
    </v-card-text>
    <v-btn class="ml-2" prepend-icon="mdi-plus" @click="viewMessage(message.rawMsg)" variant="outlined">
      View Message
    </v-btn>
  </v-card>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="800">
      <v-card title="Raw DIDComm Message">
        <v-card-text>
          <v-textarea v-model="rawMsg" variant="outlined" row-height="120" rows="13" density="comfortable"
            readonly></v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<style scoped>
.v-card-title {
  font-size: 1.1rem;
}
</style>