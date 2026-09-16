# Contributing to JobTrackr.io

Thank you for your interest in contributing to **JobTrackr.io**! 🎉  
We welcome contributions of all kinds: bug reports, feature requests, documentation improvements, UI/UX enhancements, and code contributions.

---

## 🛠️ Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Git**

### 1. Fork & Clone the Repository
```bash
git clone https://github.com/YOUR-USERNAME/JobTrackr.io.git
cd JobTrackr.io
```

### 2. Install Dependencies
Run the unified installer script from the root directory:
```bash
npm run install:all
```
*Or install client and server packages separately:*
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Environment Variables
Copy the example environment file in `server/`:
```bash
cp server/.env.example server/.env
```
Default configuration uses embedded local **SQLite** (no database setup required!) and includes heuristic fallback for AI features if an OpenAI API key is not supplied.

### 4. Start Development Servers
From the root directory:
```bash
# In one terminal (or root with concurrently):
cd server && npm run dev

# In a second terminal:
cd client && npm run dev
```

The application will be live at:
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend**: [http://localhost:5000](http://localhost:5000)

---

## 🌿 Branching & Git Conventions

1. Create a feature branch from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
2. Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat: add new calendar view for interviews`
   - `fix: resolve S.No increment issue on empty filter`
   - `docs: update deployment instructions`
   - `style: refine heatmap tooltip contrast`

---

## 🧪 Testing & Verification Before PR

1. Build both client and server to verify there are no TypeScript or bundling issues:
   ```bash
   npm run build
   ```
2. Test responsive layouts and light/dark theme toggle.
3. Push your branch to your fork and submit a **Pull Request (PR)** against `main`.

---

## 📜 Code of Conduct
Please review and follow our [Code of Conduct](./CODE_OF_CONDUCT.md) in all interactions within this project.
