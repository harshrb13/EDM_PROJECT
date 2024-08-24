import { useState } from "react";
import { VscError } from "react-icons/vsc";
import CartItem from "../components/CartItem";
import { RiH1 } from "react-icons/ri";
import { Link } from "react-router-dom";

const cartItem = [
  {
    productId: "sdasdsdads",
    photo:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQdNHQOEyKz9wiuDof_a28hQ5dB02UhIZptg&s",
    name: "MacBook",
    price: 3000,
    quantity: 4,
    stock: 10,
  },
];
const subtotal = 4000;
const tax = Math.round(subtotal * 0.18);
const shipingCharges = 200;
const discount = 400;
const total = subtotal + tax + shipingCharges;

const Cart = () => {
  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);
  return (
    <div className="cart">
      <main>
        {cartItem.length > 0 ? (
          cartItem.map((i, index) => <CartItem cartItem={i} key={index} />)
        ) : (
          <h1>No Item Added</h1>
        )}
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Shiping Charges: ₹{shipingCharges}</p>
        <p>Tax: ₹{tax}</p>

        <p>
          Discount: <em className="red">- ₹{discount}</em>
        </p>

        <p>
          <b>Total: ₹{total}</b>
        </p>

        <input
          type="text"
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Coupon Code"
          value={couponCode}
        />

        {couponCode &&
          (isValidCouponCode ? (
            <span className="green">
              ₹{discount} off using the
              <code>{couponCode}</code>
            </span>
          ) : (
            <span className="red">
              Invalid coupon <VscError />
            </span>
          ))}

          {cartItem.length>0 && <Link to={'/shipping'}>Checkout</Link>}
      </aside>
    </div>
  );
};

export default Cart;
