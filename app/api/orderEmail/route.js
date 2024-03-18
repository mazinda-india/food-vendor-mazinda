import { NextResponse } from 'next/server';
import { sendEmail } from '@/config/mail';

export async function POST(req) {
    const vendorName = await req.json()
    try {
        const html =
            `
            <div>
                <div>
                    <h3>Password Reset Instructions | Citikartt</h3>
                </div>
                <div>
                    <p>Hello,</p>
                    <p>New order has arrived for ${vendorName}</p>
                    <p>Check it out</p>
                </div>
            </div>
        `
        await sendEmail("b21277@students.iitmandi.ac.in", "New order | Citikartt", html)
        return NextResponse.json({ status: 200, success: true, message: "Email sent successfully" })
    } catch (e) {
        console.log("An error occurred : " + e)
        return NextResponse.json({ status: 500, success: false, message: "Something went wrong, please try again later" })
    }

}