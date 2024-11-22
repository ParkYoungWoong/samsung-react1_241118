import fetch from 'node-fetch'
import type { VercelRequest, VercelResponse } from '@vercel/node'

interface RequestBody {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  endpoint: '' | 'deletions' | 'reorder'
  data: { [key: string]: unknown }
}
export default async function (req: VercelRequest, res: VercelResponse) {
  const {
    endpoint = '',
    method = 'GET',
    data
  } = (req.body || {}) as Partial<RequestBody>
  const response = await fetch(
    `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${endpoint}`,
    {
      method,
      headers: {
        'content-type': 'application/json',
        apikey: process.env.TODO_APIKEY || '',
        username: process.env.TODO_USERNAME || ''
      },
      body: JSON.stringify(data)
    }
  )
  const json = await response.json()
  res.status(200).json(json)
}
