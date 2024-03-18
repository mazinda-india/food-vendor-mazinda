import Vendor from "@/models/Vendor";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req) {
  await connectDB();
  const { number, password } = await req.json();

  const userdata = await Vendor.findOne({
    number,
  });
  if (!userdata) {
    return NextResponse.json({ message: "No user Exist" }, { status: 400 });
  }
  const verify = password === userdata.password;

  if (!verify) {
    return NextResponse.json({ message: "password dont match" });
  }

  const tokenData = {
    id: userdata._id,
    email: userdata.email,
    name: userdata.name,
    number: userdata.number,
  };
  const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  cookies().set("vendor_token", token);
  return NextResponse.json({ message: "login successful" });
}
