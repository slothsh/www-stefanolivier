## MANDATORY: Use td for Task Management

Run td usage --new-session at conversation start (or after /clear). This tells you what to work on next.

Sessions are automatic (based on terminal/agent context). Optional:
- td session "name" to label the current session
- td session --new to force a new session in the same context

Use td usage -q after first read.

## General Structure

```
/
├── website/                 # Main Laravel application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/ # Laravel controllers
│   │   │   ├── Middleware/  # HTTP middleware
│   │   │   └── Requests/    # Form request validation
│   │   ├── Mail/            # Mailable classes
│   │   ├── Models/          # Eloquent models
│   │   └── Providers/       # Service providers
│   ├── resources/
│   │   ├── css/             # Tailwind CSS (app.css)
│   │   ├── js/
│   │   │   ├── Pages/       # Svelte page components (Inertia)
│   │   │   ├── Lib/         # Shared utilities and animations
│   │   │   └── app.ts       # Entry point
│   │   └── views/           # Blade templates (email, SSR)
│   ├── routes/
│   │   └── web.php          # Route definitions
│   └── config/              # Laravel config files
└── infrastructure/          # Deployment configs
```

## Backend Stack

- **Framework**: Laravel 12 (PHP 8.3+)
- **ORM**: Eloquent
- **Mail**: Laravel Mail (SMTP)
- **Routing**: Standard Laravel routing with controller classes
- **Validation**: Form Request classes
- **Key packages**: Inertia.js Laravel, Ziggy (route helpers)

## Frontend Stack

- **Framework**: Svelte 5 with Runes ($state, $props, $effect)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4 with custom theme colors
- **Animation**: Anime.js 4
- **Icons**: Font Awesome via svelte-fa
- **Forms**: TanStack Form with Zod validation
- **Routing**: Inertia.js for SPA navigation

## Coding Conventions

### PHP
- PSR-4 autoloading
- Controller methods are lowercase (`store`, `index`, `show`)
- Form requests for validation (`ContactFormRequest`)
- Use `validated()` to get validated data

### TypeScript/Svelte
- Svelte 5 runes syntax (`$state`, `$props`, `$effect`)
- Type annotations with explicit interfaces
- Path alias: `@/` maps to `resources/js/`
- Component files: PascalCase (e.g., `ContactForm.svelte`)
- Animation logic separated into `Lib/` files

### CSS
- Tailwind utility classes
- Custom colors via CSS variables: `bg`, `text`, `text-muted`, `accent`, `border`
- Dark mode via `prefers-color-scheme: dark`

## Common Commands

```bash
# Install packages
cd website && bun install ...

# Development server
cd website && bun run dev

# Build for production
cd website && bun run build

# Generate route types
cd website && bun run routes

# Type check
cd website && bunx svelte-check --tsconfig ./tsconfig.json

# PHP tests
cd website && php artisan test
```
