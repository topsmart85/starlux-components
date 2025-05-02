# Starlux Airlines Components

This project implements the expandable components and interactive components from the Starlux Airlines website using Nuxt 3, Tailwind CSS, Shadcn/vue, and VueUse.

## Features

- Expandable Components (flight search form with pop-up functionality)
- Interactive Components (tab navigation with form elements)
- Accessibility compliant (WCAG 2.1 AA)
- TypeScript implementation
- Keyboard navigation support
- Clean code architecture

## Prerequisites

- Node.js (v18 or higher)
- pnpm (configured with corepack)

## Setup

1. Enable corepack to use pnpm:

```bash
corepack enable
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

The application will be available at http://localhost:3000.

## Accessibility Features

- Full keyboard navigation support
- ARIA attributes for interactive elements
- Focus management
- Screen reader compatibility
- Proper HTML semantics
- Clear, descriptive labels

## Security

The project includes Content Security Policy (CSP) configuration through the Nuxt Security module to enhance security.

## Development Tools

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type checking

## Building for Production

To build the application for production:

```bash
pnpm build
```

To preview the production build:

```bash
pnpm preview
```