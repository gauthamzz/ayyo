// <meta name="restrictedextras" content="add id over here" />

import Web3 from "web3";
import creatorCoinArtifact from "../../build/contracts/CreatorFactory.json";


const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
    const { web3 } = this;

    try {
      // get contract instance
      const networkId = await web3.eth.net.getId();
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
  <div class="card-content"> \
    <p class="subtitle"> \
     '+entry+'\
    </p>\
  </div> \
  <footer class="card-footer">\
    <p class="card-footer-item">\
      <span>\
        Add <a href="#">Paywall</a>\
      </span>\
    </p>\
    <p class="card-footer-item">\
      <span> \
        Add <a href="#">Premium Element</a> \
      </span> \
      <span  id="premium"> Awesome \
      </span> \
    </p>\
  </footer>\
</div> <br>\
     ' )})
    

    balanceElement.innerHTML = content;
  },

  createCreator: async function() {
    const expiration = parseInt(document.getElementById("expiration").value);
    const price = parseInt(document.getElementById("price").value);

    const { createCreator } = this.meta.methods;
    await createCreator(expiration, price).send({
      from: this.account
    });

    this.setStatus("Transaction complete!");
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
