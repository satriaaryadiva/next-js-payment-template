
 
import Midtrans from "midtrans-client";
import { NextResponse } from "next/server";

  const snap = new Midtrans.Snap({
    isProduction: false,
    clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
  });


export async function POST(req) {
    try{
        const { id, productName  , price, quantity} = await req.json();
        const parameter = { 
            transaction_details: {
                order_id: id,
                gross_amount: price * quantity,
            },
            credit_card: {
                secure: true,
            },
            item_details: [
                {
                    id: id,
                    price: price,
                    quantity: quantity,
                    name: productName,
                },
            ],
        };
        const token = await snap.createTransaction(parameter);
        return NextResponse.json(  token );

    } catch (error) {
        console.error("Error creating transaction:", error);
        return NextResponse.json({
            error: "Failed to create transaction"
        }, {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
        
    }
    
}

