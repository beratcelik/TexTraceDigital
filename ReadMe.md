How to Create ERC-20 Token
Get started with the exercise, remember you will need to have installed the latest version of Truffle (v5)

1) Verify you have the Truffle (v5.0.2) latest installed if not use the command
`npm install -g truffle`

2) Use `mkdir SampleToken` to create a directory

3) `cd SampleToken`

4) Run the command: `truffle init` to initialize a truffle project.

5) Run `npm install @truffle/hdwallet-provider` used to set up the provider to connect to the Infura Node

6) Run `npm install @openzeppelin/contracts`

7) Go into your contracts folder, and create your token smart contract file SampleToken.sol

Code for SampleToken.sol

```
pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SampleToken is ERC20 {
    constructor(string memory _name, string memory _symbol, uint _initialSupply)
    ERC20(_name, _symbol) {
        require(_initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _mint(msg.sender, _initialSupply);
    }
}
```

Change the from `private` to `internal` of  `_balances` and `_totalSupply` in ERC20.sol

/node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol
```
contract ERC20 is Context, IERC20, IERC20Metadata {
    //mapping (address => uint256) private _balances;
    mapping (address => uint256) internal _balances;

    mapping (address => mapping (address => uint256)) private _allowances;

    // uint256 private _totalSupply;
    uint256 internal _totalSupply;
```

Create `2_deploy_contracts.js` at `/migrations/2_deploy_contracts.js`
and fill with
```
const sampleToken = artifacts.require("sampleToken");
const name = "My New Token";
const symbol = "MNT";
const decimals = 18;
const initialSupply = 1000 * (10 ** decimals);

module.exports = function (deployer) {
deployer.deploy(sampleToken, name, symbol, decimals, initialSupply);
};
```
truffle-config.js
```
/**
* Use this file to configure your truffle project. It's seeded with some
* common settings for different networks and features like migrations,
* compilation and testing. Uncomment the ones you need or modify
* them to suit your project as necessary.
*
* More information about configuration can be found at:
*
* trufflesuite.com/docs/advanced/configuration
*
* To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
* to sign your transactions before they're sent to a remote public node. Infura accounts
* are available for free at: infura.io/register.
*
* You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
* public/private key pairs. If you're publishing your code to GitHub make sure you load this
* phrase from a file you've .gitignored so it doesn't accidentally become public.
*
*/

const HDWalletProvider = require('@truffle/hdwallet-provider');
const infuraKey = "c7291f2b49194634acb4b8497de5c8e2";

// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
/**
* Networks define how you connect to your ethereum client and let you set the
* defaults web3 uses to send transactions. If you don't specify one truffle
* will spin up a development blockchain for you on port 9545 when you
* run `develop` or `test`. You can ask a truffle command to use a specific
* network from the command line, e.g
*
* $ truffle test --network <network-name>
  */

networks: {
// Useful for testing. The `development` name is special - truffle uses it by default
// if it's defined here and no other network is specified at the command line.
// You should run a client (like ganache-cli, geth or parity) in a separate terminal
// tab if you use this network and you must also set the `host`, `port` and `network_id`
// options below to some value.

     development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,       // rinkeby's id
      gas: 4500000,        // rinkeby has a lower block limit than mainnet
      gasPrice: 10000000000
    },
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websocket: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }

},

// Set default mocha options here, use special reporters etc.
mocha: {
// timeout: 100000
},

// Configure your compilers
compilers: {
solc: {
version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
// docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
// settings: {          // See the solidity docs for advice about optimization and evmVersion
//  optimizer: {
//    enabled: false,
//    runs: 200
//  },
//  evmVersion: "byzantium"
// }
}
},

// Truffle DB is currently disabled by default; to enable it, change enabled: false to enabled: true
//
// Note: if you migrated your contracts prior to enabling this field in your Truffle project and want
// those previously migrated contracts available in the .db directory, you will need to run the following:
// $ truffle migrate --reset --compile-all

db: {
enabled: false
}
};
````

###Steps to Get Started with Infura

Go to https://infura.io

Click on “Get Started for FREE”. Once you sign up, you will be sent an email. Confirm your email address.

Now go back to the Infura website, to get the API key.
The easiest way is to click on “Learn How Infura Works” as seen below.
Click on “Skip” button that you see on the screen.
Then click on “Create New Project” as seen below:
Give any name to your project… 
Now, from the endpoint, copy the link for whichever network’s node you would want to connect to, for example, Rinkeby.


This is the code you need for the truffle-config.js file set up:

```
const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "<Infura PROJECT ID>";
//
// const fs = require('fs');
const mnemonic = "<METAMASK SEED>";

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 9545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
     },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
        network_id: 4,       // rinkeby's id
        gas: 4500000,        // rinkeby has a lower block limit than mainnet
        gasPrice: 10000000000
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
      //  optimizer: {
      //    enabled: false,
      //    runs: 200
      //  },
      //  evmVersion: "byzantium"
      // }
    }
  }
}
```

###Deploy ERC-20 Token Contract Locally

With our smart contract created and setup done, now's the fun part. 
Let's deploy! We will first use Truffle to compile and deploy the token 
contract to a locally running ethereum network.

``truffle develop``
``compile``
``migrate --reset``


###Deploy Token Contract on Rinkeby
Get Tokens from Public Faucet

Before we can deploy our contract on Rinkeby, we need to make sure have enough ethers.
To get our ethers in the test network, we will get some ether from a public faucet.
We will walk-through how to deploy our contract on Rinkeby.

To request ethers,

https://faucet.rinkeby.io/

https://www.youtube.com/watch?v=xY6ag7a9xuQ

###Deploy Contract and Send Tokens

Now that we have enough ethers our Rinkeby account, let's deploy our token contract to the Rinkeby network! Once deployed, we can use the contract to find our contract on Etherscan. Finally, we will wrap it up by using Metamask to transfer the tokens we created between Ethereum accounts!

`truffle migrate --reset --network rinkeby`

or using Ganache

`ganache-cli -m "opera uncle resist garage appear very when settle please front local lawn"`

Be sure that MetaMask is using the same seed.

##Frontend
  
Go to ./app

``npm run dev``

## Communicate with to Ethereum
Install web3 under ./app

`npm install web3`
