import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export const GET = async (req) => {
  const token = cookies().get("vendor_token");

  let decoded;

  try {
    decoded = jwt.verify(token.value, process.env.JWT_SECRET);

    return NextResponse.json({ success: true, decoded: decoded });
  } catch (err) {
    return NextResponse.json({ err, success: false });
  }
};
