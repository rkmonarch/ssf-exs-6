"use client";

import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import BigNumber from "bignumber.js";
import { useWallet } from "@jup-ag/wallet-adapter";
import { useState } from "react";
import { findReference, validateTransfer } from "@solana/pay";
import products from "@/app/data/products";
import ProductCard from "./product/card";

export default function Hero() {
  const [transactionStatus, setTransactionStatus] = useState<string>("");

  return (
    <div className="container mx-auto py-12">
      {/* <h1 className="text-3xl font-bold text-center mb-8">Solana POS</h1> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
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
