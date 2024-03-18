import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import FoodOrder from "@/models/FoodOrder";

export async function POST() {
  try {
    // Connecting to database
    await connectDB();
    const orders = await FoodOrder.find();
    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error:
        "orderFetch: An error occurred while fetching the orders : " + error,
    });
  }
}
