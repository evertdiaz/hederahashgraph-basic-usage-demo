const { Client, TokenCreateTransaction, Hbar, AccountId, PrivateKey} = require("@hashgraph/sdk");
const prompt = require('prompt-sync')();

require("dotenv").config();

async function main() {

  // Load hedera credentials
  // If you want to go on mainnet delete TESTNET_
  const myAccountId = AccountId.fromString(process.env.TESTNET_MY_ACCOUNT_ID);
  const myPrivateKey = PrivateKey.fromString(process.env.TESTNET_MY_PRIVATE_KEY);

  // Credential error handler
  if (myAccountId == null ||
    myPrivateKey == null ) {
    throw new Error("Environment variables myAccountId and myPrivateKey must be present");
  }

  // Build the client/operator
  // If you wanna go mainnet use forMainnet() instead of forTestnet()
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  // Create transaction and freeze for signing
  const tempTokenName = prompt('Ingrese el nombre de token: ');
  const tempTokenSymbol = prompt('Ingrese el simbolo de token: ');
  const tempSupply = prompt('Ingrese el Supply: ');
  const tempDecimals = prompt('Ingrese cantidad de decimales: ')

  const transaction = await new TokenCreateTransaction()
  .setTokenName(tempTokenName)
  .setTokenSymbol(tempTokenSymbol)
  .setTreasuryAccountId(myAccountId)
  .setInitialSupply(tempSupply)
  .setDecimals(tempDecimals)
  .setMaxTransactionFee(new Hbar(5))
  .freezeWith(client);

  // Sign transaction and get tokenId as response
  const txResponse = await transaction.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const tokenId = receipt.tokenId;

  console.log("Tu token ID es: " + tokenId);

}

main()
