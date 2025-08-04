import NextAuth from 'next-auth'
import  GoogleProvider from 'next-auth/providers/google'

const handler =  NextAuth({
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID||"",
            clientSecret:process.env.GOOGLE_SECRET||""
        })
    ],
    callbacks:{
        async jwt({token}){
            return token
        },
        async session({session,token}){
            session.user.name = token.name || ""
            session.user.email = token.email || ""
            session.user.image = token.picture || ""
            session.user.googleId = token.sub || ""
            return session
        }
    },
    session:{
        strategy:'jwt'
    }
}) 


export {handler as GET , handler as POST}
