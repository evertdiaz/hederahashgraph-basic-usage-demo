const { Client, TokenCreateTransaction, Hbar, AccountId, PrivateKey, TokenUpdateTransaction} = require("@hashgraph/sdk");
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
  const tokenId = prompt('Ingrese el token ID: ');
  const tempTokenName = prompt('Ingrese el nuevo nombre de token: ');
  const adminKey = PrivateKey.fromString(prompt('Ingrese el adminKey: '));

  const transaction = await new TokenUpdateTransaction()
  .setTokenId(tokenId)
  .setTokenName(tempTokenName)
  .freezeWith(client);

  //Sign the transaction with the admin key
  const signTx = await transaction.sign(adminKey);

  //Submit the signed transaction to a Hedera network
  const txResponse = await signTx.execute(client);

  //Request the receipt of the transaction
  const receipt = await txResponse.getReceipt(client);

  //Get the transaction consensus status
  const transactionStatus = receipt.status.toString();

  console.log("The transaction consensus status is " +transactionStatus);


  console.log("Tu token ID es: " + tokenId);

}

main()
