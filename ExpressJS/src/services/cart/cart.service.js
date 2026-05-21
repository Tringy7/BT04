    import db from '../../models/index.js';

    const { Cart, CartItem, Product } = db;

    const getCart = async (userId) => {
        let cart = await Cart.findOne({
            where: { userId },
            include: [{
                model: CartItem,
                as: 'items',
                attributes: ['id', 'productId', 'quantity', 'price'],
                include: [{
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'name', 'price', 'thumbnail'] 
                }]
            }]
        });

        if (!cart) {
            cart = await Cart.create({ userId });
            cart.setDataValue('items', []); 
        }

        return cart;
    };

    const addToCart = async (userId, productId, quantity = 1) => {
        const product = await Product.findByPk(productId);
        if (!product) throw new Error('Sản phẩm không tồn tại');
        if (product.stock < quantity) throw new Error('Số lượng sản phẩm trong kho không đủ');

        let [cart] = await Cart.findOrCreate({ where: { userId } });

        let cartItem = await CartItem.findOne({
            where: { cartId: cart.id, productId }
        });

        if (cartItem) {
            cartItem.quantity += parseInt(quantity);
            if (product.stock < cartItem.quantity) throw new Error('Vượt quá số lượng sản phẩm trong kho');
            await cartItem.save();
        } else {
            cartItem = await CartItem.create({
                cartId: cart.id,
                productId,
                quantity,
                price: product.price 
            });
        }

        return cartItem;
    };

    const updateCartItem = async (userId, cartItemId, quantity) => {
        const cartItem = await CartItem.findOne({
            where: { id: cartItemId },
            include: [{ model: Cart, as: 'cart', where: { userId } }] 
        });

        if (!cartItem) throw new Error('Sản phẩm không tồn tại trong giỏ hàng');
        if (quantity < 1) throw new Error('Số lượng không hợp lệ');

        cartItem.quantity = quantity;
        await cartItem.save();
    };

    const deleteCartItem = async (userId, cartItemId) => {
        const cartItem = await CartItem.findOne({
            where: { id: cartItemId },
            include: [{ model: Cart, as: 'cart', where: { userId } }]
        });
        if (!cartItem) throw new Error('Không tìm thấy sản phẩm để xóa');
        await cartItem.destroy();
    };

    export default { getCart, addToCart, updateCartItem, deleteCartItem };