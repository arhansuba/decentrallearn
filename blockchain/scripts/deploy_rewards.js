async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const TokenRewards = await ethers.getContractFactory("TokenRewards");
    const tokenRewards = await TokenRewards.deploy(deployer.address);

    console.log("TokenRewards contract deployed to:", tokenRewards.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });