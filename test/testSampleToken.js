var BigNumber = require('bignumber.js');

const sampleToken = artifacts.require("sampleToken");
const name = "TexTrace.Digital";
const symbol = "TTD";
const powered = 18+9;
const initialSupply = new BigNumber ( Math.pow(10, powered) );

contract('Testing the Sample Token', accounts => {

    const contractOwner = accounts[0];
    const contractUser1 = accounts[1];
    const transferAmount = new BigNumber ( initialSupply/2 );

    describe('Coin Testing', function () {
        beforeEach(async function f() {
            this.contract = await sampleToken.new(name, symbol, initialSupply, {from:contractOwner});
        });

        it('Get the name of the token', async function () {
            await this.contract.name().then(function (res) {
                assert.equal(res, name,'The name of the contract is not correct.');
            });
        });

        it('Get the symbol of the token', async function () {
            await this.contract.symbol().then(function (res) {
                assert.equal(res, symbol,'The symbol of the contract is not correct.');
            });
        });

        it('Get the decimals of the token', async function () {
            await this.contract.decimals().then(function (res) {
                assert.equal(res, 18,'The decimals of the contract is not 18.');
            });
        });

        it('Get the total supply of the token', async function () {
            await this.contract.totalSupply().then(function (res) {
               console.log("Total Supply: " + Number(res));
               console.log("Initial Supply: " + Number(initialSupply));
            });
        });

        it('Get the balance of contract owner', async function () {
            await this.contract.balanceOf(contractOwner).then(function (res) {
                console.log("The balance of contract owner: " + Number(res));
            });
        });

        it('Get the balance of contract user 1', async function () {
            await this.contract.balanceOf(contractUser1).then(function (res) {
                console.log("The balance of contract user 1: " + Number(res));
            });
        });


    });

    describe('Transfer Coin testing', function () {
        beforeEach(async function f() {
            // runs before each test in this block
            this.contract = await sampleToken.new(name, symbol, initialSupply, {from:contractOwner});
        });

        it('Transfer `${transferAmount}` from contract owner to account 1', async function () {
                await this.contract.transfer(contractUser1, transferAmount, {from:contractOwner});
                let balanceContractOwner = await this.contract.balanceOf(contractOwner);
                let balanceContractUser1 = await this.contract.balanceOf(contractOwner);
                assert.equal(Number(balanceContractOwner),Number(balanceContractUser1), 'Transfer is not successfully');
        });


    });


});