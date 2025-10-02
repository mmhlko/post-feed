# Social Profile Application

A modern React application built with Feature-Sliced Design (FSD) architecture, featuring user profile management and interactive posts feed with full CRUD functionality.

## Tech Stack

- **React.js + TypeScript** - Modern frontend framework with type safety
- **TanStack Query** - Server state management and caching
- **Zustand** - Client state management
- **Ant Design** - Professional UI component library
- **Feature-Sliced Design (FSD)** - Architecture methodology for scalable frontend projects
- **Vite** - Fast build tool and development server

## Features

### User Profile Management
- Display user information (avatar, name, birth date, bio, contact details)
- Edit profile functionality with modal form
- Avatar upload with drag & drop support
- Responsive profile card design

### Posts Feed (Wall)
- Create new posts with text and multiple images
- Edit existing posts (modify text, add/remove images)
- Delete posts with confirmation dialog
- Sort posts by newest/oldest
- Pagination with "Load More" functionality
- Image upload and preview

## Project Structure (FSD)

```
/src
├── /app                    # App initialization
│   └── /providers          # App providers (QueryClient, etc.)
├── /processes              # Business processes
│   └── /auth              # Authentication process
├── /pages                  # Application pages
│   └── /profile           # Profile page
├── /widgets                # Complex UI blocks
│   ├── /profile-card      # User profile widget
│   └── /posts-feed        # Posts feed widget
├── /features               # User interactions
│   ├── /edit-profile      # Edit profile modal
│   ├── /manage-post       # Post CRUD operations
│   └── /upload-image      # Image upload component
├── /entities               # Business entities
│   ├── /user              # User entity (types, API, hooks)
│   └── /post              # Post entity (types, API, hooks)
└── /shared                 # Shared resources
    ├── /api               # API client and configuration
    ├── /ui                # Reusable UI components
    ├── /lib               # Utilities and helpers
    └── /config            # App configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/91085988-fe7d-4c51-a04f-72b0553fcbfc) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
