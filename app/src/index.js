import Web3 from "web3";

//import starNotaryArtifact from "../../build/contracts/StarNotary.json";
import cottonTokenArtifact from "../../build/contracts/cottonToken.json";
import {transactionBytes} from "hd-wallet/lib/build-tx/coinselect-lib/utils";

const { soliditySha3 } = require("web3-utils");

const App = {
    web3: null,
    account: null,
    meta: null,

    start: async function() {
        const { web3 } = this;
        try {

            // get contract instance
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = cottonTokenArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                cottonTokenArtifact.abi,
                deployedNetwork.address,
            );
            // get accounts
            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];
        } catch (error) {
            console.error("Could not connect to contract or chain.");
        }

        //
        const contractUser1 = "0x1F4b4fc5328d67a4EF127A3E25656D36042E1F1A";
        const contractUser2 = "0x18a1B053a5CDBc27335fEa5Df706377821690217";


        let formCotton = "yarn";
        let certCotton = "regular";

        const nameElement = document.getElementById("name");
        const symbolElement = document.getElementById("symbol");
        const decimalsElement = document.getElementById("decimals");
        const structElement = document.getElementById("structElement");
        const contractAddressElement = document.getElementById("contractAddressElement");
        const transferEvent = document.getElementById("transferEvent");


        const { name, symbol, decimals, cotton } = this.meta.methods;
        const { Transfer } = this.meta.events;

        await name().call({from: this.account}).then(function (res) {
            nameElement.innerHTML += res;
        });
        await symbol().call({from: this.account}).then(function (res) {
            symbolElement.innerHTML += "("+res+")";
        });
        await decimals().call({from: this.account}).then(function (res) {
            decimalsElement.innerHTML += res;
        });
        await cotton(contractUser1,formCotton,certCotton).call({from: this.account}).then(function (res) {
            structElement.innerHTML += "<pre>"+JSON.stringify(res,null,'\t')+"<pre>";
        });
        contractAddressElement.innerHTML += this.meta._address;

        // History of events
        this.meta.events.TraceCotton({}, { fromBlock: 45, toBlock: 'latest' }).on(
            'data', function(event) {
               // console.log(event);
                transferEvent.innerHTML += "<pre>"+JSON.stringify(event,null,'\t')+"<pre>";
            }).on('error', console.error);
    },

    setTransferStatus: function(obj) {
        const from = document.getElementById("from");
        const to = document.getElementById("to");
        const value = document.getElementById("value");
        const transactionHash = document.getElementById("transactionHash");
        const gas = document.getElementById("gas");

        from.innerHTML = obj.events.Transfer.returnValues.from;
        to.innerHTML = obj.events.Transfer.returnValues.to;
        value.innerHTML = obj.events.Transfer.returnValues.value;
        transactionHash.innerHTML = obj.transactionHash;
        gas.innerHTML = obj.gasUsed + " ("+ (1860*obj.gasUsed)/10**9 + " USD)";

    },

    setStatus: function(message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },

    // Transfer Token
    transfer: async function (){

        const { transfer, cotton } = this.meta.methods;
        let recipient = document.getElementById("recipient").value;
        let amount = document.getElementById("amount").value;
        let form = document.getElementById("form").value;
        let certificate = document.getElementById("certificate").value;
        let ref = document.getElementById("ref").value;

        await transfer(recipient, amount, form, certificate, ref).send({from: this.account}).then(function (res) {
            console.log(res);
            App.setTransferStatus(res);
        });
        await cotton(recipient, form, certificate).call({from: this.account}).then(function (res) {
            structElement.innerHTML += "<pre>"+JSON.stringify(res,null,'\t')+"<pre>";
        });


    },

    // Get the Name of the Token
    getName: async function (){
        const { name } = this.meta.methods;
        await name().call({from: this.account}).then(function (res) {
            App.setStatus("The Name of the token is " + res + ".");
        });
    },

    // Get the symbol of the Token
    getSymbol: async function (){
        const { symbol } = this.meta.methods;
        await symbol().call({from: this.account}).then(function (res) {
            App.setStatus("The symbol of the token is " + res + ".");
        });
    }

};

window.App = App;

window.addEventListener("load", async function() {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
    }

    App.start();
});