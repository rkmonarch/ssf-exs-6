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
  {
    id: 4,
    name: "summer",
    price: 0.03,
    image: "/images/summer.png",
  },
  {
    id: 5,
    name: "escape",
    price: 0.03,
    image: "/images/escape.png",
  },
];

export default products;

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}
