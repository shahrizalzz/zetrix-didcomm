import axios from "axios";

export const state = {
  cached: "",
};

export const getters = {};

export const mutations = {};

export const actions = {
  async createZid(
    { commit, state, rootState }
  ) {
    return axios
      .post(`/cred/zid/create`)
      .then((response) => {
        if (response.data != null && response.data.object != null) {
          return response.data.object;
        }
        return null;
      })
      .catch(function (error) {
        return error;
      });
  },

  async resolveMediator(
    { commit, state, rootState }
  ) {
    return axios
      .get(`/cred/didcomm/.well-known/did.json`)
      .then((response) => {
        if (response.data != null) {
          return response.data;
        }
        return null;
      })
      .catch(function (error) {
        return error;
      });
  },

  async sendMessage({ commit, state, rootState }, { jwe }) {
    return axios
      .post(`/cred/didcomm/message`, {
        recipients: jwe.recipients,
        iv: jwe.iv,
        ciphertext: jwe.ciphertext,
        tag: jwe.tag,
        protected: jwe.protected,
      })
      .then((response) => {
        if (response.data != null) {
          return response.data;
        }
        return null;
      })
      .catch(function (error) {
        return error;
      });
  },

  async resolveRecipient(
    { commit, state, rootState }, { zid }
  ) {
    return axios
      .get(`/cred/zid/resolve/${zid}`)
      .then((response) => {
        if (response.data != null && response.data.object != null) {
          return response.data.object;
        }
        return null;
      })
      .catch(function (error) {
        return error;
      });
  },
};
