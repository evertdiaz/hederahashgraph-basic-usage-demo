const { Client, AccountId, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar} = require("@hashgraph/sdk");
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

  // Create new keys
  const newAccountPrivateKey = await PrivateKey.generate(); 
  const newAccountPublicKey = newAccountPrivateKey.publicKey;

  // Create new account
  const initBalance = prompt('Saldo inicial de la cuenta: ');

  const newAccountTransactionId = await new AccountCreateTransaction()
  .setKey(newAccountPublicKey)
  .setInitialBalance(initBalance)
  .execute(client);

  // Get the new account ID
  const getReceipt = await newAccountTransactionId.getReceipt(client);
  console.log(getReceipt);
  const newAccountId = getReceipt.accountId;

  console.log("AccountId creado: " +newAccountId);
  console.log("Llave privada: " +newAccountPrivateKey);

  // Get accound Hbars Balance
  const accountBalance = await new AccountBalanceQuery()
  .setAccountId(newAccountId)
  .execute(client);

  console.log("El saldo de la cuenta es: " +accountBalance.hbars);
}

main();