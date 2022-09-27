pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract GafiToken is ERC20Capped {
    constructor() ERC20("Gafi Network", "GAFI") ERC20Capped(1000000000*10**18) {
        ERC20._mint(msg.sender, 1000000000*10**18);
    }
}