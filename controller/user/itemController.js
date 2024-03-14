import Items from "../../models/admin/itemModel.js"
import UserAccount from "../../models/user/authModel.js"
import CartItem from "../../models/user/cartModel.js"
import Order from "../../models/user/orderModel.js";
import Pizza from "../../models/user/pizzaModel.js"

import Stripe from "stripe";
import { OrderMail } from "../../utills/mailer.js";
import { generateToken } from "../../utills/index.js";

const stripe = new Stripe(process.env.STRIPE__KEY);

const DOMAIN = 'http://localhost:3002/payment'

export const createPizza = async (req, res) =>{
    try {
        const {userId} = req.body.user
        const {
            create,
            name, 
            size, 
            base, 
            sauce, 
            cheese, 
            veggies, 
            price} 
        = req.body

        const user = await UserAccount.findById(userId)
            
        if(!user){
            return res.status(403).json({
                success: false,
                message: 'Authorization failed!'
            })
        }

        let pizza;
        
        if(create){
            if(!name || !size || !base || !sauce || !cheese){
                return res.status(400).json({
                    success: false,
                    message: 'Select required fields'
                })
            }

            const calculateTotal = () => {
                const sizesTotal = size.price || 0;
                const crustTotal = base.price || 0;
                const sauceTotal = sauce.price || 0;
                const cheeseTotal = cheese.price || 0;
                const veggiesTotal = veggies.reduce((acc, veggie) => acc + veggie.price, 0);
                return parseFloat(sizesTotal + crustTotal + sauceTotal + cheeseTotal + veggiesTotal).toFixed(2)
            };

            const veggiesArray = veggies.map((veg)=>veg.name)

            pizza = new Pizza({
                name: name,
                size: size.name,
                base: base.name,
                sauce: sauce.name,
                cheese: cheese.name,
                veggies: veggiesArray,
                price: calculateTotal(),
                user : userId,
            })
    
            // Save the pizza
            await pizza.save();
    
            const ingredientsToUpdate = [base.name, sauce.name, cheese.name, veggiesArray];
            await Promise.all(ingredientsToUpdate.map(async (ingredient) => {
                await Items.findOneAndUpdate(
                    { 'type.name': ingredient }, 
                    { $inc: { 'type.$.stock': -1 } }
                );
            }));
        }else{
            const pizza = new Pizza({
                name: name,
                price: price,
                user : userId,
            })

            await pizza.save();
        }

        // Add the pizza to the user's cart
        const cartItem = new CartItem({
            user: userId,
            item: pizza._id,
            quantity: 1,
            price: price,
        });

        await cartItem.save();

        res.status(200).json({
            success: true,
            message: 'Pizza created and added to cart successfully!'
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        })
    }
}


export const fetchCart = async (req, res) => {
    try {
        const {userId} = req.body.user; 

        const user = await UserAccount.findById(userId);

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'Authorization failed!'
            })
        }

        // Find the cart items for the user
        const cartItems = await CartItem.find({ user: userId }).populate('item');

        res.status(200).json({
            success: true,
            data: cartItems
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false,
            message: 'Internal Server Error' 
        });
    }
  };

export const createOrder = async (req, res) =>{
    try{
        const {cart, totalAmount, name, quantity} = req.body
        const {userId} = req.body.user
        
        const user = await UserAccount.findById(userId)

        if(!user){
            return res.status(403).json({
                success: true,
                message: 'Authorization failed!'
            })
        }

        // Check if user has sufficient balance
        if (totalAmount > user.balance) {
            return res.status(403).json({
                success: false,
                message: 'Insufficient balance!'
            });
        }

        // Map cart items to their IDs
        const itemIds = cart.map(item => item._id);

        // Create order in your database
        const newOrder = new Order({
            user:  user._id,
            name: name[0],
            quantity: quantity[0],
            totalPrice: totalAmount,
        });

        console.log(newOrder)
        
        await newOrder.save();

        const imageUrl = 'http://localhost:3002/home-pizza.png';

        // Create an array of the same image URL repeated for each item in the cart
        const imagesArray = Array(cart.length).fill(imageUrl);

        // Convert the array to a comma-separated string
        const imagesString = imagesArray.join(',');

        const lineItems = cart.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.item.name,
                    images: [imagesString], // Add image URL for the product
                    metadata: {
                    productId: item.item._id, // Add any additional metadata as needed
                    },
                },
                unit_amount: Math.round(item.price * 100), // Amount in cents
            },
            quantity: item.quantity,
        }));
        

        const session = await stripe.checkout.sessions.create({
            customer_email: user.email,
            submit_type: 'pay',
            billing_address_collection: 'auto',
            shipping_address_collection: {
                allowed_countries: ['US', 'CA'],
            },
            line_items: lineItems,
            mode: 'payment',
            success_url: `${DOMAIN}?success=true`,
            cancel_url: `${DOMAIN}?canceled=true`,
        });
        res.status(200).json({
            success: true,
            url: session.url
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!'
        })
    }
}

