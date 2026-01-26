

export const ENV = {
    ACCESS_TOKEN_SECRET:process.env.ACCESS_TOKEN_SECRET || 'secret',
    REFRESH_TOKEN_SECRET:process.env.REFRESH_TOKEN_SECRET || 'secret',
    SESSION_PASSWORD:process.env.SESSION_PASSWORD,
    NODE_ENV:process.env.NODE_ENV || "development",
    
}