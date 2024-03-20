import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import FoodOrder from "@/models/FoodOrder";

export async function PUT(req) {
  try {
    const { orderId, status } = await req.json();
    // Connecting to database
    await connectDB();

    // Checking if the user already exists
    let order = await FoodOrder.findOne({ _id: orderId });

    if (order) {
      order.status = status;
      await order.save();
      return NextResponse.json({
        success: true,
        message: "Orders fetched successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Order doesn't exist",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the order : " + error,
    });
  }
}
