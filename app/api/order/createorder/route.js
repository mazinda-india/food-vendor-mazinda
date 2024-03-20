import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import FoodOrder from "@/models/FoodOrder";

export async function POST(req) {
  try {
    const {
      userId,
      vendorId,
      products,
      address,
      amount,
      paymentInfo,
      paymentMethod,
      paymentLink,
    } = await req.json();
    await connectDB();

    const order = await FoodOrder.create({
      userId,
      vendorId,
      products,
      address,
      amount,
      paymentInfo,
      paymentMethod,
      paymentLink,
    });
    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      order: order,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the order : " + error,
    });
  }
}
