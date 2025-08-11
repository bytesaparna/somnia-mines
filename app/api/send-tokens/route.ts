import { NextRequest, NextResponse } from 'next/server';
import { ethers } from 'ethers';

import { SOMNIA_TESTNET_PARAMS } from '@/src/lib/somnia';

const SURVIVOR_TOKEN_ADDRESS = ethers.getAddress(process.env.NEXT_PUBLIC_SURVIVOR_TOKEN_ADDRESS!);
const SURVIVOR_DECIMALS = 18;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!;

const ERC20_ABI = [
  "function transfer(address to, uint256 amount) returns (bool)",
  "function balanceOf(address account) view returns (uint256)",
  "function decimals() view returns (uint8)",
];

export async function POST(request: NextRequest) {
  try {
    const { to, amount } = await request.json();

    // Validate inputs
    if (!to || !ethers.isAddress(to)) {
      return NextResponse.json({ error: 'Invalid recipient address' }, { status: 400 });
    }
    console.log(amount, "AMOUNT")

    if (!amount) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Validate environment variables
    if (!SURVIVOR_TOKEN_ADDRESS || !ADMIN_PRIVATE_KEY) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Create provider and wallet
    const provider = new ethers.JsonRpcProvider(SOMNIA_TESTNET_PARAMS.rpcUrls[0]);
    const ownerWallet = new ethers.Wallet(ADMIN_PRIVATE_KEY, provider);
    const contract: ethers.Contract = new ethers.Contract(SURVIVOR_TOKEN_ADDRESS, ERC20_ABI, ownerWallet);
    const ownerAddress = ethers.getAddress(ownerWallet.address)

    console.log(ownerAddress, "Address");
    // Check owner's balance

    const balance = await contract.balanceOf(ownerAddress);
    console.log(balance, "BALANCE")
    const amountToSend = ethers.parseUnits(amount.toString(), 1);

    console.log(amountToSend, "Amount to send");

    if (balance < amountToSend) {
      return NextResponse.json({ error: 'Insufficient token balance' }, { status: 400 });
    }

    // Send tokens
    const tx = await contract.transfer(to, amountToSend);
    const receipt = await tx.wait();

    return NextResponse.json({
      success: true,
      transactionHash: receipt.hash,
      amount: amount,
      recipient: to
    });

  } catch (error) {
    console.error('Token transfer error:', error);
    return NextResponse.json(
      { error: 'Failed to transfer tokens' },
      { status: 500 }
    );
  }
} 