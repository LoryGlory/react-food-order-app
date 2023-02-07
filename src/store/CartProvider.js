// manage cart context data and provide context to all necessary components
import {useReducer} from "react";

import CartContext from './cart-context';

// object holding cart default state
const defaultCartState = {
  items: [],
  totalAmount: 0
}

// reducer function for state management
const cartReducer = (state, action) => {

  // function to add items to cart
  if (action.type === 'ADD_ITEM') {
    const updatedTotalAmount = state.totalAmount + action.item.price * action.item.amount

    const existingCartItemsIndex = state.items.findIndex(item => item.id === action.item.id);

    const existingCartItem = state.items[existingCartItemsIndex];
    let updatedItems;

    // update cart items by addition to existing item oder concatenating to existing cart array
    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        amount: existingCartItem.amount + action.item.amount
      };
      updatedItems = [...state.items];
      updatedItems[existingCartItemsIndex] = updatedItem;
    } else {
      updatedItems = state.items.concat(action.item);
    }

    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
  }

  // function to remove items from cart
  if (action.type === 'REMOVE_ITEM') {
    // check if to added item id exists in cart items id
    const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.id
    );
    const existingItem = state.items[existingCartItemIndex];
    const updatedTotalAmount = state.totalAmount - existingItem.price;
    let updatedItems;
    if (existingItem.amount === 1) {
      updatedItems = state.items.filter(item => item.id !== action.id);
    } else {
      const updatedItem = {...existingItem, amount: existingItem.amount - 1};
      updatedItems = [...state.items];
      updatedItems[existingCartItemIndex] = updatedItem;
    }

    // return updated items + amount
    return {
      items: updatedItems,
      totalAmount: updatedTotalAmount
    };
  }

  if (action.type === 'CLEAR') {
    return defaultCartState;
  }

  return defaultCartState;
}

// provider containing add/remove and clear items from cart handlers
const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(cartReducer, defaultCartState);


  const addItemToCartHandler = (item) => {
    dispatchCartAction({
      type: 'ADD_ITEM',
      item: item
    });
  };


  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({
      type: 'REMOVE_ITEM',
      id: id
    })
  };

  const clearCartHandler = () => {
    dispatchCartAction({
      type: 'CLEAR'
    })
  };

  // cart value holding pointers to functions; value for cartContext provider below
  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItem: addItemToCartHandler,
    removeItem: removeItemFromCartHandler,
    clearCart: clearCartHandler
  };

  return (
      <CartContext.Provider value={cartContext}>
        {props.children}
      </CartContext.Provider>
  )
};

export default CartProvider;