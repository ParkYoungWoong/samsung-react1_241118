# Node.js

## Windows

- Node.js 설치 프로그램을 관리자 권한으로 설치
- VS Code 관리자 권한으로 실행
- VS Code 재부팅

```bash
node -v
npm -v
```

## Vercel 서버

터미널에서 Vercel CLI 설치하세요!

```bash
# Vercel 설치
npm i vercel
# 브라우저에서 로그인 후~
npx vercel login
# 로그인 완료 후~
npx vercel dev
# localhost:3000 확인!
```

`/vite.config.ts` 파일에서 다음과 같이 `server.proxy` 설정하세요!

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [{ find: '@', replacement: '/src' }]
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
      }
    }
  }
})
```

개별적인 서버를 열어줘야 합니다!

```bash
# 새 터미널에서 Vercel 서버 열기!
npx vercel dev

# 새 터미널에서 Vite 서버 열기!
npm run dev
```

추가로, 스크립트 명령을 병렬로 실행할 수 있는 `concurrently` 라이브러리를 설치할 수도 있어요!

```bash
npm i -D concurrently
```

```json
{
  "scripts": {
    "dev": "concurrently npm:dev:*",
    "dev:vite": "vite",
    "dev:vercel": "vercel dev",
  }
}
```