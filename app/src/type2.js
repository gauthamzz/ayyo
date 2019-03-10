// <meta name="restrictedextras" content="add id over here" />

import Web3 from "web3";
import creatorCoinArtifact from "../../build/contracts/Creator.json";

function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }

  return '';
}

function addImageOnTop(element){
  var rect = element.getBoundingClientRect();
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  console.log(rect.top, rect.right, rect.bottom, rect.left);
  console.log(width,height);
  let content = '<div id="payforviewplaceholder" style=" position:absolute;left:'+ rect.left+'px;top:'+rect.top+'px;"> \
  <img  src="https://via.placeholder.com/'+rect.width+'x'+rect.height+'/f7f7f7/000?text=Premium+Content+Click+to+Pay" onclick="App.payContent()" style="box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25);;z-index:999">\
  </div>'
  document.body.innerHTML = document.body.innerHTML + content;
}
function hide(elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = "none";
  }
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
      let addressOfContract = getMeta('contractAddress');
      console.log("Using contract address at " + addressOfContract)
      if(!addressOfContract){
      const deployedNetwork = creatorCoinArtifact.networks[networkId];
      addressOfContract = deployedNetwork.address;
      }
      console.log("Using contract address at " + addressOfContract)
      this.meta = new web3.eth.Contract(
        creatorCoinArtifact.abi,
        addressOfContract
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
    console.log("balance is" + balance)

    const balanceElement = document.getElementsByClassName("balance")[0];

    if (balance == 3) {
      let divToHide = getMeta('restrictedextras');
      let element = document.getElementById(divToHide);
      addImageOnTop(element);


    } else {
      var paywall = document.getElementById("payforviewplaceholder");
      if (paywall) {
        hide(document.getElementById("payforviewplaceholder"));
      }
     
    }
    // balanceElement.innerHTML = balance;
  },

  payContent: async function() {
    // const amount = parseInt(document.getElementById("amount").value);
    const { getPrice } = this.meta.methods;
    let amount = await getPrice().call();
    const { getLength } = this.meta.methods;
    let lengthOfTokens = await getLength().call();
    
    amount = parseInt(amount) + parseFloat(0.001*lengthOfTokens);
    console.log(amount)

    // this.setStatus("Initiating transaction... (please wait)");

    const { payContent } = this.meta.methods;
    await payContent().send({
      value: web3.toWei(amount, "ether"),
      from: this.account,
      gas: "1000000"
    });

    // this.setStatus("Transaction complete!");
    this.refreshBalance();
  },

  setStatus: function(message) {
    // const status = document.getElementById("status");
    // status.innerHTML = message;
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
