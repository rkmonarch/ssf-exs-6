import React, { useState, useEffect } from "react";
import { encodeURL, findReference, validateTransfer } from "@solana/pay";
import BigNumber from "bignumber.js";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import QRCode from "qrcode.react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const connection = new Connection("https://api.devnet.solana.com");
  const recipient = new PublicKey(
    "8vU3WgmVnVDa13hXAevKA3Vhe7XtbwHrQja6aVx15KwV"
  );
  const reference = new Keypair().publicKey;
  const label = "rkstore - SSF Demo";
  const memo = "Solana Pay Demo";
  const message = `Solana pay by rkmonarch - Order ID #${Math.floor(
    Math.random() * 999999
  )}`;

  const [loading, setLoading] = useState(false);
  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [paymentValidated, setPaymentValidated] = useState(false);
  const [remainingTime, setRemainingTime] = useState(20);

  useEffect(() => {
    if (showQRCodeModal && !paymentValidated && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showQRCodeModal, paymentValidated, remainingTime]);

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
      splToken: undefined,
    });
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
      setPaymentUrl(url.toString());
      setShowQRCodeModal(true);
      setRemainingTime(20);

      toast.info("QR Code generated. Scan to complete payment.", {
        position: "top-right",
        autoClose: 5000,
      });
      console.log("Payment URL: ", url.toString());
      console.log("reference: ", reference.toBase58());

      setTimeout(async () => {
        try {
          await listenForPayment(reference);
        } catch (error: any) {
          toast.error(`Error: ${error.message}`, {
            position: "top-right",
            autoClose: 5000,
          });
        }
      }, 25000);
    } catch (error: any) {
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const listenForPayment = async (reference: PublicKey) => {
    console.log("Listening for payment...");
    try {
      const signatureInfo = await findReference(connection, reference);
      console.log("Signature Info: ", signatureInfo);

      await validateTransfer(
        connection,
        signatureInfo.signature,
        {
          recipient,
          amount: new BigNumber(product.price),
          splToken: undefined,
        },
        { commitment: "confirmed" }
      );
      console.log("Transaction validated!");
      setPaymentValidated(true);

      toast.success("Payment confirmed!", {
        position: "top-right",
        autoClose: 5000,
      });

      setTimeout(() => {
        setShowQRCodeModal(false);
      }, 5000); // Close modal after 5 seconds
    } catch (error: any) {
      console.error("Error: ", error);

      if (error instanceof Error && error.message.includes("Not found")) {
        console.log("Transaction not found. Retrying...", reference.toBase58());
        if (showQRCodeModal) {
          setTimeout(() => listenForPayment(reference), 5000);
        }
      } else {
        setShowQRCodeModal(false);
        toast.error(`Transaction failed: ${error.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
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
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          {loading ? "Generating QR..." : "Buy with SOL"}
        </button>
      </div>

      {showQRCodeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowQRCodeModal(false)}
            >
              &times;
            </button>
            <div className="text-center">
              {paymentValidated ? (
                <>
                  <p className="text-lg font-semibold mb-4">
                    Payment Successful!
                  </p>
                  <img
                    src="/images/success.png"
                    alt="Payment successful"
                    className="w-60 h-100 object-cover mx-auto"
                  />
                </>
              ) : (
                <>
                  <p className="text-lg font-semibold mb-4">Scan to Pay</p>
                  <div className="flex justify-center">
                    <QRCode value={paymentUrl} size={256} />
                  </div>
                  {remainingTime > 0 ? (
                    <p className="mt-4 text-gray-600 text-center">
                      Waiting for payment... <br />
                      This transaction will expire in {remainingTime} seconds.
                    </p>
                  ) : (
                    <p className="mt-4 text-gray-600 text-center">
                      Checking for payment...
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
