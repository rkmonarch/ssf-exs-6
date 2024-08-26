# Point-Of-Sale (POS) System with Solana Pay

This project is a simple Point-of-Sale (POS) web UI built using React and Solana Pay. The application allows users to browse through a selection of products and purchase them using SOL, the native token of the Solana blockchain. The payment process involves generating a payment request, processing the payment, and verifying the transaction using Solana Pay and the Solana blockchain.

## Features

- **Product Display**: Users can view a selection of products, each with a name, price in SOL, and image.
- **Purchase with Solana Pay**: Users can buy products using SOL via Solana Pay. The transaction is processed on the Solana blockchain.
- **Payment Confirmation**: After making a payment, the transaction is verified and confirmed. If the transaction is successful, a confirmation message is displayed to the user.

## Technologies Used

- **Next.JS**: Frontend library for building the user interface.
- **Solana Pay**: Library for handling payments on the Solana blockchain.
- **Solana Web3.js**: Library for interacting with the Solana blockchain.
- **React Toastify**: Library for displaying notifications.
- **Tailwind CSS**: Utility-first CSS framework for styling the UI.

## Getting Started

### Prerequisites

Before running the project, ensure you have the following installed:

- **Node.js**: v14 or later
- **npm**: Node package manager

### Installation

1. Clone the repository:
```
   git clone https://github.com/rkmonarch/ssf-exs-6
   cd solana-pay-pos
```

2. Install the dependencies:
```
pnpm i
```

3. Start the development server:
```
pnpm dev
```

4. Open your browser and go to http://localhost:3000 to view the application.

## Environment Variables
Ensure you have a connection to the Solana Devnet by configuring the Connection object with the appropriate endpoint:
```
const connection = new Connection("https://api.devnet.solana.com");
```

## Product Data
The products are predefined in the products array located in the codebase. You can customize the product list by editing the products array:

```
const products = [
  {
    id: 1,
    name: "T-shirt",
    price: 0.01,
    image: "/images/t-shirt.png",
  },
  {
    id: 2,
    name: "Cap",
    price: 0.02,
    image: "/images/cap.png",
  },
  {
    id: 3,
    name: "Hoodie",
    price: 0.03,
    image: "/images/hoodie.png",
  },
  // Add more products as needed
];
```

## Usage
Browse Products: Users can browse the available products on the main page.

Purchase a Product: Click the "Buy with SOL" button to initiate the payment process. The system will generate a payment request, and after completing the payment, the transaction will be confirmed and verified.

Payment Confirmation: Upon successful payment, a notification will display the confirmation status.

## Troubleshooting
Transaction Not Found: If the payment verification fails with a "Transaction not found" error, ensure that the transaction is confirmed on the Solana blockchain.

## You can learn more about the solana-pay and transaction verification here

### Resources:

#### https://www.quicknode.com/guides/solana-development/solana-pay/getting-started-with-solana-pay

#### https://docs.solanapay.com/

## License
This project is licensed under the MIT License. See the LICENSE file for more details.


