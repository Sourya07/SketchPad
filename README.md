#  SketchPad

> **A high-performance, real-time collaborative whiteboard application.**

**SketchPad** is a scalable, full-stack web application designed for seamless real-time collaboration. Built with a modern microservices-ready architecture using **Turborepo**, it enables multiple users to draw, sketch, and brainstorm on a shared canvas instantly.

This project demonstrates advanced full-stack engineering concepts including WebSocket management, monorepo architecture, and type-safe communication between distributed services.

##  Tech Stack

### Frontend
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [TailwindCSS](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **State/Network**: Axios, Custom Hooks

### Backend & Infrastructure
- **Real-time Server**: Native [WebSockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API) (Node.js/ws) for low-latency bidirectional communication.
- **REST API**: [Express.js](https://expressjs.com/) service for authentication and user management.
- **Database**: [PostgreSQL](https://www.postgresql.org/) managed via [Prisma ORM](https://www.prisma.io/).
- **Monorepo Tooling**: [Turborepo](https://turbo.build/) for high-performance build system and package management.
- **Authentication**: JWT (JSON Web Tokens) with HTTP-only cookies and Bcrypt password hashing.

##  Key Features

- **Real-time Collaboration**: Multi-user drawing synchronization with low latency.
- **Shared Canvas**: Interactive whiteboard supporting shapes and freehand drawing.
- **Room Architecture**: Isolated drawing rooms for private sessions.
- **Robust Authentication**: Secure signup and login flows protecting user data.
- **Scalable Architecture**: Decoupled frontend, websocket, and API services allowing independent scaling.
- **Shared Packages**: Modular code design with shared UI components (`@repo/ui`), database configuration (`@repo/db`), and common utilities (`@repo/common`).

## 🛠️ Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- **Node.js**: >= 18.x
- **pnpm**: (Recommended package manager)
- **PostgreSQL**: Local instance or cloud provider URL.

### Installation

1.  **Clone the repository**
    ```bash
    git clone <repository-url>
    cd realtime
    ```

2.  **Install dependencies**
    ```bash
    pnpm install
    ```

3.  **Environment Setup**
    Ensure you have `.env` files set up in `apps/web`, `apps/ws`, `apps/backend-ex`, and `packages/db`.
    
    *Example variables:*
    ```env
    DATABASE_URL="postgresql://..."
    JWT_SECRET="your-super-secret"
    ```

4.  **Database Migration**
    ```bash
    pnpm db:generate
    pnpm db:push
    ```

5.  **Run Development Servers**
    ```bash
    pnpm dev
    ```

This command starts all applications effectively:
- **Web App**: `http://localhost:3000`
- **HTTP Backend**: `http://localhost:3001` (or configured port)
- **WebSocket Server**: `ws://localhost:8080` (or configured port)

## 🐳 Docker Support

Docker configuration is available in the `docker/features` branch.

### Quick Start with Docker

1.  **Switch to the Docker branch**
    ```bash
    git checkout docker/features
    ```

2.  **Build the images**
    Run the following commands from the project root:

    ```bash
    # Build Web App
    docker build -t sketchpad-web -f docker/Dockerfile.web .

    # Build WebSocket Server
    docker build -t sketchpad-ws -f docker/Dockerfile.ws .

    # Build Backend API
    docker build -t sketchpad-backend -f docker/Dockerfile.backned .
    ```

3.  **Run the containers**
    ```bash
    docker run -p 3000:3000 sketchpad-web
    docker run -p 8080:8080 sketchpad-ws
    docker run -p 3001:3001 sketchpad-backend
    ```



## Architecture Overview

The project is structured as a **Turborepo** monorepo:

- **`apps/web`**: The main user interface built with Next.js.
- **`apps/ws`**: Dedicated WebSocket server handling real-time drawing events.
- **`apps/backend-ex`**: Express backend handling HTTP requests (Auth, Room creation).
- **`packages/db`**: Shared Prisma client and schema.
- **`packages/common`**: Shared Zod schemas and types for validation.
- **`packages/ui`**: Shared React component library.

---

# Turborepo Starter Documentation (Reference)

This Turborepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
npx create-turbo@latest
```

## What's inside?

This Turborepo includes the following packages/apps:


### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build
yarn dlx turbo build
pnpm exec turbo build
```

You can build a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo build --filter=docs

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo build --filter=docs
yarn exec turbo build --filter=docs
pnpm exec turbo build --filter=docs
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo

# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev
yarn exec turbo dev
pnpm exec turbo dev
```

You can develop a specific package by using a [filter](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters):

```
# With [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation) installed (recommended)
turbo dev --filter=web

# Without [global `turbo`](https://turborepo.dev/docs/getting-started/installation#global-installation), use your package manager
npx turbo dev --filter=web
yarn exec turbo dev --filter=web
pnpm exec turbo dev --filter=web
```



## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.dev/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.dev/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.dev/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.dev/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.dev/docs/reference/configuration)
- [CLI Usage](https://turborepo.dev/docs/reference/command-line-reference)
