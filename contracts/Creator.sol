pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract Creator is
    ERC721,
    Ownable
{
    struct Content{
        address owner;
    }
    
    uint expirationDuration;
    uint price;
    
    Content[] public contents;
    
    constructor(uint _expirationDuration, uint _price) public payable{
        expirationDuration = _expirationDuration;
        price = _price;
        
    }
    
    function payContent() public payable{
        // require(msg.value == price);
        uint id = contents.length;
        contents.push(Content(msg.sender));
        _mint(msg.sender, id); 
    }
}