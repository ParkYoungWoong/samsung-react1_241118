import { useParams, useNavigate } from 'react-router-dom'
import { useFetchTodos, useUpdateTodo, useDeleteTodo } from '@/hooks/todo'
import Modal from '@/components/Modal'
import { useState, useEffect } from 'react'

export default function Todo() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [done, setDone] = useState(false)
  const { todoId } = useParams()
  const { mutateAsync: mutateForUpdateTodo, error } = useUpdateTodo()
  const { mutateAsync: mutateForDeleteTodo } = useDeleteTodo()
  const { data: todos } = useFetchTodos()

  const todo = todos?.find(todo => todo.id === todoId)
  useEffect(() => {
    setTitle(todo?.title || '')
    setDone(todo?.done || false)
  }, [todo, todoId])

  async function updateTodo() {
    if (!todo) return // Todo 객체를 찾지 못했을 때,(주소의 Todo ID와 일치하는 객체가 없을 때)
    const _title = title.trim()
    if (!_title) return
    if (_title === todo.title && done === todo.done) return
    await mutateForUpdateTodo({
      ...todo,
      title: _title,
      done
    })
    if (error) {
      alert('수정 실패!')
      return
    }
    cancelTodo()
  }
  function cancelTodo() {
    navigate(-1)
  }
  async function deleteTodo() {
    if (!todo) return
    await mutateForDeleteTodo(todo)
    cancelTodo()
  }

  return (
    <Modal>
      {todo && (
        <>
          <div>
            <input
              type="checkbox"
              checked={done}
              onChange={e => setDone(e.target.checked)}
            />
          </div>
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
        <button onClick={updateTodo}>저장</button>
        <button onClick={cancelTodo}>취소</button>
        <button onClick={deleteTodo}>삭제</button>
      </div>
    </Modal>
  )
}
