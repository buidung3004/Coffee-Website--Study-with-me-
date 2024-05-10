const Cart =  require("../../models/cart.model")

const productsHelper = require("../../helpers/product") 

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const cartId = req.cookies.cartId
    const productId = req.params.productId
    const quantity = parseInt(req.body.quantity)

    const cart = await Cart.findOne({
        _id: cartId
    })
    const existProductCart = cart.products.find(item => item.product_id == productId)

    if(existProductCart) {
        const newQuantity = quantity + existProductCart.quantity
        console.log(newQuantity)

        await Cart.updateOne(
            {
                _id: cartId,
                'products.product_id' :productId
            },
            {
                'products.$.quantity' :newQuantity
            }
        )
    } else {
        const objectCart = {
            product_id:productId,
            quantity: quantity
        }
    
        await Cart.updateOne(
            {
            _id: cartId
            },
            {
                $push: {products: objectCart}
            }
        )
    }

    req.flash("success", "Add to cart successful")

    res.redirect("back")
}