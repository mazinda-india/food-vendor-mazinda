import connectDB from "@/libs/mongoose";
import { NextResponse } from "next/server";
import DeliveryPerson from "@/models/DeliveryPerson";

export async function PUT(req) {
    try {
        const { updatedDeliveryPerson } = await req.json();
        // Connecting to database
        await connectDB()

        // Checking if the user already exists
        let deliveryPerson = await DeliveryPerson.findOne({ _id: updatedDeliveryPerson._id });

        if (deliveryPerson) {
            
            deliveryPerson.name = updatedDeliveryPerson.name;
            deliveryPerson.number = updatedDeliveryPerson.number;
            deliveryPerson.alternateNumber = updatedDeliveryPerson.alternateNumber;
            deliveryPerson.password = updatedDeliveryPerson.password;

            await deliveryPerson.save();
            return NextResponse.json({ success: true, message: "Delivery person updated successfully" });
        } else {
            return NextResponse.json({ success: false, message: "Delivery person doesn't exist" });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: "An error occurred while fetching the Delivery person : " + error });
    }
}