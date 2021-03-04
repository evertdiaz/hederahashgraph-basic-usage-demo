const { Client, TokenAssociateTransaction, TransferTransaction, AccountBalanceQuery, Hbar, PrivateKey, AccountId} = require("@hashgraph/sdk");
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
  
  // Inputs
  const tokenId = prompt('TOKEN ID: ');
  const accountId = AccountId.fromString(prompt('CUENTA A ASOCIAR: '));
  const accountKey = PrivateKey.fromString(prompt('CLAVE: '));
  
  // Associeate token to account to receive transactions
  const transaction = await new TokenAssociateTransaction()
  .setAccountId(accountId)
  .setTokenIds([tokenId])
  .freezeWith(client);

  // Sign and get response
  const signTx = await transaction.sign(accountKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  console.log("Resultado: " +receipt.status);
  console.log("Data de consenso: "+receipt)
}

main()
