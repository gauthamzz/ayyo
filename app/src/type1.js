// basic version to be included 
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

function hide(elements) {
  elements = elements.length ? elements : [elements];
  for (var index = 0; index < elements.length; index++) {
    elements[index].style.display = "none";
  }
}

function addRow() {
  let content = ' <div id ="paywall"  > \
  <div class="card" style="position:absolute; bottom:0;z-index: 200;width: 90%;left: 50%;transform: translate(-50%, -10%);box-shadow: 0px 4px 72px rgba(0, 0, 0, 0.25);"> \
    <div class="card-content" > \
        <div class="media"> \
          <div class="media-left"> \
            <figure class="image is-128x128"> \
              <img src="https://i.ibb.co/BPNLV54/07.png" alt="Placeholder image"> \
            </figure> \
          </div> \
          <div class="media-content has-text-centered"> \
            <div class="columns"> \
              <div class="column is-four-fifths"> \
                <div class="title" > \
                    Buy premium content! \
                </div> \
                <div class="subtitle"> \
                  Become a member now for $5/month to read this story and get unlimited access to all of the best stories on this website. \
                </div> \
              </div> \
              <div class="column"> \
                  <div class="button is-large is-primary"  onclick="App.payContent()"> \
                    Buy Now  \
                  </div> \
              </div> \
            </div> \
          </div> \
        </div> \
        </div> \
</div> \
  </div>'
  
  // let content =
  //   ' <div id="paywall card"\
  // <h1>ayo</h1> \
  // <p>You have <strong class="balance">loading...</strong> Ayo</p> <h1>Send MetaCoin</h1> \
  // <label for="amount">Amount:</label> \
  // <input type="text" id="amount" placeholder="e.g. 95" /> \
  // <button class="button" onclick="App.payContent()">Make Creator Token</button> \
  // <p id="status"></p> \
  // <p> \
  //   <strong>Hint:</strong> open the browser developer console to view any \
  //   errors and warnings. \
  // </p> \
  // </div>  \
  // ';
  document.body.innerHTML = document.body.innerHTML + content;


  var cssId = 'bulma';  // you could encode the css path itself to generate id..
if (!document.getElementById(cssId))
{
    var head  = document.getElementsByTagName('head')[0];
    var link  = document.createElement('link');
    link.id   = cssId;
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.4/css/bulma.min.css';
    link.media = 'all';
    head.appendChild(link);
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

    const balanceElement = document.getElementsByClassName("balance")[0];

    if (balance == 0) {
      document.getElementsByTagName("html")[0].style.overflow = "hidden";
      addRow();
    } else {
      var paywall = document.getElementById("paywall");
      if (paywall) {
        hide(document.getElementById("paywall"));
      }

      // document.body.style.backgroundColor = "lightgreen";
      document.body.style.overflowY = "";
      document.getElementsByTagName("html")[0].style.overflow = "";
    }
    // balanceElement.innerHTML = balance;
  },
  payContent: async function() {
    // const amount = parseInt(document.getElementById("amount").value);
    const { getPrice } = this.meta.methods;
    let amount = await getPrice().call();

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
