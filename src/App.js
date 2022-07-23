import React, { useState, useEffect } from "react";
import './App.css';
import Web3 from 'web3'
import Biconomy from "@biconomy/mexa";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
//import BatchTransactionWithBiconomy from "./BatchTransactionWithBiconomy.json";
const { config } = require("./config");
const showErrorMessage = message => {
  NotificationManager.error(message, "Error", 5000);
};
const showSuccessMessage = message => {
  NotificationManager.success(message, "Message", 3000);
};

const showInfoMessage = message => {
  NotificationManager.info(message, "Info", 3000);
};

let contract;

let web3;

let boy;

let accounts;

function App() {


  const [newQuote, setNewQuote] = useState("");
  useEffect(() => {


    if (!window.ethereum) {
      showErrorMessage("Metamask is required to use this DApp")
      return;
    }

    // NOTE: dappId is no longer needed in latest version of Biconomy SDK
    const biconomy = new Biconomy(window.ethereum, { dappId: "62d7a3033e6a2b4a39e078a4", apiKey: "za0ZYf08s.b7bce44b-7570-4567-b20c-d3a8f41bf3f4"});

    web3 = new Web3(biconomy);


    biconomy.onEvent(biconomy.READY, async () => {
      // Initialize your dapp here like getting user accounts etc

      await window.ethereum.enable();
      accounts=await web3.eth.getAccounts()
      console.log("accounts: ",accounts)

      const networkId = await web3.eth.net.getId();
      console.log("network: ",networkId)
      console.log("config address: ",config.contract.address)
      const deployedNetwork = 97;
      contract = new web3.eth.Contract(config.contract.abi, deployedNetwork && config.contract.address);
    }).onEvent(biconomy.ERROR, (error, message) => {
      // Handle error while initializing mexa
      console.log(error)
    });
  }
    , []);

  const onQuoteChange = event => {
    setNewQuote(event.target.value);
  };

  console.log("response: ", newQuote)

  async function onButtonClickMeta(){
    console.log(window.ethereum.selectedAddress)
    boy = newQuote;
    let address = window.ethereum.selectedAddress;
    await contract.methods.BatchTransfer(newQuote).call({from: address});
    //let message = {};
    //message.nonce = parseInt(nonce);
    //message.from = window.ethereum.selectedAddress;
  }

  return (
    <div className="App">
      *Use this DApp only on Kovan Network
      <header className="App-header">
        <h1>Quotes</h1>
        <section className="main">
          <div className="mb-wrap mb-style-2">
            <blockquote cite="http://www.gutenberg.org/ebboks/11">
              <h4>quote </h4>
            </blockquote>
          </div>

          <div className="mb-attribution">
            <p className="mb-author">- owner</p>
          </div>
        </section>
        <section>
          <div className="submit-container">
            <div className="submit-row">
              <input size="100"
                border-radius="15"
                type="text"
                placeholder="Enter your quote"
                onChange={onQuoteChange}
                value={newQuote}
              />
              <button type="button" className="button" onClick={onButtonClickMeta}>Submit</button>
            </div>
          </div>
        </section>
      </header>
      <NotificationContainer />
    </div >
  );
}

export default App;