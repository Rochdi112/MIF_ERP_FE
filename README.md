# 🚀 ERP MIF Maroc — Frontend

<p align="center">
  <em>Modern Industrial Intervention Management Interface</em>
</p>

<p align="center">
  <a href="https://reactjs.org/"><img alt="React" src="https://img.shields.io/badge/React-18.2.0-61DAFB.svg"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.0.2-3178C6.svg"></a>
  <a href="https://vitejs.dev/"><img alt="Vite" src="https://img.shields.io/badge/Vite-6.3.5-646CFF.svg"></a>
  <a href="https://tailwindcss.com/"><img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC.svg"></a>
  <a href="https://www.radix-ui.com/"><img alt="Radix UI" src="https://img.shields.io/badge/Radix_UI-1.0.0-000000.svg"></a>
  <a href="https://www.docker.com/"><img alt="Docker" src="https://img.shields.io/badge/Docker-ready-2496ED.svg"></a>
</p>

---

## 📋 Table of Contents

- [📖 Overview](#-overview)
- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📁 Project Structure](#-project-structure)
- [🛠️ Technology Stack](#️-technology-stack)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation & Setup](#-installation--setup)
- [🔗 API Integration](#-api-integration)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [🛠️ Development](#️-development)
- [❓ Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 📖 Overview

**ERP MIF Maroc Frontend** is a modern, responsive web application built with **React 18**, **TypeScript**, and **Vite** for managing industrial interventions. The interface provides an intuitive dashboard for technicians, managers, and clients to interact with the ERP system through a clean, professional UI.

### 🎯 Key Capabilities

- Role-based user interfaces (Admin, Manager, Technician, Client)
- Real-time intervention tracking and management
- Equipment monitoring and maintenance scheduling
- Document upload and management
- Notification system with real-time updates
- Comprehensive reporting and analytics
- Mobile-responsive design

---

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with automatic token refresh
- **Role-based UI rendering** adapting to user permissions
- **Secure login/logout** with session management
- **Profile management** with user preferences

### 📊 Dashboard & Analytics
- **Real-time dashboard** with key metrics and KPIs
- **Intervention status overview** with visual indicators
- **Equipment health monitoring** with maintenance alerts
- **Performance analytics** with charts and graphs
- **Quick action widgets** for common tasks

### 👨‍🔧 Intervention Management
- **Create and track interventions** with detailed forms
- **Status management** (Open, In Progress, Closed, Cancelled)
- **Priority assignment** (Normal, High, Critical)
- **Technician assignment** with availability checking
- **Progress tracking** with timeline views

### 🔧 Equipment Management
- **Equipment catalog** with search and filtering
- **Maintenance scheduling** with automated reminders
- **Location tracking** with facility mapping
- **Performance history** and maintenance logs
- **Document attachment** for equipment manuals

### 👥 User & Role Management (Admin)
- **User CRUD operations** with role assignment
- **Permission management** with granular controls
- **Technician profiles** with skills and certifications
- **Client management** with contract details

### 📄 Document Management
- **File upload** with drag-and-drop interface
- **Document organization** by intervention or equipment
- **Secure downloads** with access controls
- **Version control** for document updates

### 🔔 Notifications
- **Real-time notifications** for status changes
- **Email integration** with customizable templates
- **In-app notification center** with read/unread status
- **Push notifications** for critical alerts

### 📱 Responsive Design
- **Mobile-first approach** with responsive layouts
- **Cross-browser compatibility** (Chrome, Firefox, Safari, Edge)
- **Touch-friendly interfaces** for tablet usage
- **Progressive Web App** capabilities

---

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   User Interface │    │   State Mgmt    │    │   API Layer     │
│   (React/Vite)   │◄──►│   (Zustand)     │◄──►│   (Axios)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Components     │    │   Services      │    │   Utilities     │
│   (Reusable)     │◄──►│   (Business)    │◄──►│   (Helpers)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Backend API    │    │   Database      │    │   File Storage  │
│   (FastAPI)      │    │   (PostgreSQL)  │    │   (Local/Cloud) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🏛️ Technical Architecture

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **State Management**: Zustand for lightweight, scalable state
- **UI Components**: Radix UI primitives with Tailwind CSS
- **API Communication**: Axios with interceptors for auth handling
- **Routing**: React Router v6 with protected routes
- **Form Handling**: React Hook Form with validation
- **Styling**: Tailwind CSS with custom design system

---

## 📁 Project Structure

```
VITE-FRONTEND-ERP-MIF-MAROC/
├── public/                     # Static assets
│   ├── vite.svg               # Vite logo
│   └── test-api.js           # API testing utility
├── src/                       # Source code
│   ├── components/            # Reusable UI components
│   │   ├── ui/               # Base UI components (Radix)
│   │   ├── forms/            # Form components
│   │   ├── layout/           # Layout components
│   │   ├── dashboard/        # Dashboard widgets
│   │   └── ...               # Feature components
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   ├── dashboard/       # Dashboard pages
│   │   ├── interventions/   # Intervention pages
│   │   ├── equipment/       # Equipment pages
│   │   ├── users/           # User management pages
│   │   └── ...              # Other pages
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts       # Authentication hook
│   │   ├── useApi.ts        # API communication hook
│   │   ├── useNotifications.ts # Notification hook
│   │   └── ...              # Other hooks
│   ├── services/             # API services
│   │   ├── api.ts           # Base API configuration
│   │   ├── auth.ts          # Authentication service
│   │   ├── interventions.ts # Intervention service
│   │   ├── equipment.ts     # Equipment service
│   │   └── ...              # Other services
│   ├── stores/               # State management (Zustand)
│   │   ├── authStore.ts     # Authentication state
│   │   ├── uiStore.ts       # UI state
│   │   ├── dataStore.ts     # Data state
│   │   └── ...              # Other stores
│   ├── utils/                # Utility functions
│   │   ├── constants.ts     # Application constants
│   │   ├── helpers.ts       # Helper functions
│   │   ├── validation.ts    # Validation utilities
│   │   └── ...              # Other utilities
│   ├── types/                # TypeScript type definitions
│   │   ├── api.ts           # API response types
│   │   ├── models.ts        # Data model types
│   │   └── ...              # Other types
│   ├── lib/                 # Third-party configurations
│   │   ├── axios.ts         # Axios configuration
│   │   └── ...              # Other configs
│   ├── styles/              # Global styles
│   │   ├── globals.css      # Global CSS
│   │   ├── components.css   # Component styles
│   │   └── ...              # Other styles
│   ├── App.tsx              # Main App component
│   ├── main.tsx             # Application entry point
│   └── vite-env.d.ts        # Vite environment types
├── tests/                    # Test files
│   ├── unit/                # Unit tests
│   ├── integration/         # Integration tests
│   └── e2e/                 # End-to-end tests
├── build/                   # Build output (generated)
├── node_modules/            # Dependencies (generated)
├── package.json             # Project configuration
├── package-lock.json        # Lock file
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── .env.example             # Environment variables example
├── Dockerfile               # Docker configuration
├── nginx.conf               # Nginx configuration
├── README.md                # This documentation
└── ...                      # Other configuration files
```

---

## 🛠️ Technology Stack

### Core Framework
- **React 18** - Modern React with concurrent features
- **TypeScript 5.0** - Type-safe JavaScript
- **Vite 6.3** - Fast build tool and dev server

### UI & Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Beautiful icons
- **Headless UI** - Unstyled accessible components

### State Management
- **Zustand** - Lightweight state management
- **React Query** - Server state management (optional)

### Forms & Validation
- **React Hook Form** - Performant forms with validation
- **Zod** - TypeScript-first schema validation

### HTTP & API
- **Axios** - HTTP client with interceptors
- **React Router 6** - Client-side routing

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **Playwright** - End-to-end testing

### Build & Deployment
- **Docker** - Containerization
- **Nginx** - Web server for production
- **Vercel/Netlify** - Deployment platforms

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Git

### 🚀 Docker Start (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Rochdi112/VITE-FRONTEND-ERP-MIF-MAROC.git
cd VITE-FRONTEND-ERP-MIF-MAROC

# 2. Create environment file
cp .env.example .env

# 3. Start with Docker
docker build -t erp-frontend .
docker run -p 3000:80 erp-frontend
```

The application will be available at: **http://localhost:3000**

### 🖥️ Local Development

```bash
# 1. Clone the repository
git clone https://github.com/Rochdi112/VITE-FRONTEND-ERP-MIF-MAROC.git
cd VITE-FRONTEND-ERP-MIF-MAROC

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

### 🛠️ VS Code Development

Use integrated VS Code tasks:

1. **Install Dependencies** - Installs npm packages
2. **Start Dev Server** - Launches Vite dev server
3. **Build for Production** - Creates optimized build
4. **Run Tests** - Executes test suite

---

## 🔧 Installation & Setup

### Environment Variables

Create a `.env` file in the project root:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000
VITE_API_TIMEOUT=10000

# Authentication
VITE_JWT_REFRESH_THRESHOLD=300000
VITE_SESSION_TIMEOUT=3600000

# Features
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_PWA=false
VITE_ENABLE_ANALYTICS=false

# Development
VITE_DEBUG=true
VITE_LOG_LEVEL=info
```

### Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker Setup

```bash
# Build Docker image
docker build -t erp-frontend .

# Run container
docker run -p 3000:80 --env-file .env erp-frontend

# Or use Docker Compose
docker compose up --build
```

---

## 🔗 API Integration

### Backend Connection

The frontend connects to the FastAPI backend through RESTful APIs:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **Authentication**: JWT tokens with automatic refresh
- **Error Handling**: Centralized error management
- **Caching**: Request caching for improved performance

### Authentication Flow

```typescript
// Automatic token refresh
const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  return response.data.access_token;
};

// API request with auth
const apiCall = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      await refreshToken();
      // Retry request
    }
    throw error;
  }
};
```

### Demo Mode

If the backend is unreachable, the application falls back to demo mode:

- **Demo Users**:
  - `admin` / `admin` (Full access)
  - `responsable` / `responsable` (Manager access)
  - `technicien` / `technicien` (Technician access)
  - `client` / `client` (Client access)

---

## 🧪 Testing

### Test Structure

```
tests/
├── unit/                     # Unit tests
│   ├── components/          # Component tests
│   ├── hooks/              # Hook tests
│   ├── services/           # Service tests
│   └── utils/              # Utility tests
├── integration/             # Integration tests
│   ├── api/                # API integration tests
│   └── workflows/          # Workflow tests
└── e2e/                     # End-to-end tests
    ├── playwright/         # Playwright tests
    └── cypress/            # Cypress tests (optional)
