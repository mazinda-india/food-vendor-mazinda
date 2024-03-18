import DeliveryPerson from "@/models/DeliveryPerson";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

// import CryptoJS from "crypto-js";

export async function POST(req) {
  try {
    const { deliveryPersonData } = await req.json();
    const { name, number, alternateNumber, password } = deliveryPersonData;
    await connectDB();
    let deliveryPerson = await DeliveryPerson.findOne({ name, number });

    if (!deliveryPerson) {
      await DeliveryPerson.create({ name, number, alternateNumber, password });
      // await Vendor.create({ name, number, alternateNumber, password: CryptoJS.AES.encrypt(password, process.env.SECRET_KEY).toString(), deliveryLocations, deliveryCharges, foodTypes });
      return NextResponse.json({
        success: true,
        message: "DeliveryPerson created successfully",
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "DeliveryPerson already exists",
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the DeliveryPerson : " + error,
    });
  }
}
