# ☕ Java Interview Hub

> A modern, all-in-one platform for Java developers to master interviews — featuring topic-wise Q&A, LeetCode tracking, AI-powered assistance, quizzes, bookmarks, and progress analytics.

🌐 **Live:** [https://javaprep.web.app](https://javaprep.web.app)

---

## 📸 Features

- 🗂️ **Topic-wise Java Q&A** — Browse structured Java interview questions by topic (OOP, Collections, Streams, Multithreading, etc.)
- 🧩 **LeetCode Tracker** — Add, categorize, and revisit LeetCode problems with difficulty badges and solutions
- 🤖 **AI Studio** — AI-powered Q&A assistant to get instant explanations and code help
- 📝 **Quiz Mode** — Test your knowledge with topic-based quizzes
- 🔖 **Bookmarks** — Save important questions for quick revision
- 📊 **Progress Dashboard** — Track your learning progress across all topics
- 🌙 **Dark / Light Mode** — Full theme toggle support
- 🔐 **Authentication** — Secure login via Supabase Auth

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript |
| Build Tool | Vite 7 |
| Styling | TailwindCSS + shadcn/ui |
| UI Components | Radix UI primitives |
| Backend / DB | Supabase (PostgreSQL + Auth) |
| Hosting | Firebase Hosting |
| State / Data Fetching | TanStack React Query |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Markdown Rendering | react-markdown + remark-gfm |
| Syntax Highlighting | react-syntax-highlighter |
| Charts | Recharts |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `>=18`
- npm or bun

### 1. Clone the Repository

```bash
git clone https://github.com/sbarathraj/java-interview-hub.git
cd java-interview-hub
```

### 2. Install Dependencies

```bash
npm install
# or
bun install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> Get these from your [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API

### 4. Start Development Server

```bash
npm run dev
```

App runs at `http://localhost:8080`

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start local development server |
| `npm run build` | Build for production (outputs to `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint checks |
| `npm run test` | Run all tests once (Vitest) |
| `npm run test:watch` | Run tests in watch mode |

---

## 🔥 Firebase Deployment

This project is deployed to Firebase Hosting under the site `javaprep`.

### Deploy manually

```bash
npm run build
firebase deploy
```

### CI/CD via GitHub Actions

Automatic deployments are configured:

- **Pull Requests** → Preview channel deploy (`.github/workflows/firebase-hosting-pull-request.yml`)
- **Merge to `main`** → Live channel deploy (`.github/workflows/firebase-hosting-merge.yml`)

---

## 📁 Project Structure

```
java-interview-hub/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # shadcn/ui base components
│   │   ├── Navbar.tsx
│   │   ├── QuestionCard.tsx
│   │   ├── CodeBlock.tsx
│   │   └── ...
│   ├── pages/             # Route-level page components
│   │   ├── Home.tsx
│   │   ├── TopicPage.tsx
│   │   ├── LeetcodeDashboard.tsx
│   │   ├── AIStudio.tsx
│   │   ├── Quiz.tsx
│   │   ├── Bookmarks.tsx
│   │   ├── ProgressDashboard.tsx
│   │   └── Auth.tsx
│   ├── context/           # React context providers
│   ├── hooks/             # Custom React hooks
│   ├── data/              # Static data & question banks
│   ├── integrations/      # Supabase client setup
│   ├── lib/               # Utility functions
│   └── main.tsx           # App entry point
├── public/                # Static assets
├── dist/                  # Production build output
├── firebase.json          # Firebase Hosting config
├── .firebaserc            # Firebase project alias
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind configuration
└── package.json
```

---

## 🌿 Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous public key |

> ⚠️ Never commit your `.env` file. It is already in `.gitignore`.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request → triggers a preview deploy automatically

---

## 👤 Author

**Barathraj S**
- GitHub: [@sbarathraj](https://github.com/sbarathraj)
- Email: jcibarathraj@gmail.com

---

## 📄 License

This project is for personal and educational use. All rights reserved © 2026 Barathraj S.
