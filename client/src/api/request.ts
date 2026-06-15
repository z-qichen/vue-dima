const BASE_URL = '/api'

interface ApiResponse<T = any> {
  code: number
  message: string
  data?: T
}

//实际发送请求
async function request<T = any>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('token')

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  })

  const json: ApiResponse<T> = await res.json()
  return json
}

export function get<T = any>(url: string) {
  return request<T>(url, { method: 'GET' })
}

export function post<T = any>(url: string, data?: any) {
  return request<T>(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
}

export function del<T = any>(url: string) {
  return request<T>(url, { method: 'DELETE' })
}

export type { ApiResponse }
