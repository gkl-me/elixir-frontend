export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export const API_ROUTES = {
  admin: `${API_BASE_URL}/admin`,
  user: `${API_BASE_URL}/user`,
}