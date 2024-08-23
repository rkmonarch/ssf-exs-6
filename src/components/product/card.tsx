import React, { useState } from "react";
import { useWallet } from "@jup-ag/wallet-adapter";
import {
  TransferRequestURL,
  encodeURL,
  findReference,
  parseURL,
  validateTransfer,
} from "@solana/pay";
import BigNumber from "bignumber.js";
import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// toast.configure();

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { publicKey, sendTransaction } = useWallet();
  const connection = new Connection("https://api.devnet.solana.com");
  const recipient = new PublicKey(
    "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
  );
  const reference = new Keypair().publicKey;
  const label = "QuickNode Guide Store";
  const memo = "QN Solana Pay Demo Public Memo";
  const message = `QuickNode Demo - Order ID #${Math.floor(
    Math.random() * 999999
  )}`;

  const [loading, setLoading] = useState(false);

  const generateUrl = (
    recipient: PublicKey,
    amount: number,
    reference: PublicKey,
    label: string,
    message: string,
    memo: string
  ): URL => {
    return encodeURL({
      recipient,
      amount: new BigNumber(amount),
      reference,
      label,
      message,
      memo,
    });
  };

  const waitForConfirmation = async (txId: string): Promise<boolean> => {
    while (true) {
      const { value } = await connection.getSignatureStatus(txId);
      if (value?.confirmationStatus === "confirmed") return true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  };

  const processPayment = async (url: URL): Promise<string | undefined> => {
    try {
      const { recipient, amount, reference, memo } = parseURL(
        url
      ) as TransferRequestURL;
      if (!recipient || !amount || !reference)
        throw new Error("Invalid payment request link");

      const transaction = new Transaction().add(
        new TransactionInstruction({
          programId: new PublicKey(
            "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"
          ),
          keys: [],
          data: Buffer.from(memo!, "utf8"),
        })
      );

      transaction.feePayer = publicKey!;
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;

      const ix = SystemProgram.transfer({
        fromPubkey: publicKey!,
        toPubkey: recipient,
        lamports: Number(amount) * LAMPORTS_PER_SOL,
      });

      const refArray = Array.isArray(reference) ? reference : [reference];
      refArray.forEach((pubkey) =>
        ix.keys.push({ pubkey, isWritable: false, isSigner: false })
      );

      transaction.add(ix);
      return await sendTransaction(transaction, connection);
    } catch (error) {
      console.error("Payment processing failed:", error);
    }
  };

  const verifyTx = async (
    recipient: PublicKey,
    amount: number,
    reference: PublicKey,
    memo: string
  ): Promise<boolean> => {
    try {
      const found = await findReference(connection, reference, {
        finality: "confirmed",
      });
      const response = await validateTransfer(
        connection,
        found.signature,
        {
          recipient,
          amount: new BigNumber(amount),
          splToken: undefined,
          reference,
          memo,
        },
        { commitment: "confirmed" }
      );
      return !!response && !response.meta?.err;
    } catch (error) {
      console.error("Transaction verification failed:", error);
      return false;
    }
  };

  const handleBuy = async () => {
    setLoading(true);
    try {
      const url = generateUrl(
        recipient,
        product.price,
        reference,
        label,
        message,
        memo
      );
      const txId = await processPayment(url);
      if (!txId) throw new Error("Payment processing failed");

      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for indexing
      const confirmed = await waitForConfirmation(txId);
      if (!confirmed) throw new Error("Transaction confirmation failed");

      const verified = await verifyTx(
        recipient,
        product.price,
        reference,
        memo
      );
      if (!verified) throw new Error("Payment verification failed");

      toast.success("🎉 Payment Confirmed!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg shadow-md overflow-hidden max-w-md mx-auto">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-4">{product.price} SOL</p>
        <button
          onClick={handleBuy}
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Processing..." : "Buy with SOL"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
