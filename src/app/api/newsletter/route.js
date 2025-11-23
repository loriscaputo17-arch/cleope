// src/app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request) {
  try {
    const body = await request.json();

    const { firstName, lastName, email, phone } = body;

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await addDoc(collection(db, "newsletter"), {
      firstName,
      lastName,
      email,
      phone,
      createdAt: Timestamp.now(),
    });

    return NextResponse.json({ message: "Subscribed successfully" }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
