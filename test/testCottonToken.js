var BigNumber = require('bignumber.js');

const CottonToken = artifacts.require("cottonToken");
const name = "Cotton";
const symbol = "Cot";
const powered = 18+9;
const initialSupply = new BigNumber ( Math.pow(10, powered) );

contract('CottonToken', accounts =>{
    const contractOwner = accounts[0];
    const contractUser1 = accounts[1];
    const transferAmount = new BigNumber ( initialSupply/4 );
    const form = 0;
    const certificate = 0;
    const ref = "Zara Order";


    describe('Test Cotton', function () {
        beforeEach(async function f() {
            this.contract = await CottonToken.new(name, symbol, initialSupply, form, certificate, {from:contractOwner});
        });
        afterEach(async function f() {

        });

        it('Get the name of the token', async function () {
            await this.contract.name().then(function (res) {
                //console.log(res);
                assert.equal(res, name,'The name of the contract is not correct.');
            });
        });

        it('Get the balance of contract owner', async function () {
            await this.contract.balanceOf(contractOwner).then(function (res) {
                //console.log("The balance of contract owner: " + Number(res));
            });
        });

        it('Allowance of Contract owner to account 1 should be zero', async function f() {
            await this.contract.allowance(contractOwner,contractUser1).then(function (res) {
                assert.equal(Number(res), 0,'allowance is not zero');
            });

        })

        it('Allowance of Contract owner to account 1 should not be zero', async function f() {
            await this.contract.increaseAllowance(contractUser1, transferAmount, {from:contractOwner});
            await this.contract.allowance(contractOwner,contractUser1).then(function (res) {
                assert.equal(Number(res), transferAmount,'allowance is not successful');
            });

        })
/*
        it('TransferFrom `${transferAmount}` from contract owner to account 1 by account 1', async function () {
            //console.log(this.contract)

            await this.contract.increaseAllowance(contractUser1, transferAmount, {from:contractOwner});
            await this.contract.allowance(contractOwner,contractUser1);
            await this.contract.transferFrom(contractOwner, contractUser1, 100, form, certificate, ref, {from:contractUser1}).then(function (res) {
            //await this.contract.transferFrom(contractOwner, contractUser1, 100, {from:contractUser1}).then(function (res) {
               // console.log(res);
            });
        });

 */

        it('Transfer `${transferAmount}` Cotton from contract owner to account 1', async function () {
            await this.contract.transfer(contractUser1, transferAmount, form,certificate,ref);
            await this.contract.cotton(contractUser1,form,certificate ).then(function (res) {
               // console.log(res)
                assert.equal(Number(res),transferAmount,'Balance error on before and after transfer');
            });
        });


    })


});