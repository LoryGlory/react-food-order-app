// cart component containing POST logic to firebase database for orders
import React, {useContext, useState} from "react";
import classes from './Cart.module.css';
import Modal from "../UI/Modal";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import Checkout from "./Checkout";

const Cart = props => {
  // states for handling checkout, during submitting and after submitting
  const [isCheckout, setIsCheckout] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [didSubmit, setDidSubmit] = useState(false);

  // use global context for cart data
  const cartCtx = useContext(CartContext);

  // initialize variables for total amount and cart items
  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  // handlers for context functions to add/remove and order items
  const cartItemRemoveHandler = id => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = item => {
    cartCtx.addItem({...item, amount: 1});
  };

  const orderHandler = () => {
    setIsCheckout(true);
  }

  // handler for submitting data
  const submitOrderHandler = async (userData) => {
    setIsSubmitting(true);

   await fetch('https://react-food-app-11fa1-default-rtdb.firebaseio.com/orders.json', {
      method: 'POST',
      body: JSON.stringify({
        user: userData,
        orderedItem: cartCtx.items
      })
    });
    setIsSubmitting(false);
    setDidSubmit(true);
    cartCtx.clearCart();
  }

  const cartItems = (
      <ul className={classes['cart-items']}>
        {cartCtx.items.map((item =>
                <CartItem
                    key={item.id}
                    name={item.name}
                    amount={item.amount}
                    price={item.price}
                    onRemove={cartItemRemoveHandler.bind(null, item.id)}
                    onAdd={cartItemAddHandler.bind(null, item)}
                >
                </CartItem>
        ))}
      </ul>);

  // content below orders, containing cancel & order buttons
  const modalActions =
      <div className={classes.actions}>
        <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
        {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
      </div>;


  const cartModalContent = (
      <React.Fragment>
        {cartItems}
        <div className={classes.total}>
          <span>Total Amount</span>
          <span>{totalAmount}</span>
        </div>
        {isCheckout && <Checkout onConfirm={submitOrderHandler} onCancel={props.onClose}/>}
        {!isCheckout && modalActions}
      </React.Fragment>
  )

  const isSubmittingModalContent = <p>Sending order data...</p>;

  // conditional content rendering after submission
  const didSubmitModalContent = (
      <React.Fragment>
        <p>Successfully sent the order!</p>
        <div className={classes.actions}>
          <button className={classes.button} onClick={props.onClose}>Close</button>
        </div>
      </React.Fragment>
  );

  return (
      //  modal content rendering conditional content
      <Modal onClose={props.onClose}>
        {!isSubmitting && !didSubmit && cartModalContent}
        {isSubmitting && isSubmittingModalContent}
        {!isSubmitting && didSubmit && didSubmitModalContent}
      </Modal>
  );
};

export default Cart;
