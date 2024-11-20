import { useQuery } from '@tanstack/react-query'

export default function DelayedData({ time }: { time: number }) {
  const { data } = useQuery({
    queryKey: ['delay', time],
    queryFn: async () => {
      const res = await fetch(`https://api.heropy.dev/v0/delay?t=${time}`)
      return await res.json()
    },
    staleTime: 1000 * 60
  })
  return (
    <>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  )
}
