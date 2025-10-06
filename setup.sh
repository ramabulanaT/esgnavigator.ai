# Navigate to your project directory
cd /path/to/your/esgnavigator

# Create src directory
mkdir -p src

# Create all config files using cat (copy each block one by one)

# 1. Create package.json
cat > package.json << 'EOF'
{
  "name": "esgnavigator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@react-pdf/renderer": "^4.3.0",
    "@tanstack/react-query": "^5.87.1",
    "express": "^5.1.0",
    "framer-motion": "^12.23.12",
    "lucide-react": "^0.542.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.9.3",
    "recharts": "^3.1.2"
  },
  "devDependencies": {
    "@types/cors": "^2.8.19",
    "@types/express": "^5.0.3",
    "@types/morgan": "^1.9.10",
    "@types/node": "^24.3.1",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "^5.9.2",
    "vite": "^6.0.11"
  }
}
EOF

# 2. Create vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
EOF

# 3. Create vite.config.ts
cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  build: {
    outDir: 'dist'
  }
})
EOF

# 4. Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["src"]
}
EOF

# 5. Create index.html
cat > index.html << 'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ESG Navigator</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
EOF

# 6. Create src/main.tsx
cat > src/main.tsx << 'EOF'
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# 7. Create src/App.tsx
cat > src/App.tsx << 'EOF'
import { useState } from 'react'

function App() {
  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>ESG Navigator</h1>
      <p>Your ESG Navigator application is running!</p>
    </div>
  )
}

export default App
EOF

# 8. Create src/index.css
cat > src/index.css << 'EOF'
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
}

#root {
  min-height: 100vh;
}
EOF

# 9. Create .gitignore
cat > .gitignore << 'EOF'
node_modules
dist
.env
.env.local
.vercel
*.log
EOF

# 10. Install dependencies
npm install

# 11. Test locally
npm run dev

# 12. Deploy to Vercel (once local test works)
vercel --prod
