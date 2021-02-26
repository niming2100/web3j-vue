import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  state,
  mutations: {
    registerWeb3Instance(state, payload) {
      let result = payload
      let web3Copy = state.web3
      web3Copy.coinbase = result.coinbase
      web3Copy.networkId = result.networkId
      web3Copy.balance = parseInt(result.balance, 10)
      web3Copy.isInjected = result.injectedWeb3
      web3Copy.web3Instance = result.web3
      state.web3 = web3Copy
      pollWeb3()
    },
    modifyPluginInstalled(state, payload) {
      state.metaMaskInstalled = payload;
    },
    modifyMetaMaskConnected(state, payload) {
      state.metaMaskConnected = payload;
    },
    pollWeb3Instance(state, payload) {
      console.log('pollWeb3Instance mutation being executed', payload)
      state.web3.coinbase = payload.coinbase
      state.web3.balance = parseInt(payload.balance, 10)
    }
  },
  actions: {
    registerWeb3({ commit }) {
      new Promise(function (resolve, reject) {
        // Check for injected web3 (mist/metamask)
        var web3js = window.web3
        if (typeof web3js !== 'undefined') {
          commit('modifyPluginInstalled', true);
          var web3 = new Web3(web3js.currentProvider)
          resolve({
            injectedWeb3: web3.isConnected(),
            web3() {
              return web3
            }
          })
        } else {
          commit('modifyPluginInstalled', false);
          reject(new Error('Unable to connect to Metamask'))
        }
      })
        .then(async result => {
          return new Promise(function (resolve, reject) {
            // Retrieve network ID
            result.web3().version.getNetwork((err, networkId) => {
              if (err) {
                // If we can't find a networkId keep result the same and reject the promise
                reject(new Error('Unable to retrieve network ID'))
              } else {
                // Assign the networkId property to our result and resolve promise
                result = Object.assign({}, result, { networkId })
                resolve(result)
              }
            })
          })
        })
        .then(result => {
          return new Promise(function (resolve, reject) {
            // Retrieve coinbase
            result.web3().eth.getCoinbase((err, coinbase) => {
              if (err) {
                reject(new Error('Unable to retrieve coinbase'))
              } else {
                if (coinbase === null) {
                  commit('modifyMetaMaskConnected', false);
                  reject(new Error('Plugin is not connected'))
                } else {
                  commit('modifyMetaMaskConnected', true);
                  result = Object.assign({}, result, { coinbase })
                  resolve(result)
                }
              }
            })
          })
        })
        .then(result => {
          return new Promise(function (resolve, reject) {
            // Retrieve balance for coinbase
            result.web3().eth.getBalance(result.coinbase, (err, balance) => {
              if (err) {
                reject(new Error('Unable to retrieve balance for address: ' + result.coinbase))
              } else {
                result = Object.assign({}, result, { balance })
                resolve(result)
              }
            })
          })
        }).then(result => {
          commit('registerWeb3Instance', result)
        }).catch(e => {
          console.log('error in action registerWeb3', e)
        })
    },
    pollWeb3({ commit }, payload) {
      commit('pollWeb3Instance', payload)
    }
  }
})