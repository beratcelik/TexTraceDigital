// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";
import '../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol';


contract cottonToken is ERC20 {

    struct Cotton{
        uint256 balance;                // Always in net kilograms
        //string form;                  // Defines the form of the material, e.i. yarn, fabric etc.
        //address producer;             // Address of the producer
        //string certificate;           // Control Union certificate
        //uint256 certificateDoc;       // IPFS - Control Union certificate (PDF only)
        //uint256 transportDoc;         // IPFS - Transport document (PDF only)
        //uint256 invoiceDoc;           // IPFS - Invoice (PDF only)
        //uint256 hash;                 // Previous transaction
    }
    /*

    U - unsigned (meaning this type can only represent positive integers, not positive and negative integers)
    INT - integer
    256 - 256 bits in size (256 bits = 32 bytes = 32 characters)
    address: Holds a 20 byte value (size of an Ethereum address).
    address payable: Same as address, but with the additional members transfer and send.
    */
/*
    enum form{ cotton, spun, yarn, fabric, garment }
    enum Certificate{ Regular, GOTS, OCS, BCI, CmiA }
*/

    mapping(address => mapping (string => mapping (string=>Cotton))) public cotton;

/*
    transferHash = keccak256(balance,transportDoc,invoiceDoc,certificateDoc,certificate);
    cotton[sender][form][certificate].balance
    cotton[sender][form][certificate].transportDoc
    cotton[sender][form][certificate].invoiceDoc
    cotton[sender][form][certificate].certificateDoc
*/

    event TraceCotton(
                address sender,
                address recipient,
                uint256 amount,
                string form,
                string certificate,
                string ref
    );
    //event Transfer(address sender, address recipient, uint256 amount);

    constructor(string memory _name, string memory _symbol, uint256 _initialSupply, string memory form, string memory certificate)
    ERC20(_name, _symbol) {
        require(_initialSupply > 0, "INITIAL_SUPPLY has to be greater than 0");
        _mint(msg.sender, _initialSupply, form, certificate);

    }
    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(
            address recipient,
            uint256 amount,
            string memory form,
            string memory certificate,
            string memory ref
            ) public virtual returns (bool) {
                _transfer(_msgSender(), recipient, amount, form, certificate, ref);
                return true;
    }

    /**
    * @dev See {IERC20-transferFrom}.
    *
    * Emits an {Approval} event indicating the updated allowance. This is not
    * required by the EIP. See the note at the beginning of {ERC20}.
    *
    * Requirements:
    *
    * - `sender` and `recipient` cannot be the zero address.
    * - `sender` must have a balance of at least `amount`.
    * - the caller must have allowance for ``sender``'s tokens of at least
    * `amount`.
    */
    function transferFrom(
            address sender,
            address recipient,
            uint256 amount,
            string memory form,
            string memory certificate,
            string memory ref
            ) public virtual returns (bool) {

                _transfer(sender, recipient, amount, form, certificate, ref);

                uint256 currentAllowance = _allowances[sender][_msgSender()];
                require(currentAllowance >= amount, "Cotton Token (ERC20): transfer amount exceeds allowance");
                _approve(sender, _msgSender(), currentAllowance - amount);

                return true;
    }

    /**
    * @dev Moves tokens `amount` from `sender` to `recipient`.
    *
    * This is internal function is equivalent to {transfer}, and can be used to
    * e.g. implement automatic token fees, slashing mechanisms, etc.
    *
    * Emits a {Transfer} event.
    *
    * Requirements:
    *
    * - `sender` cannot be the zero address.
    * - `recipient` cannot be the zero address.
    * - `sender` must have a balance of at least `amount`.
    */
    function _transfer(
            address sender,
            address recipient,
            uint256 amount,
            string memory form,
            string memory certificate,
            string memory ref
            ) internal {
                require(sender != address(0), "ERC20: transfer from the zero address");
                require(recipient != address(0), "ERC20: transfer to the zero address");

                // Cotton require checks
                    require(cotton[sender][form][certificate].balance >= amount, 'Sender doesnt have enough asset');
                // Cotton require checks

                _beforeTokenTransfer(sender, recipient, amount);

                uint256 senderBalance = _balances[sender];
                require(senderBalance >= amount, "ERC20: transfer amount exceeds balance");
                _balances[sender] = senderBalance - amount;
                _balances[recipient] += amount;

                // Cotton Balance
                // cotton[sender][form][certificate].balance
                // bytes32 transferHash = keccak256(abi.encodePacked(form,certificate,amount));
                cotton[sender][form][certificate].balance -= amount;
                cotton[recipient][form][certificate].balance += amount;

                emit Transfer(sender, recipient, amount);
                emit TraceCotton(sender, recipient, amount, form, certificate, ref);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount, string memory form, string memory certificate) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        _balances[account] += amount;

        // Cotton Balance
        cotton[account][form][certificate].balance += amount;

        emit Transfer(address(0), account, amount);
    }

}