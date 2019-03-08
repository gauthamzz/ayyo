import Web3 from "web3";
import creatorCoinArtifact from "../../build/contracts/Creator.json";

function hide(elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = "none";
  }
}

function addRow() {
  let content =
    ' <div id="paywall"\
  <h1>ayo</h1> \
  <p>You have <strong class="balance">loading...</strong> Ayo</p> <h1>Send MetaCoin</h1> \
  <label for="amount">Amount:</label> \
  <input type="text" id="amount" placeholder="e.g. 95" /> \
  <button class="button" onclick="App.payContent()">Make Creator Token</button> \
  <p id="status"></p> \
  <p> \
    <strong>Hint:</strong> open the browser developer console to view any \
    errors and warnings. \
  </p> \
  </div>  \
  ';
  document.body.innerHTML = document.body.innerHTML + content;
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
    const { balanceOf } = this.meta.methods;
    const balance = await balanceOf(this.account).call();

    const balanceElement = document.getElementsByClassName("balance")[0];

    if (balance == 0) {
      document.body.style.backgroundColor = "red";
      document.body.style.margin = "0";
      document.body.style.height = "100%";
      document.body.style.overflowY = "hidden";
      document.getElementsByTagName("html")[0].style.overflow = "hidden";
      addRow();
    } else {
      var paywall = document.getElementById("paywall");
      if (paywall) {
        hide(document.getElementById("paywall"));
      }

      document.body.style.backgroundColor = "lightgreen";
      document.body.style.overflowY = "";
      document.getElementsByTagName("html")[0].style.overflow = "";
    }
    balanceElement.innerHTML = balance;
  },

  payContent: async function() {
    const amount = parseInt(document.getElementById("amount").value);

    this.setStatus("Initiating transaction... (please wait)");

    const { payContent } = this.meta.methods;
    await payContent().send({
      value: web3.toWei(amount, "ether"),
      from: this.account,
      gas: "1000000"
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
