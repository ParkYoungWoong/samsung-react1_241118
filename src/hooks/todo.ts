import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { create } from 'zustand'

interface Todo {
  id: string // 할 일 ID
  order: number // 할 일 순서
  title: string // 할 일 제목
  done: boolean // 할 일 완료 여부
  createdAt: string // 할 일 생성일
  updatedAt: string // 할 일 수정일
}

type FilterStatus = 'all' | 'todo' | 'done'

export const useTodoFilterStore = create<{
  filterStatus: FilterStatus
  setFilterStatus: (filter: FilterStatus) => void
}>(set => ({
  filterStatus: 'all',
  setFilterStatus: filter => {
    set({
      filterStatus: filter
    })
  }
}))

export function useFetchTodos() {
  const filterStatus = useTodoFilterStore(state => state.filterStatus)
  return useQuery<Todo[]>({
    queryKey: ['todos'],
    queryFn: async () => {
      const res = await fetch('/api/todos', {
        method: 'POST'
      })
      return await res.json()
    },
    staleTime: 1000 * 60 * 5,
    select: todos => {
      return todos.filter(todo => {
        switch (filterStatus) {
          case 'all':
            return true
          case 'todo':
            return !todo.done
          case 'done':
            return todo.done
        }
      })
    }
  })
}

export function useCreateTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          method: 'POST',
          data: {
            title
          }
        })
      })
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
      const res = await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          endpoint: todo.id,
          method: 'PUT',
          data: todo
        })
      })
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

export function useDeleteTodo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (todo: Todo) => {
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({
          endpoint: todo.id,
          method: 'DELETE'
        })
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos']
      })
    }
  })
}