```

### Running Tests

```bash
# Run all tests
npm test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

### Test Configuration

- **Testing Framework**: Vitest for unit and integration tests
- **E2E Testing**: Playwright for browser automation
- **Coverage**: Istanbul for code coverage reporting
- **Mocking**: MSW for API mocking

---

## 🚀 Deployment

### Production Build

```bash
# Create optimized build
npm run build

# Preview build locally
npm run preview
```

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### Environment Variables for Production

```env
# Production environment
NODE_ENV=production
VITE_API_BASE_URL=https://api.your-domain.com
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_PWA=true
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build

# Testing
npm test             # Run tests
npm run test:watch   # Watch mode tests
npm run test:coverage # Coverage report

# Code Quality
npm run lint         # ESLint check
npm run lint:fix     # Auto-fix linting issues
npm run format       # Prettier formatting
npm run type-check   # TypeScript check

# Utilities
npm run clean        # Clean build artifacts
npm run analyze      # Bundle analyzer
```

### Development Guidelines

- **Component Structure**: Use functional components with hooks
- **TypeScript**: Strict type checking enabled
- **Code Style**: ESLint + Prettier configuration
- **Git Workflow**: Feature branches with PR reviews
- **Testing**: Write tests for new features

### Performance Optimization

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Components and routes loaded on demand
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Use `npm run analyze` to optimize bundle size

