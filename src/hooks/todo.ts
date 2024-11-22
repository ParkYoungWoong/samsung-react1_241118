import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

const headers = {
  'Content-Type': 'application/json',
  apikey: 'KDT8_bcAWVpD8',
  username: 'KDT8_ParkYoungWoong'
}

export function useFetchTodos() {
  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'GET',
          headers
        }
      )
      // if (!res.ok) {
      //   redirect('/error')
      // }
      // const data =  await res.json()
      // if (!Array.isArray(data)) {
      //   redirect('/error')
      // }
      return await res.json()
    },
    staleTime: 1000 * 60 * 5
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(
        'https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos',
        {
          method: 'POST',
          headers,
          body: JSON.stringify({
            title
          })
        }
      )
      return await res.json()
    },
    onMutate: title => {
      // 낙관적 업데이트
      const newTodo = {
        id: Date.now().toString(),
        title: title,
        done: false,
        createdAt: '',
        updatedAt: '',
        order: 0
      }
      const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      if (previousTodos) {
        queryClient.setQueryData(['todos'], [newTodo, ...previousTodos])
      }
      return previousTodos
    },
    onSuccess: data => {
      const todos = queryClient.getQueryData<Todo[]>(['todos'])
      if (todos) {
        // todos.shift()
        // todos.unshift(data)
        todos.splice(0, 1, data)
      }
      // 아~ 귀찮아, 그냥 새로 가져오자!
      // queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
    onError: (_error, _title, previousTodos) => {
      queryClient.setQueryData(['todos'], previousTodos)
      // const previousTodos = queryClient.getQueryData<Todo[]>(['todos'])
      // previousTodos?.shift()
    },
    onSettled: () => {}
  })
}

export function useUpdateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Todo) => {
      const res = await fetch(
        `https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todo.id}`,
        {
          method: 'PUT', // 전체 수정
          headers,
          body: JSON.stringify(todo)
        }
      )
      return await res.json()
    },
    onMutate: () => {},
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos']
      })
    },
    onError: () => {},
    onSettled: () => {}
  })
}
