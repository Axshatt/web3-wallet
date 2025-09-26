'use client'
import { Keypair } from "@solana/web3.js";
import { generateMnemonic ,mnemonicToSeedSync} from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";

async function key(){

// Generate a 12-word mnemonic

const mnemonic = generateMnemonic();

console.log('Generated Mnemonic:', mnemonic);

const seed = mnemonicToSeedSync(mnemonic);

for (let i = 0; i < 4; i++) {
  const path = `m/44'/501'/${i}'/0'`; // This is the derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log("Private key",secret);
  
  console.log(Keypair.fromSecretKey(secret).publicKey.toBase58());
}


}
export default function Home() {
  return (
    <>
    <button onClick={key} className="p-3">Generate Keys</button>
    </>
  );
}
