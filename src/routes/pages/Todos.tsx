import { useState } from 'react'
import { useFetchTodos, useCreateTodo, useTodoFilterStore } from '@/hooks/todo'
import Loader from '@/components/Loader'
import { Link, Outlet } from 'react-router-dom'

export default function Todos() {
  const { data: todos, isLoading } = useFetchTodos()
  const { mutate } = useCreateTodo()
  const [title, setTitle] = useState('')
  const setFilterStatus = useTodoFilterStore(state => state.setFilterStatus)

  function createTodo(event?: React.KeyboardEvent<HTMLInputElement>) {
    if (event?.nativeEvent.isComposing) return
    mutate(title) // mutationFn 실행!
  }

  return (
    <>
      <h1>Todos!</h1>

      <input
        value={title}
        onChange={e => setTitle(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && createTodo(e)}
      />
      <button onClick={() => createTodo()}>추가</button>

      <div>
        <button onClick={() => setFilterStatus('all')}>전체</button>
        <button onClick={() => setFilterStatus('todo')}>할 일</button>
        <button onClick={() => setFilterStatus('done')}>완료</button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <ul>
          {todos?.map(todo => {
            return (
              <li key={todo.id}>
                <Link to={`/todos/${todo.id}`}>
                  ({todo.done ? 'v' : ' '}) {todo.title}
                </Link>
              </li>
            )
          })}
        </ul>
      )}

      <Outlet />
    </>
  )
}
