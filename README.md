# File Management Frontend

Modern file management web application built with React, TypeScript, and Feature-Sliced Design architecture.

## Features

- ✅ User authentication (signup/login)
- ✅ File upload with real-time progress tracking
- ✅ File list with pagination and sorting
- ✅ File metadata editing (rename)
- ✅ File deletion
- ✅ Image thumbnail preview
- ✅ Responsive design with Tailwind CSS

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library + MSW
- **Architecture**: Feature-Sliced Design (FSD)

## Prerequisites

- Node.js 18.x or higher
- npm 10.x or higher

## Installation

### 1. Install Dependencies

```bash
cd homework-frontend
npm install
```

### 2. Environment Configuration

Create `.env.local` file:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure (Feature-Sliced Design)

```
src/
├── app/                          # Application layer
│   ├── App.tsx                  # Root component + routing
│   └── routes/
│       └── PrivateRoute.tsx     # Authentication guard
│
├── pages/                        # Page layer (routes)
│   ├── login/
│   ├── register/
│   └── dashboard/
│
├── widgets/                      # Complex composite components
│   └── file-list/
│       ├── model/               # Business logic
│       └── ui/                  # UI components
│
├── features/                     # Feature layer (core business logic)
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── file-upload/
│   ├── file-edit/
│   └── file-delete/
│
├── entities/                     # Entity layer (domain models)
│   ├── user/
│   │   ├── api/                 # User API calls
│   │   └── model/               # User types
│   └── file/
│       ├── api/                 # File API calls
│       └── model/               # File types
│
└── shared/                       # Shared layer (infrastructure)
    ├── api/                     # API client with interceptors
    ├── ui/                      # Common UI components
    ├── lib/                     # Utility functions
    └── types/                   # Global types
```

## Architecture Decisions

### Why Feature-Sliced Design (FSD)?

1. **Clear layer separation**: Each layer has specific responsibilities
2. **Unidirectional dependencies**: Outer layers depend on inner layers
3. **Easy to scale**: Add new features without affecting existing code
4. **Team-friendly**: Multiple developers can work on different features
5. **Testable**: Each layer can be tested independently

### Layer Dependencies

```
app → pages → widgets → features → entities → shared
(Outer layers can depend on inner layers, but not vice versa)
```

### Key Patterns

- **Custom Hooks**: Business logic encapsulated in hooks (`useLogin`, `useFileUpload`)
- **Public API**: Each slice exports through `index.ts` (controlled API surface)
- **Path Aliases**: Absolute imports (`@/features/auth`) for better readability
- **Type Safety**: Full TypeScript coverage with strict mode

## Available Scripts

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)

# Build
npm run build        # Build for production
npm run preview      # Preview production build

# Testing
npm test             # Run tests in watch mode
npm run test:run     # Run tests once (CI mode)

# Linting
npm run lint         # Run ESLint
```

## Testing

This project includes unit tests using **Vitest**, **React Testing Library**, and **MSW** for API mocking.

### Running Tests

```bash
# Run tests in watch mode
npm test

# Run tests once (CI mode)
npm run test:run
```

### Test Coverage

```
✓ 24 tests passing
✓ 4 test files
```

**Coverage includes:**
- Utility functions (formatters, storage)
- API layer (login, signup, user info)
- UI components (LoginForm)

### CI/CD

Tests run automatically on every push and pull request via GitHub Actions (`.github/workflows/ci.yml`).

For detailed testing documentation, see `TESTING_SUMMARY.md` in the project root.

## API Integration

The frontend communicates with the backend API at `VITE_API_URL`.

### Authentication Flow

1. User logs in → receives JWT token
2. Token stored in `localStorage`
3. Axios interceptor automatically attaches token to requests
4. On 401 error → clear token and redirect to login

### File Upload Flow

1. User selects file(s)
2. `useFileUpload` hook handles upload with progress tracking
3. Axios `onUploadProgress` provides real-time progress
4. On success → refresh file list
5. File metadata saved to database, actual file stored in Supabase Storage

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

**Environment Variables** (set in Vercel dashboard):
- `VITE_API_URL`: Your backend API URL

### Manual Build

```bash
# Build production bundle
npm run build

# The dist/ folder contains optimized static files
# Upload to any static hosting service (Netlify, GitHub Pages, etc.)
```

## Known Limitations

1. **No offline support**: Requires internet connection
2. **LocalStorage for tokens**: Not ideal for sensitive apps (consider httpOnly cookies)
3. **No file versioning**: Cannot track file history
4. **Limited file types**: No special handling for videos/documents
5. **No drag-and-drop**: File upload is click-based only

## Future Improvements

### Short-term

- [ ] Drag-and-drop file upload
- [ ] File search and filtering
- [ ] Bulk operations (multi-delete, multi-download)
- [ ] Toast notifications for actions
- [ ] Dark mode support

### Long-term

- [ ] File sharing with public links
- [ ] Folder organization
- [ ] File preview modal (PDF, video, etc.)
- [ ] Real-time updates with WebSocket
- [ ] Progressive Web App (PWA) support
- [ ] i18n (internationalization)

## Development Guidelines

### Adding a New Feature

1. Create feature slice in `src/features/feature-name/`
2. Structure: `model/` (hooks), `api/` (API calls), `ui/` (components)
3. Export through `index.ts` (public API)
4. Use in pages/widgets through imports

Example:

```typescript
// src/features/file-share/index.ts
export { ShareButton } from './ui/ShareButton';
export { useFileShare } from './model/useFileShare';

// src/pages/dashboard/ui/DashboardPage.tsx
import { ShareButton } from '@/features/file-share';
```

### Code Style

- **TypeScript**: Use explicit types, avoid `any`
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **Comments**: English only, explain "why" not "what"

## Troubleshooting

### CORS Errors

Ensure backend `ALLOWED_ORIGINS` includes frontend URL.

### 401 Unauthorized

Check if:
1. Token exists in localStorage
2. Backend is running
3. Token hasn't expired (7 days by default)

### File Upload Fails

Check if:
1. File size < 50MB
2. Backend storage bucket configured
3. Network connection stable

## License

MIT

## Author

Created for MetAI Senior Full-Stack Engineer Take-Home Assignment
