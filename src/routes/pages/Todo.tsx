import { useParams, useNavigate } from 'react-router-dom'
import { useFetchTodos, useUpdateTodo } from '@/hooks/todo'
import Modal from '@/components/Modal'
import { useState, useEffect } from 'react'

export default function Todo() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const { todoId } = useParams()
  const { mutateAsync, error } = useUpdateTodo()
  const { data: todos } = useFetchTodos()

  // 400 클라이언트 에러
  // 500 서버 에러

  const todo = todos?.find(todo => todo.id === todoId)
  useEffect(() => {
    console.log('todos', todos)
    setTitle(todo?.title || '')
  }, [todo, todoId])

  async function save() {
    if (!todo) return
    const _title = title.trim()
    if (!_title) return
    if (_title === todo.title) return
    await mutateAsync({
      ...todo,
      title: _title
    })
    if (error) {
      alert('수정 실패!')
      return
    }
    cancel()
  }
  function cancel() {
    navigate(-1)
  }

  return (
    <Modal>
      {todo && (
        <>
          <div>{JSON.stringify(todo.done)}</div>
          <div>
            <textarea
              style={{ width: '100%', padding: 10, boxSizing: 'border-box' }}
              value={title}
              rows={4}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>{todo.createdAt}</div>
          <div>{todo.updatedAt}</div>
        </>
      )}
      <div>
        <button onClick={save}>저장</button>
        <button onClick={cancel}>취소</button>
      </div>
    </Modal>
  )
}