---

## ❓ Troubleshooting

### Common Issues

#### 1. Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

#### 2. API Connection Issues

```bash
# Check backend status
curl http://localhost:8000/health

# Verify environment variables
cat .env

# Check CORS configuration in backend
```

#### 3. TypeScript Errors

```bash
# Run type checking
npm run type-check

# Check for missing type definitions
npm install @types/package-name
```

#### 4. Styling Issues

```bash
# Rebuild Tailwind CSS
npm run build

# Check for CSS conflicts
# Verify Tailwind configuration
```

#### 5. Performance Issues

```bash
# Analyze bundle size
npm run analyze

# Check for unused dependencies
npm audit

# Optimize images and assets
```

### Debug Mode

Enable debug mode in `.env`:

```env
VITE_DEBUG=true
VITE_LOG_LEVEL=debug
```

This enables:
- Detailed console logging
- Development error overlays
- API request/response logging
- Performance monitoring

---

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/your-username/VITE-FRONTEND-ERP-MIF-MAROC.git`
3. **Create** a feature branch: `git checkout -b feature/new-feature`
4. **Make** your changes with tests
5. **Commit** following conventional commits: `git commit -m 'feat: add new feature'`
6. **Push** to your fork: `git push origin feature/new-feature`
7. **Create** a Pull Request

### Code Standards

- Follow TypeScript best practices
- Use functional components and hooks
- Write comprehensive tests
- Maintain code coverage > 80%
- Follow accessibility guidelines (WCAG 2.1)

### Pull Request Requirements

Before submitting a PR:

```bash
# Run full test suite
npm test

# Check code quality
npm run lint
npm run type-check

# Build successfully
npm run build

# Update documentation if needed
```

---

## 📄 License

**© 2025 MIF Maroc — All rights reserved**

This project is developed by **MIF Maroc** for industrial intervention management.

### Usage Terms

- Internal use authorized for MIF Maroc
- Modifications and distribution subject to authorization
- Contact: [contact@mif-maroc.com](mailto:contact@mif-maroc.com)

---

## 📞 Support

For questions or issues:

- **Documentation**: [README.md](README.md)
- **Issues**: [GitHub Issues](https://github.com/Rochdi112/VITE-FRONTEND-ERP-MIF-MAROC/issues)
- **Email**: support@mif-maroc.com

---

<p align="center">
  <em>Developed by Rochdi Sabir</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-React-61DAFB.svg" alt="Made with React">
  <img src="https://img.shields.io/badge/Powered%20by-Vite-646CFF.svg" alt="Powered by Vite">
  <img src="https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg" alt="Styling with Tailwind CSS">
</p>