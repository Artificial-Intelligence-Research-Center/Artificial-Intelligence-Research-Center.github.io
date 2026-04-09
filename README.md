<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/18178bbf-4341-44b1-a2b2-200d8fde233b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install lucide-react framer-motion react-router-dom clsx tailwind-merge`
如果裝完上述套件，App.tsx 還是有紅字，通常是 TypeScript 類型定義檔 的問題。請再補上這一行「開發用」套件：
   `npm install -D @types/react @types/react-dom`
3. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
4. Run the app:
   `npm run dev`
