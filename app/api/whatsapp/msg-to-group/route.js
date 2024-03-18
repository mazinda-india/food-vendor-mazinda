import { NextResponse } from "next/server";
import axios from 'axios'

export async function POST(req) {
    const { group_id, products, instructions, amount } = await req.json()
    console.log(products)

    let productsList = ""
    Object.entries(products).forEach(product => {
        console.log(product)
        productsList += `\n${product[0]} - ${product[1]['quantity']}\n`
    })
    const message = 
    `New order at citikartt. check on citikartt.com/vendor

    Products: \n${productsList}

    Instructions: ${instructions}

    Amount: ${amount}
    `
    const response = await axios.post(`https://wapp.powerstext.in/api/send_group?group_id=${group_id}&type=text&message=${message}&instance_id=6529330D84849&access_token=6529320725bca`)

    console.log(response.data)

    if (response.data.status === 'success') {
        return NextResponse.json({ status: 200, success: true })
    }

    return NextResponse.json({ status: 400, success: false })

}