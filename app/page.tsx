'use client'

import { useState } from "react";
import { Keypair } from "@solana/web3.js";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Badge } from "@/components/ui/badge";
import nacl from "tweetnacl";
import { Switch } from "@/components/ui/switch";

export default function Home() {
  const [seedPhrase, setSeedPhrase] = useState("");
  const [generatedMnemonic, setGeneratedMnemonic] = useState("");
  const [copied, setCopied] = useState(false);
  const [walletNo, setWalletNo] = useState(1);
  const [secretKey, setSecretKey] = useState("");
  const [publicKey, setPublicKey] = useState("");

  // Array of words to display (either generated or entered)
  const mnemonicWords = (seedPhrase ? seedPhrase : generatedMnemonic).trim().split(/\s+/).filter(Boolean);
  console.log(mnemonicWords);

  function copyMnemonic() {
    const mnemonicToCopy = seedPhrase || generatedMnemonic;
    if (mnemonicToCopy) {
      navigator.clipboard.writeText(mnemonicToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }

  async function key() {
    let mnemonic = seedPhrase;
    if (!seedPhrase) {
      mnemonic = generateMnemonic();
      setGeneratedMnemonic(mnemonic);
    }
    console.log('Using Mnemonic:', mnemonic);
    let i = 0;
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${walletNo}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const pubKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    setSecretKey(Buffer.from(secret).toString("hex"));
    setPublicKey(pubKey);
    setWalletNo(i++);
    console.log(walletNo);
  }
  return (
    
      <div className="flex flex-col">
          <div className="min-h-screen flex flex-col justify-between bg-white">
            <div>
              <div className="flex flex-col md:flex-row items-center md:items-start md:justify-between px-4 pt-6">
                <div className="w-full md:w-auto h-12 text-3xl md:text-4xl m-2 md:m-6 md:ml-36 flex items-center justify-center md:justify-start">
                  Kosh
                  <Badge variant="outline" className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums align-text-top ml-2" >v1.3</Badge>
                </div>
                <div className="mt-2 md:mt-0 md:mr-36 flex justify-center md:justify-end w-full md:w-auto">
              
                </div>
              </div>
              <div className="flex flex-col items-center mt-5 px-2">
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full max-w-xl">
                  <textarea
                    placeholder="Enter your seed phrase"
                    className="w-full sm:w-2/3 h-20 border-black border-2 rounded-xl text-lg sm:text-2xl placeholder:p-2 sm:placeholder:p-6 p-2"
                    value={seedPhrase}
                    onChange={e => setSeedPhrase(e.target.value)}
                  />
                  <button onClick={key} className="w-full sm:w-auto p-3 border-black border-2 h-14 sm:h-20 rounded-xl mt-2 sm:mt-0">Generate Keys</button>
                </div>
                {/* Display generated mnemonic below textarea */}
                <div className="w-full flex flex-col items-center mt-4">
                  {(generatedMnemonic || seedPhrase) && (
                    <div className="border border-gray-300 rounded-lg p-3 bg-gray-50 w-full max-w-xl">
                      <div className="font-semibold mb-2 flex flex-col sm:flex-row items-center gap-2">
                        <span>Seed Phrase:</span>
                        <button
                          onClick={copyMnemonic}
                          className="px-2 py-1 border border-black rounded bg-white text-sm hover:bg-gray-200"
                        >
                          {copied ? "Copied!" : "Copy"}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {mnemonicWords.map((word, idx) => (
                          <div
                            key={idx}
                            className="border border-black rounded-lg px-2 py-1 text-base sm:text-lg bg-white"
                          >
                            {word}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Display secret key and public key below seed phrase */}
                  {(secretKey || publicKey) && (
                    <div className="border border-black rounded-lg p-3 bg-white mt-4 w-full max-w-xl">
                      <div className="font-semibold mb-2">Wallet Keys</div>
                      <div className="mb-1 break-all"><span className="font-mono">Secret Key:</span> <span className="break-all font-mono text-xs">{secretKey}</span></div>
                      <div className="break-all"><span className="font-mono">Public Key:</span> <span className="break-all font-mono text-xs">{publicKey}</span></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <footer className="w-full text-center py-4 border-t border-gray-300 text-gray-600 text-sm mt-8">
              designed and developed by Akshat
            </footer>
          </div>
          </div>

  );
}
