const { Client, TransferTransaction, AccountBalanceQuery, Hbar, AccountId, PrivateKey} = require("@hashgraph/sdk");
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

  const tokenId = prompt('Ingrese token ID: ');
  const sender = AccountId.fromString(prompt('INGRESE CUENTA DE CARGO: '));
  const receiver = AccountId.fromString(prompt('INGRESE CUENTA DE DESTINO: '));

  // Show account balances before transaction
  console.log('======')
  let query = new AccountBalanceQuery().setAccountId(sender);
  let tokenBalance = await query.execute(client);
  console.log("SALDO CTA CARGO: " +tokenBalance.tokens.toString());

  query = new AccountBalanceQuery().setAccountId(receiver);
  tokenBalance = await query.execute(client);
  console.log("SALDO CTA DESTINO: " +tokenBalance.tokens.toString());

  console.log('======')
  const amount = prompt('INGRESE MONTO A TRANSFERIR: ');

  //Create the transfer transaction
  const transaction = await new TransferTransaction()
  .addTokenTransfer(tokenId, sender, (amount*-1))
  .addTokenTransfer(tokenId, receiver, amount)
  .freezeWith(client);

  const accountKey = PrivateKey.fromString(prompt('INGRESE SU CLAVE PRIVADA: '));
  
  // Sign and execute transaction
  const signTx = await transaction.sign(accountKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const transactionStatus = receipt.status;

  console.log("RESULTADO DE TRANSACCION " +transactionStatus.toString());


  // Final balances
  console.log('=============')

  query = new AccountBalanceQuery().setAccountId(sender);
  tokenBalance = await query.execute(client);
  console.log("NUEVO SALDO CTA CARGO: " +tokenBalance.tokens.toString());

  query = new AccountBalanceQuery().setAccountId(receiver);
  tokenBalance = await query.execute(client);
  console.log("NUEVO SALDO CTA DESTINO: " +tokenBalance.tokens.toString());

}

main()
