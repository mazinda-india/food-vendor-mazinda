import { NextResponse } from 'next/server';
import crypto from 'crypto'

export async function POST(req) {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await req.json();
        const body = razorpay_order_id + '|' + razorpay_payment_id

        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            return NextResponse.json({ signatureIsValid: true });
        } else {
            return NextResponse.json({ signatureIsValid: false });
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ signatureIsValid: false });
    }
}