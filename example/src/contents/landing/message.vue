<script>
import DIDComm from "../../lib/didcomm";

export default {
  components: {
  },
  methods: {
  },
  name: "Message",
  mixins: [DIDComm],
  data() {
    return {
      trustPing: '{\r\n  \"type\": \"https://didcomm.org/trust-ping/2.0/ping\",\r\n  \"body\": {\r\n    \"response_requested\": true\r\n  }\r\n}',
      items: ['Trust Ping', 'None'],
      selectedItem: 'Trust Ping',
      currentRecipient: this.$store.state.currentRecipient || null
    };
  },
  computed: {
    // Use Vuex getter to access msgWrapper
    formattedValue() {
      const msgWrapper = this.$store.state.msgWrapper || [];

      // Ensure it's an array
      if (Array.isArray(msgWrapper)) {
        return msgWrapper
          .map((item) => {
            // Check if the item has a `topic` property
            if (item.topic) {
              switch (item.topic) {
                case "Sent":
                  // For 'Sent', apply no color (default)
                  return `<span style="color: green;">sent: ${JSON.stringify(item.message, null, 2)}</span>`;
                case "Received":
                  // For 'Received', apply no color (default)
                  return `<span style="color: blue;">received: ${JSON.stringify(item.message, null, 2)}</span>`;
                case "Log":
                  // For 'Log', set color to gray
                  return `<span style="color: gray;">log: ${item.message}</span>`;
                default:
                  // Fallback for unsupported topics
                  return `<span style="color: orange;">unknown topic: ${JSON.stringify(item.message, null, 2)}</span>`;
              }
            } else {
              // Fallback if the item has no `topic` property
              return `<span style="color: red;">unknown: ${JSON.stringify(item, null, 2)}</span>`;
            }
          })
          .join("<br>"); // Separate each formatted element with line breaks
      }

      // If msgWrapper is not an array, handle it as a single item
      if (typeof msgWrapper === "object") {
        return `<pre>${JSON.stringify(msgWrapper, null, 2)}</pre>`;
      } else if (typeof msgWrapper === "string") {
        return msgWrapper;
      } else {
        return String(msgWrapper);
      }
    },
    msgSend() {
      if (this.selectedItem === 'Trust Ping') {
        return this.trustPing;
      }
      return null; // or any other default value
    },
    getCurrentRecipient() {
      this.currentRecipient = this.$store.state.currentRecipient || null
      return this.currentRecipient
    }

  },
  methods: {
    async sendAction() {
      if (this.selectedItem === 'Trust Ping') {
        this.sendPing(this.currentRecipient.did, this.currentRecipient.publicKey)
      } else {
        // will send custom

      }
    },
  }
};
</script>

<template>
  <v-card class="ma-2 fill-height">
    <div>
      <v-card-text>
        <div class="message-area" v-html="formattedValue"></div>
        <!-- <v-textarea v-model="formattedValue" variant="outlined" row-height="120" rows="13" density="comfortable"
          readonly style="font-family: monospace; white-space: pre-wrap;">
        </v-textarea> -->
        <!-- 
        <v-textarea v-model="msgSend" :rules="[validContractCode]" @input="validateInput" variant="outlined"
          row-height="50" rows="6" hint="Paste your JSON DIDComm message." density="comfortable">
        </v-textarea> -->
        <v-textarea v-model="msgSend" variant="outlined" row-height="50" rows="6"
          hint="Paste your JSON DIDComm message." density="comfortable">
        </v-textarea>
        <div class="inline-select-btn">
          <v-select v-model="selectedItem" :items="items" density="comfortable"></v-select>
          <v-btn prepend-icon="mdi-send" size="large" color="blue" :disabled="getCurrentRecipient == null"
            @click="sendAction">
            Send
          </v-btn>
        </div>

      </v-card-text>
    </div>
  </v-card>
</template>

<style scoped>
.message-area {
  height: 400px;
  width: 100%;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 4px;
  background-color: #f9f9f9;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-bottom: 16px;
}

.spacer {
  margin-top: 15px;
}

.inline-select-btn {
  display: flex;
}
</style>
<style></style>
