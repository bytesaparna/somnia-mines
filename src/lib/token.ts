import { ethers } from "ethers";
import { ERC20_ABI } from "./erc20";
import { OWNER_ADDRESS } from "./somnia";

export async function sendSurvivorToken({ provider, to, amount }: { provider: ethers.BrowserProvider, to: string, amount: string }) {
  console.log("Token function called with amount:", amount, "type:", typeof amount);
  console.log("To address:", to);
  
  // Validate amount
  console.log(amount, "AMOUNT___")
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new Error(`Invalid amount: ${amount}. Amount must be a positive number.`);
  }
  
  // Validate address
  if (!ethers.isAddress(to)) {
    throw new Error(`Invalid 'to' address: ${to}`);
  }
  
  try {
    // Call the secure API endpoint
    const response = await fetch('/api/send-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: to,
        amount: amount
      })
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send tokens');
    }

    console.log("Tokens sent successfully:", result);
    return result;

  } catch (error) {
    console.error("API call failed:", error);
    throw new Error(`Failed to send tokens: ${(error as Error).message}`);
  }
}


export async function payOwnerOnLoss({
  provider,
  amount,
}: {
  provider: ethers.BrowserProvider;
  amount: string;
}) {
  const signer = await provider.getSigner();
  const token = new ethers.Contract(
    process.env.NEXT_PUBLIC_SURVIVOR_TOKEN_ADDRESS!,
    ERC20_ABI,
    signer
  );
  return token.transfer(OWNER_ADDRESS, amount);
}