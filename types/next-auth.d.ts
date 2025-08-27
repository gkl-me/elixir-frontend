import 'next-auth'



declare module  'next-auth'{
        interface Session{
            user : {
                googleId?:string
                name?:string,
                email?:string,
                image?:string
            }
        }
}