const { Client, AccountId, PrivateKey, AccountCreateTransaction, AccountBalanceQuery, Hbar, TransferTransaction} = require("@hashgraph/sdk");
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

  const sender = prompt('De qué cuenta: ');
  const receiver = prompt('HACIA qué cuenta: ');
  const amount = prompt('CUANTOS TBAR TRANSFIERE: ');
  
  // Get actual Balance
  let newSenderBalance = await new AccountBalanceQuery()
  .setAccountId(sender)
  .execute(client);
  console.log("Saldo de sender: " +newSenderBalance.hbars.toTinybars() +" tinybar.")

  let newReceiverBalance = await new AccountBalanceQuery()
  .setAccountId(receiver)
  .execute(client);
  console.log("Saldo de receiver: " +newReceiverBalance.hbars.toTinybars() +" tinybar.")
  console.log('==========================')

  // Execute the transaction of tbars
  const transaction = await new TransferTransaction()
  .addHbarTransfer(sender, Hbar.fromTinybars((amount*-1)))
  .addHbarTransfer(receiver, Hbar.fromTinybars(amount))
  .freezeWith(client);
  
  const accountKey = PrivateKey.fromString(prompt('CLAVE PRIVADA DEL QUE ENVIA: '));
  
  // Sign and send
  const signTx = await transaction.sign(accountKey);
  const txResponse = await signTx.execute(client)
  const receipt = await txResponse.getReceipt(client);
  console.log("RESULTADO DE TRANSACCION " +receipt);

  // Get gas used
  const getBalanceCost = await new AccountBalanceQuery()
  .setAccountId(receiver)
  .getCost(client);

  console.log("COSTO DE TRANSACCION: " +getBalanceCost);
  console.log('====================')

  // Get new balance
  newSenderBalance = await new AccountBalanceQuery()
  .setAccountId(sender)
  .execute(client);
  console.log("Nuevo saldo de sender: " +newSenderBalance.hbars.toTinybars() +" tinybar.")

  newReceiverBalance = await new AccountBalanceQuery()
  .setAccountId(receiver)
  .execute(client);
  console.log("Nuevo saldo de receiver " +newReceiverBalance.hbars.toTinybars() +" tinybar.")

}

main();