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
  // const tempMemo = prompt('Ingrese mensaje (memo) publico: ')

  const adminKey = await PrivateKey.generate();
  console.log(`Admin Key: ${adminKey}`)
  console.log(`Admin Public Key: ${adminKey.publicKey}`)

  const treasuryKey = await PrivateKey.generate();
  console.log(`Treasury Key: ${treasuryKey}`)
  console.log(`Treasury Public Key: ${treasuryKey.publicKey}`)

  const supplyKey = await PrivateKey.generate();
  console.log(`Supply Key: ${supplyKey}`)
  console.log(`Supply Public Key: ${supplyKey.publicKey}`)

  // const kycKey = await PrivateKey.generate();
  // console.log(`KYC Key: ${kycKey}`)
  // console.log(`KYC Public Key: ${kycKey.publicKey}`)

  const freezeKey = await PrivateKey.generate();
  console.log(`Freeze Key: ${freezeKey}`)
  console.log(`Freeze Public Key: ${freezeKey.publicKey}`)

  const wipeKey = await PrivateKey.generate();
  console.log(`Wipe Key: ${wipeKey}`)
  console.log(`Wipe Public Key: ${wipeKey.publicKey}`)


  const transaction = await new TokenCreateTransaction()
  .setTokenName(tempTokenName)
  .setTokenSymbol(tempTokenSymbol)
  .setTreasuryAccountId(myAccountId)
  .setInitialSupply(tempSupply)
  .setDecimals(tempDecimals)
  .setSupplyKey(supplyKey.publicKey)
  .setAdminKey(adminKey.publicKey)
  // .setKycKey(kycKey.publicKey)
  .setFreezeKey(freezeKey.publicKey)
  .setWipeKey(wipeKey.publicKey)
  // .setTokenMemo(tempMemo)
  .setMaxTransactionFee(new Hbar(5))
  .freezeWith(client);

  // Sign transaction and get tokenId as response
  const signTx =  await (await transaction.sign(adminKey)).sign(treasuryKey);
  const txResponse = await signTx.execute(client);
  const receipt = await txResponse.getReceipt(client);
  const tokenId = receipt.tokenId;

  console.log("Tu token ID es: " + tokenId);

}

main()
