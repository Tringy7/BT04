import cartService from "../services/cart/cart.service.js"

const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const { productId, quantity } = req.body;

    const cartItem = await cartService.addToCart(
      userId,
      productId,
      quantity
    );

    return res.status(201).json({
      success: true,
      message: 'Add to cart successfully',
      data: cartItem
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cartItemId } = req.params;
    
    await cartService.deleteCartItem(userId, cartItemId);
    
    return res.status(200).json({
      success: true,
      message: 'Delete cart item successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
}

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await cartService.getCart(userId);

    return res.status(200).json({
      success: true,
      data: {
        items: cart.items || []
      }
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  addToCart,
  deleteCartItem,
  getCart
};