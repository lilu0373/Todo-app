import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pagesにデプロイする場合、リポジトリ名をbaseに設定
// 例: リポジトリ名が "todo-app" の場合 → base: '/todo-app/'
// カスタムドメインを使う場合は base: '/' のままでOK
export default defineConfig({
  plugins: [react()],
  base: '/todo-app/',
})
