import { getToken } from "next-auth/jwt";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
//import { jwt } from '../../utils/';



export async function middleware(req: NextRequest | any, ev: NextFetchEvent){

    //implement nextauth to get token

    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET });

    if( !session ){
        const url = req.nextUrl.clone();
        url.pathname = '/auth/login';
        url.search = `p=${req.page.name}`;

        //redirect to login
        return NextResponse.redirect(url);
    }

    return NextResponse.next();  
    // const { token } = req.cookies;

    // //verify the JWT
    // try {
    //     await jwt.isValidToken( token );

    //     return NextResponse.next();
    // } catch (error) {
        
    //     const url = req.nextUrl.clone()
    //     url.pathname = '/auth/login';
    //     url.search = `p=${req.page.name}`;
    //     return NextResponse.redirect( url );
    // }
}