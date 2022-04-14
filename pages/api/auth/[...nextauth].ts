import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import jwt from 'jsonwebtoken';
import { dbUsers } from '../../../database';

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
       // ...add more providers here
        Credentials({
            name: 'Custom Login',
            credentials: {
                email: { label: 'Email:', type: 'email', placeholder: 'yourEmail@email.com' },
                password: { label: 'Password:', type: 'password', placeholder: 'password' },
            },
            async authorize(credentials,){

                //console.log(credentials);

                //TODO: Implement custom login logic here and validate credentials in database
                //return {name: 'Mimi Chinchilla', email: 'Mimi@test.com', role: 'admin'};
                return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
            },
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
    ],

    //custom pages
    pages: {
        signIn: '/auth/login',
        newUser: '/auth/register',
    },

    //Callbacks
    jwt: {},

    //Session configuration
    session: {
        maxAge: 2592000000, // 30 days
        strategy: 'jwt',
        updateAge: 86400000, // 1 day
    },

    // Configure other options
    callbacks: {
        async jwt({token, account, user}){

            if( account ){
                token.accessToken = account.access_token;

                switch(account.type){
                    case 'oauth':
                        token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '' );
                        break;
                    case 'credentials':
                        token.user = user;
                        break;
                }
            }

            return token;
        },

        async session({session, token, user}){

            session.accessToken = token.accessToken;
            session.user = token.user as any;
            return session;
        }
    }

});
