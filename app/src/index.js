// <meta name="restrictedextras" content="add id over here" />

import Web3 from "web3";
import creatorCoinArtifact from "../../build/contracts/CreatorFactory.json";
export function displayPaywallCode(){
  document.getElementById("paywallcode").style.display = "block";
  document.getElementById("paywall").style.display = "none";
}

const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
      // const networkType = web3.currentProvider.connection._url;
      // console.log(networkType)
      const deployedNetwork = creatorCoinArtifact.networks[networkId];
      this.meta = new web3.eth.Contract(
        creatorCoinArtifact.abi,
        deployedNetwork.address
      );

      // get accounts
      const accounts = await web3.eth.getAccounts();
      this.account = accounts[0];

      this.refreshBalance();
    } catch (error) {
      console.error("Could not connect to contract or chain.");
    }
  },

  refreshBalance: async function() {
    const { getDeployedCreators } = this.meta.methods;
    const balance = await getDeployedCreators().call();

    const balanceElement = document.getElementsByClassName("balance")[0];
    console.log(balance);
    var content = ""
    balance.forEach(function(entry) {
      content = content.concat('\
      <div class="card"> \
  <div class="card-content has-text-centered"> \
    <p class="subtitle"> \
     '+entry+'\
    </p>\
  </div> <hr> \
  <p class=" has-text-centered is-size-4">To add paywall copy paste this code in your HTML file </p><div class="box" style="margin:3%"> \
  <xmp id="paywallcode" style="" class="is-family-code is-size-7"> <meta name="contractAddress" content="'+ entry+'" />  </xmp> \
     <xmp id="paywallcode" style="" class="is-family-code is-size-7"> <script src="https://raw.githubusercontent.com/gauthamzz/ayyo/master/serve/paywall.js"></script> </xmp> \
    </div>  <hr> <p class="is-size-4 has-text-centered">Add Premium Content </p>\
    <div class="box" style="margin:3%"> <xmp class="is-family-code is-size-7"> \
      <meta name="restrictedextras" content="id of content you want to hide" />  </xmp> \
      <xmp class="is-family-code is-size-7"> <script src="https://raw.githubusercontent.com/gauthamzz/ayyo/master/serve/hide.js"></script> \
      </xmp> </div>\
</div> <br>\
     ' )})
    

    balanceElement.innerHTML = content;
  },

  createCreator: async function() {
    const expiration = parseInt(document.getElementById("expiration").value);
    const price = parseInt(document.getElementById("price").value);

    const { createCreator } = this.meta.methods;
   
    // skale 
    await createCreator(expiration, price).send({
      from: this.account,
      gas: 8000000
    });

    // // localhost
    // await createCreator(expiration, price).send({
    //   from: this.account
    // });

    // this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    const status = document.getElementById("status");
    status.innerHTML = message;
  }
};

window.App = App;

window.addEventListener("load", function() {
  if (window.ethereum) {
    // use MetaMask's provider
    App.web3 = new Web3(window.ethereum);
    window.ethereum.enable(); // get permission to access accounts
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    App.web3 = new Web3(
      new Web3.providers.HttpProvider("http://127.0.0.1:9545")
    );
  }

  App.start();
});
