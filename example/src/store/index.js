import { createStore } from 'vuex';
import dispatchActionForAllModules from "../utils/dispatch-action-for-all-modules";

import modules from "../state/modules";

export default createStore({
  modules,
  state: {
    msgWrapper: [], // This will store your JSON data
    recipientDid: [],
    recipientMessage: [],
    currentRecipient: null,
  },
  mutations: {
    setMsgWrapper(state, data) {
      state.msgWrapper = data;
    },
    addToMsgWrapper(state, item) {
      state.msgWrapper.push(item);
    },
    setRecipientDid(state, data) {
      state.recipientDid = data;
    },
    addToRecipientDid(state, item) {
      state.recipientDid.push(item);
    },
    addToRecipientMessage(state, item) {
      state.recipientMessage.push(item);
    },
    setCurrentRecipient(state, data) {
      state.currentRecipient = data;
    },
  },
  actions: {
    // Action to fetch or receive JSON data and commit it to the mutation
    addSentMessage({ commit }, message) {
      const record = {
        message: JSON.parse(message),
        timestamp: new Date(),
        topic: 'Sent',
      }
      commit("addToMsgWrapper", record);
    },
    addReceivedMessage({ commit }, message) {
      const record = {
        message: message,
        timestamp: new Date(),
        topic: 'Received',
      }
      commit("addToMsgWrapper", record);
    },
    addLogMessage({ commit }, message) {
      const record = {
        message: message,
        timestamp: new Date(),
        topic: 'Log',
      }
      commit("addToMsgWrapper", record);
    },
    addRecipient({ commit }, { did, pubKey }) {
      const recipientDid = {
        did: did,
        publicKey: pubKey
      }
      commit("addToRecipientDid", recipientDid)
    },
    addRecipientMessage({ commit }, recipientMsg ) {
      commit("addToRecipientMessage", recipientMsg)
    },
  },
  getters: {
    // Getter to retrieve JSON data from the state
    hasRecipient: (state) => (did) => {
      return state.recipientDid.some((recipient) => recipient.did === did);
    },
  },
});

dispatchActionForAllModules("init");
