pragma solidity >=0.4.21 <0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "../node_modules/openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract CreatorFactory{
    address[] public deployedCreators;
    
    function createCreator(uint _expirationDuration, uint _price) public{
        address newCreator = address(new Creator(_expirationDuration, _price));
        deployedCreators.push(newCreator);
    }
    
    function getDeployedCreators() public view returns(address[] memory){
        return deployedCreators;
    }
}


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
    
    constructor(uint _expirationDuration, uint _price) public {
        expirationDuration = _expirationDuration;
        price = _price;
        
    }
    
    function payContent() public payable{
        require(msg.value == price * 10**18);
        uint id = contents.length;
        contents.push(Content(msg.sender));
        _mint(msg.sender, id); 
    }
    function getPrice() public view returns(uint){
        return price;
    }
}