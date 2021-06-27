var BigNumber = require('bignumber.js');

const SampleToken = artifacts.require("sampleToken");
const CottonToken = artifacts.require("cottonToken");

const name = "TexTrace.Digital";
const symbol = "TTD";
const powered = 18+9;
const initialSupply = new BigNumber ( Math.pow(10, powered) ); // 10^(27) Wei

const cottonName = "cotton";
const cottonSymbol = "COT";
const cottonInitialSupply = new BigNumber ( Math.pow(10, powered) );
const cottonForm = "yarn";
const cottonCertificate = "regular";

module.exports = async (deployer) => {
    await deployer.deploy(SampleToken, name, symbol, initialSupply);
    await deployer.deploy(CottonToken, cottonName, cottonSymbol, cottonInitialSupply, cottonForm, cottonCertificate);
};
