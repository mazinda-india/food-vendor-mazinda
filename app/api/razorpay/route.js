import Razorpay from "razorpay";
import shortid from "shortid";
import { NextResponse } from "next/server";

// Initialize razorpay object
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_KEY,
});

export async function POST(req) {
    const { amount } = await req.json()  // amount in paisa. In our case it's INR 1
    const options = {
        amount: (amount*100).toString(),
        currency: "INR",
        receipt: shortid.generate(),
        notes: {
            // These notes will be added to your transaction. So you can search it within their dashboard.
            // Also, it's included in webhooks as well. So you can automate it.
            paymentFor: "example_ebook",
            userId: "user_id_here",
            productId: 'your_product_id'
        }
    };

    const order = await razorpay.orders.create(options);
    console.log(order)
    return NextResponse.json({ success: true, order: order});
}
