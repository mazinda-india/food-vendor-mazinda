import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import FoodOrder from "@/models/FoodOrder";

export const POST = async (req) => {
  await connectDB();
  const { id } = await req.json();
  const foodOrder = await FoodOrder.findById({ _id: id });

  return NextResponse.json({
    success: true,
    isReady: foodOrder.isReady,
  });
};
export const PUT = async (req) => {
  await connectDB();
  const { isReady, id } = await req.json();
  try {
    const updatedFoodOrder = await FoodOrder.findByIdAndUpdate(
      id,
      { isReady },
      { new: true, runValidators: true }
    );

    if (!updatedFoodOrder) {
      return NextResponse.json({
        message: "Food Order not found",
        success: false,
      });
    }

    return NextResponse.json({
      message: "Food Order updated",
      success: true,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Food order cannot be updated " + error,
      success: false,
    });
  }
};
