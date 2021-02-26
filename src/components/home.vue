<template>
  <div>
    <div style="margin-left:20%;width:60%;height:auto">
      <el-button
        v-if="!($store.state.metaMaskInstalled && $store.state.metaMaskConnected)"
        type="primary"
        @click="connectMetaMask"
      >Connect MetaMask</el-button>
      <el-table
        :data="tableData"
        style="width:100%"
        @row-click="addLiquidity"
        highlight-current-row
      >
        <el-table-column type="index" label="#" width="50"></el-table-column>
        <el-table-column property="name" label="Available Pools"></el-table-column>
        <el-table-column property="liquidity" label="Liquidity"></el-table-column>
        <el-table-column>
          <template>
            <el-button size="Large">
              <i class="el-icon-circle-plus"></i>Add Liquidity
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="Add Liquidity"
        :visible.sync="liquidityDialog"
        width="60%"
        style="text-align: left"
      >
        <div v-if="($store.state.metaMaskInstalled && $store.state.metaMaskConnected)">
          <i class="el-icon-success" style="color:#409EFF">Connected</i>
        </div>
        <div v-if="!($store.state.metaMaskInstalled && $store.state.metaMaskConnected)">
          <i class="el-icon-error" style="color:#909399">Disconnected</i>
        </div>
        <el-form>
          <el-form-item>
            <span style="color: #657795;font-size:18px;">
              Available
              <span>{{form.coinType}}</span>
            </span>
            <span style="color: #002237;font-size:18px;">{{web3.balance}}</span>

            <!-- <label>{{web3.balance}}</label>
            <br />
            <label>{{web3.isInjected}}</label>
            <br />
            <label>{{$store.state.metaMaskInstalled}}</label>
            <br />
            <label>{{$store.state.metaMaskConnected}}</label>-->
          </el-form-item>
          <el-form>
            <el-input class="input-medium" placeholder="Enter Amount" v-model="form.transAmount"></el-input>
            <el-select v-model="form.coinType" placeholder="请选择">
              <el-option
                v-for="item in coinTypeList"
                :key="item"
                :label="item"
                :value="item"
              ></el-option>
            </el-select>
          </el-form>
        </el-form>
      </el-dialog>
      <el-dialog
        title="Connect Wallet"
        :visible.sync="connectDialog"
        width="60%"
        style="text-align: left"
      >
        <div style="margin-left:20px;">
          <img src="../../static/img/meta_mask.png" alt="MetaMask" style="margin-left:10px;" />
        </div>
        <div>
          <p style="font-size:20px">
            You'll need to install
            <b>MetaMask</b> to continue. Once you have it installed, go ahead and
            <span
              class="bn-onboard-clickable"
              style="color: #4a90e2; font-family: inherit;cursor: pointer"
              onclick="{window.location.reload();}"
            >refresh the page.</span>
          </p>
          <el-button type="primary" round plain @click="gotoMask">Install MetaMask</el-button>
          <el-button
            style="float:right;margin-right:50px;"
            type="primary"
            round
            plain
            @click="connectDialog=false"
          >Back</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  beforeCreate() {
    this.$store.dispatch("registerWeb3");
  },
  data() {
    return {
      tableData: [{ name: "Uniswap", liquidity: "$619,300,942" }],
      liquidityDialog: false,
      isConnected: false,
      web3: this.$store.state.web3,
      connectDialog: false,
      form: {
        transAmount: 0,
        coinType: "ETH",
      },
      coinTypeList: ["ETH"]
    };
  },
  methods: {
    // linkMask() {
    //   ethereum.request({ method: "eth_requestAccounts" });
    // },
    addLiquidity(row, event, column) {
      this.liquidityDialog = true;
    },
    gotoMask() {
      window.open("https://metamask.io");
    },
    connectMetaMask() {
      if (!this.$store.state.metaMaskInstalled) {
        this.connectDialog = true;
      } else if (!this.$store.state.metaMaskConnected) {
        ethereum.request({ method: "eth_requestAccounts" });
      }
    },
    // checkPlugins() {
    //   var web3js = window.web3;
    //   if (typeof web3js !== "undefined") {
    //     this.web3 = new Web3(web3js.currentProvider);
    //     console.log(true);
    //     return true;
    //   } else {
    //     console.log(false);
    //     return false;
    //   }
    // },
  },
  mounted() {},
};
</script>

<style scoped>
.input-medium {
  height: 20px;
  width: 180px;
}
</style>