import { ethers } from "ethers";
import { SOMNIA_TESTNET_PARAMS } from "./somnia";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function connectWallet(): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) throw new Error("No wallet found");
  
  try {
    // First request accounts
    await window.ethereum.request({ method: "eth_requestAccounts" });
    
    // Then try to add the chain if it doesn't exist
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [SOMNIA_TESTNET_PARAMS],
      });
    } catch (chainError: any) {
      // If chain already exists or other error, continue
      console.log("Chain addition result:", chainError);
    }
    
    return new ethers.BrowserProvider(window.ethereum);
  } catch (error) {
    throw new Error("Failed to connect wallet: " + (error as Error).message);
  }
}

export async function getCurrentAddress(provider: ethers.BrowserProvider): Promise<string> {
  const signer = await provider.getSigner();
  return signer.getAddress();
}

export async function getProvider(): Promise<ethers.BrowserProvider> {
  if (!window.ethereum) throw new Error("No wallet found");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function sendSom({
  provider,
  to,
  amount,
}: {
  provider: ethers.BrowserProvider;
  to: string;
  amount: string;
}) {
  const signer = await provider.getSigner();
  const tx = await signer.sendTransaction({
    to,
    value: ethers.parseEther(amount),
  });
  return tx.wait();
}