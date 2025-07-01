<script>
import ContactDetail from "@/contents/landing/contact-detail.vue";
import { shortenUserName } from "../../utils/filter";
import DIDComm from "../../lib/didcomm";
import { mapState } from "vuex";

export default {
  components: {
    ContactDetail,
  },
  mixins: [DIDComm],
  methods: {
    shortenUserName(string) {
      return shortenUserName(string);
    },
    onClick(recipient) {
      this.contactDetail = true
      this.currentRecipient = recipient
      this.$store.commit("setCurrentRecipient", recipient);
    },
    async addToContact() {
      if (this.contactDid != null && this.contactDid != '') {
        this.dialog = false
        const result = await this.addContact(this.contactDid)
        if (!result) {
          this.snackbar = true;
        }
        this.contactDid = null
      }
    },
    async sendMessage() {
      await this.sendBasicMessage(this.currentRecipient.did, this.currentRecipient.publicKey, this.textMessage)
    }
  },
  name: "Contact",
  computed: {
    ...mapState({
      recipientDid: (state) => state.recipientDid, // Map the array to a computed property
    }),
  },
  data() {
    return {
      contactDid: null,
      dialog: false,
      contactDetail: false,
      snackbar: false,
      timeout: 2000,
      currentRecipient: null,
      textMessage: ''
    };
  },
};
</script>

<template>
  <div v-if="!contactDetail">
    <v-card class="ma-2 fill-height">
      <v-card-title class="d-flex align-center">
        <span class="text-h6">Contacts</span>
        <v-spacer></v-spacer>
        <v-btn prepend-icon="mdi-plus" color="green" @click="dialog = true">
          New Contact
        </v-btn>
      </v-card-title>
      <v-card-text class="contact-list">
        <v-list>
          <!-- Loop through recipientDid array -->
          <v-list-item v-for="recipient in recipientDid" :key="recipient.did" @click="onClick(recipient)"
            class="button-like" :hover="true">
            <v-list-item-title class="truncate">
              <v-icon style="margin-right: 10px;">mdi-account</v-icon>
              <span>{{ shortenUserName(recipient.did) }}</span>
            </v-list-item-title>
          </v-list-item>
          <v-divider v-if="recipientDid.length > 0" />
        </v-list>
      </v-card-text>
    </v-card>
    <div class="pa-4 text-center">
      <v-dialog v-model="dialog" max-width="600">
        <v-card prepend-icon="mdi-account" title="Add New Contact">
          <v-card-text>
            <v-text-field v-model="contactDid" label="DID of the contact" required></v-text-field>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
            <v-btn color="primary" text="Save" variant="tonal" @click="addToContact"></v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </div>
  <div v-else>
    <div class="message-list ma-2 fill-height">
      <div class="d-flex justify-space-between">
        <v-btn prepend-icon="mdi-arrow-left" @click="contactDetail = false" variant="text" size="small">
          Back to Contacts
        </v-btn>
        <span>{{ shortenUserName(currentRecipient.did) }}</span>
      </div>
      <ContactDetail :recipient="currentRecipient"></ContactDetail>
    </div>
    <div class="inline-text-btn ma-2">
      <v-text-field v-model="textMessage" density="comfortable" placeholder="Type your message..." variant="solo"
        clearable hide-details></v-text-field>
      <v-btn prepend-icon="mdi-send" size="large" color="blue" @click="sendMessage">
        Send
      </v-btn>
    </div>

  </div>
  <v-snackbar v-model="snackbar" :timeout="timeout">
    {{ errorMsg }}
    <template v-slot:actions>
      <v-btn color="blue" variant="text" @click="snackbar = false">
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<style scoped>
.button-like {
  cursor: pointer;
  transition: background-color 0.3s;
}

.button-like:hover {
  background-color: rgba(0, 0, 0, 0.08);
  /* Add hover effect */
}

.contact-list {
  max-height: 700px;
  /* Adjust the height to your needs */
  overflow-y: auto;
  padding: 10px;
}

.message-list {
  max-height: 600px;
  /* Adjust the height to your needs */
  overflow-y: auto;
  padding: 10px;
  /* Optional: adds spacing around the messages */
  border: 1px solid #ccc;
  /* Optional: adds a border for visual separation */
  border-radius: 8px;
  /* Optional: rounds the corners */
}

.inline-text-btn {
  margin-top: 20px;
  display: flex;
}
</style>
