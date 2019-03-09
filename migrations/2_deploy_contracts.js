const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const Creator = artifacts.require("Creator");
const CreatorFactory = artifacts.require("CreatorFactory");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(CreatorFactory);
  deployer.deploy(Creator,1,1);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};
