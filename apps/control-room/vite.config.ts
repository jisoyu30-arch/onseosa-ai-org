import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 시험 저장소로 띄울 때는 포트를 바꿔 실제 집필실과 동시에 켤 수 있게 한다(scripts/start-writing-room.cmd test).
const uiPort = Number(process.env.STUDIO_UI_PORT || 5173);
const studioPort = Number(process.env.STUDIO_PORT || 3004);

export default defineConfig({
  plugins: [react()],
  server: {
    port: uiPort,
    strictPort: true, // 원고 저장 서버가 이 포트에서 온 요청만 받는다. 다른 포트로 슬쩍 바뀌면 안 된다.
    // 집필실 원고 저장 서버. 같은 주소로 부르게 해서 브라우저에 비밀 값을 두지 않는다.
    proxy: {
      '/api/studio': { target: `http://127.0.0.1:${studioPort}`, changeOrigin: false },
    },
  },
});
