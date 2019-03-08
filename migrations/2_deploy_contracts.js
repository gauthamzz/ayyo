const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const Creator = artifacts.require("Creator");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.deploy(Creator,1,1);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
};
