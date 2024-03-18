import DeliveryPerson from "@/models/DeliveryPerson";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectDB();
    let deliveryPersons = await DeliveryPerson.find();
    return NextResponse.json({ success: true, deliveryPersons });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching delivery persons.",
    });
  }
}