export const clearCart = async (req, res) => {
    try{
        const {userId} = req.body.user
        
        const user = await UserAccount.findById(userId)

        if(!user){
            return res.status(403).json({
                success: true,
                message: 'Authorization failed!'
            })
        }

        // Fetch all cart items of the user
        const cartItems = await CartItem.find({ user: userId });

        // Calculate total price in the cart
        const totalPrice = cartItems.reduce((total, item) => parseFloat(total) + parseFloat(item.price), 0);

        // Deduct total price from user's balance
        user.balance -= totalPrice;

        await CartItem.deleteMany({ user: userId });

        // Save the updated user
        await user.save();

        await OrderMail(user.email)

        const token = generateToken(user._id)

        user.password = undefined

        // Respond with success message
        res.status(200).json({
            success: true,
            message: 'Cart cleared successfully!',
            user,
            token
        });

    }catch(error){
        console.log(error)
        res.status(500).json({
            success: false,
            message: 'Internal Server Error!',
        })
    }
}

// Controller to add an item to the cart
export const addToCart = async (req, res) => {
    try {
        const {userId} = req.body.user
        const { itemId, quantity, price } = req.body;

        const user = await UserAccount.findById(userId)

        if(!user){
            return res.status(403).json({
                success: true,
                message: 'Authorization failed!'
            })
        }

        // Check if the item already exists in the cart
        let cartItem = await CartItem.findOne({ user: userId, item: itemId });
        let pizzaItem = await Pizza.findOne({user: userId})

        if (cartItem && pizzaItem) {
            
            // If item already exists, update the quantity
            pizzaItem.quantity += quantity
            pizzaItem.price += quantity * price
            cartItem.quantity += quantity;
            cartItem.price += quantity * price;
            await cartItem.save();
            await pizzaItem.save();
        } else {
            // If item doesn't exist, create a new cart item
            cartItem = new CartItem({
                user: userId,
                item: itemId,
                quantity,
                price: quantity * price
            });
            await cartItem.save();
        }

        res.status(200).json({
            success: true,
            message: 'Item added to cart successfully!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

// Controller to decrease the quantity of an item in the cart
export const decreaseQuantity = async (req, res) => {
    try {
        const {userId} = req.body.user
        const { itemId, quantity, price } = req.body;

        const user = await UserAccount.findById(userId)

        if(!user){
            return res.status(403).json({
                success: true,
                message: 'Authorization failed!'
            })
        }

        // Find the cart item
        const cartItem = await CartItem.findOne({ user: userId, item: itemId });
        const pizzaItem = await Pizza.findOne({user: userId})

        if (!cartItem) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found'
            });
        }

        // If quantity is 1, remove the item from the cart
        if (cartItem.quantity === 1) {
            await cartItem.remove();
        } else {
            // If quantity is greater than 1, decrease the quantity by 1
            cartItem.quantity -= 1;
            pizzaItem.quantity -= 1
            pizzaItem.price -= quantity * price
            cartItem.price -= quantity * price;
            await cartItem.save();
            await pizzaItem.save();
        }

        res.status(200).json({
            success: true,
            message: 'Quantity decreased successfully!'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}

export const getOrder = async (req, res)=>{
    try {
        const {userId} = req.body.user

        const user = await UserAccount.findById(userId)

        if(!user){
            return res.status(403).json({
                success: false,
                message: 'Authorization failed',
            })
        }

        const userOrders = await Order.findOne({user: userId})

        res.status(200).json({
            success: true,
            message: 'Orders fetched',
            data: userOrders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Internal Server Error'
        });
    }
}