const { Client, AccountId, PrivateKey, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");
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

  const accountId = prompt('CUENTA A CONSULTAR: ');

  // Instance of the query
  const query = new AccountBalanceQuery()
  .setAccountId(accountId);

  // Execute query and get response
  const tokenBalance = await query.execute(client);

  console.log("Saldo de tokens: " +tokenBalance.tokens.toString());

}

main();
