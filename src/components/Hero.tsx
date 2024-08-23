"use client";

import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { findReference, validateTransfer } from "@solana/pay";
import products from "@/app/data/products";
import ProductCard from "./product/card";

export default function Hero() {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");

  const [transactionStatus, setTransactionStatus] = useState<string>("");

  async function verifyTx(
    recipient: PublicKey,
    amount: BigNumber,
    reference: PublicKey,
    memo: string
  ) {
    console.log(`5. Verifying the payment`);
    // Merchant app locates the transaction signature from the unique reference address it provided in the transfer link
    const found = await findReference(connection, reference);

    // Merchant app should always validate that the transaction transferred the expected amount to the recipient
    const response = await validateTransfer(
      connection,
      found.signature,
      {
        recipient,
        amount,
        splToken: undefined,
        reference,
        memo,
      },
      { commitment: "confirmed" }
    );
    return response;
  }

  const handlePurchase = async (product: {
    id: number;
    name: string;
    price: number;
  }) => {
    const connection = new Connection("https://api.devnet.solana.com");
    const recipient = new PublicKey(
      "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
    );
    const amount = product.price;
    const reference = new Keypair().publicKey;

    try {
      // const signatureInfo = await validateTransfer(
      //   connection,
      //   reference,
      //   undefined,
      //   "confirmed"
      // );
      // setTransactionStatus(
      //   `Transaction successful: ${signatureInfo.signature}`
      // );
    } catch (error) {
      setTransactionStatus("Transaction failed or not found.");
    }
  };

  return (
    <div className="container mx-auto py-12">
      {/* <h1 className="text-3xl font-bold text-center mb-8">Solana POS</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onBuy={handlePurchase}
          />
        ))}
      </div>
      {transactionStatus && (
        <div className="mt-8 text-center">
          <p
            className={`text-lg ${
              transactionStatus.includes("successful")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {transactionStatus}
          </p>
        </div>
      )}
    </div>
  );
}
