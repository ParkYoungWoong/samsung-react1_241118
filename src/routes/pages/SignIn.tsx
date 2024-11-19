import { useNavigate, useSearchParams } from 'react-router-dom'

export default function SignInPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const id = formData.get('id')
    const pw = formData.get('pw')
    console.log(id, pw)
    if (id && pw) {
      // 로그인 성공!
      localStorage.setItem('token', '1D234uya_sklsjefklajwn')
      const callbackUrl = searchParams.get('callbackUrl')
      navigate('/dashboard' || '/')
      // http://localhost:5173/signin/http://localhost:5173/dashboard
    }
  }

  return (
    <>
      <h1>Sign In Page!</h1>
      <form onSubmit={onSubmit}>
        <input
          name="id"
          placeholder="아이디를 입력하세요!"
        />
        <input
          name="pw"
          type="password"
          placeholder="비밀번호를 입력하세요!"
        />
        <button type="submit">로그인</button>
      </form>
    </>
  )
}
