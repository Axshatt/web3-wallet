'use client'
import { Keypair } from "@solana/web3.js";
import { generateMnemonic ,mnemonicToSeedSync} from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Badge } from "@/components/ui/badge"
import nacl from "tweetnacl";
import { Switch } from "@/components/ui/switch"

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
    <div className="flex flex-col">
      <div className="flex flex-row">


    <div className=" w-full h-12 text-4xl m-6 ml-36">
     Kosh
     <Badge variant="outline" className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums align-text-top" >v1.3</Badge>
    </div>
    <div>
      <Switch className="m-6 mr-36 "/>
      </div>

   

    
    </div>
    <button onClick={key} className="p-3">Generate Keys</button>
    </div>
    </>
  );
}
