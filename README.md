# HUMSJ — External Affairs Sector

## Overview

HUMSJ External Affairs is the official web application for the External Affairs Sector of the **Haramaya University Muslim Students Jema'a (HUMSJ)**, located at Haramaya University, Ethiopia.

The platform serves two audiences:

- **Public visitors** — community members, students, and donors who want to learn about the organisation, register for programs, read news, or make donations.
- **Administrators** — sector leaders who manage registrations, publish news/events, upload media, and oversee charity data through a protected multi-role admin panel.

---

## Features

### Public-Facing

- **Home** — mission statement, programme overview, impact statistics, and quick-access links.
- **About** — organisation history, values, goals, and leadership profiles (main leadership and subsector leaders with photos).
- **Vision & Mission** — detailed vision, mission, and core values page.
- **Organisational Structure** — visual overview of the sector's structure.
- **External Affairs Leaders (2000–2018)** — historical listing of past leaders.
- **Programs** — detailed breakdown of all active programmes including Quran Teaching, Islamic Education, Financial Support, Sadaqah Projects, Fundraising, and Community Outreach.
- **News & Updates** — filterable news and events feed (by category) loaded from Firebase Firestore with fallback to local sample data. Supports image, video, and audio media in posts.
- **Children Registration** — form to enrol children in Quran and Islamic education programmes.
- **Monthly Charity Registration** — form for the Student Sadaqah Programme.
- **Charity Distribution** — form for registering charity distribution recipients.
- **Help Registration** — form for financial assistance requests.
- **Donate** — information on active charity projects and donation methods (bank transfer, mobile banking, in-person). Links to CBE, CBE Birr, Telebirr, and M-Pesa details.
- **Donate Now** — dedicated donation submission page.
- **Contact** — contact form (validated with Zod, saved to Firestore), contact details, WhatsApp link, and embedded Google Map for Haramaya University.

### Admin Panel

The admin panel is protected by Firebase Authentication with a role-based access control (RBAC) system.

**Roles:**

| Role | Access |
|---|---|
| `superadmin` | Full access to all dashboards, posts, media, registrations, settings |
| `qirat` | Posts, media library |
| `dawa` | Posts, media library, contact messages |
| `charity` | Help registrations, children registrations, monthly charity, charity distributions |

**Features:**

- **Super Admin Dashboard** — tabbed overview of all submissions (help requests, children registrations, monthly charity, charity distributions, contact messages, posts) with view and delete actions.
- **Qirat Dashboard** — manages Qirat (Quran recitation) sector posts and content.
- **Dawa Dashboard** — manages Dawa (outreach) sector posts and content.
- **Charity Dashboard** — manages charity registrations and distributions.
- **External Affairs Dashboard** — sector-level overview for superadmin.
- **Create Post** — rich post editor supporting title, content, category, type (news/event), image URL, video, and audio uploads via Cloudinary.
- **Manage News** — view, edit, and delete published news and event posts.
- **Media Library** — full media management system: upload images (≤10 MB), videos (≤100 MB), audio (≤50 MB), and documents (≤20 MB) to Cloudinary; browse by type/category; grid/list view; drag-and-drop upload support.
- **Settings pages** per role (SuperAdmin, Qirat, Dawa, Charity).
- **Unauthorised** — access-denied page for insufficient permissions.

---

## Technology Stack

| Category | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build Tool | Vite 5 |
| Routing | React Router DOM v6 |
| Styling | Tailwind CSS v3 |
| UI Components | shadcn/ui (Radix UI primitives) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Data Fetching | TanStack Query (React Query) v5 |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| File Storage | Cloudinary |
| Firebase Functions | Firebase Functions (TypeScript) |
| Notifications | Sonner, Radix Toast |
| Charts | Recharts |
| Carousel | Embla Carousel |
| Animation | tailwindcss-animate |
| Linting | ESLint 9 + typescript-eslint |
| Deployment | Netlify (configured) |

---

## Project Architecture

The application is a React SPA (Single Page Application) served from a single `index.html`. All routing is handled client-side by React Router. Firebase is used for authentication, Firestore as the database, and Cloudinary for media storage.

**Firebase Collections used:**

- `posts` — news and events created by admins
- `defaultNews` — default/seed news items
- `customNews` — custom news items
- `helpRegistrations` — financial assistance requests
- `childrenRegistrations` — children programme enrolments
- `monthlyCharityRegistrations` — monthly charity sign-ups
- `charityDistributions` — charity distribution records
- `contacts` — contact form submissions
- `mediaLibrary` — uploaded media file metadata
- `users` — user records with role field for RBAC

---

## Project Structure

```
HUMSJ/
├── public/                    # Static assets (logo, robots.txt, _redirects)
├── src/
│   ├── assets/                # Images (logo, hero, news, leadership photos)
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, Layout wrapper
│   │   ├── ui/                # shadcn/ui component library
│   │   ├── MediaSelector.tsx  # Media selection component
│   │   ├── ProtectedRoute.tsx # Role-based route guard
│   │   └── ReplyModal.tsx     # Reply modal for admin messages
│   ├── hooks/
│   │   ├── useAuth.ts         # Firebase auth state + role fetching
│   │   └── use-toast.ts       # Toast notification hook
│   ├── lib/
│   │   ├── firebase.ts        # Firebase app initialisation
│   │   ├── cloudinary.ts      # Cloudinary upload utility
│   │   ├── roles.ts           # Role definitions and permissions
│   │   └── utils.ts           # Utility functions
│   ├── pages/                 # All page components (public + admin)
│   ├── App.tsx                # Root component with all routes
│   ├── main.tsx               # React entry point
│   └── index.css              # Global styles
├── functions/                 # Firebase Cloud Functions (TypeScript)
│   └── src/index.ts
├── index.html                 # HTML entry point
├── netlify.toml               # Netlify deployment config (SPA redirect)
├── firebase.json              # Firebase functions config
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/Nure-Tem/HUMSJ.git

# Navigate to the project directory
cd HUMSJ

# Install dependencies
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in your own Firebase and Cloudinary credentials:

```bash
cp .env.example .env
```

The following variables are required:

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID

VITE_CLOUDINARY_CLOUD_NAME
VITE_CLOUDINARY_API_KEY
VITE_CLOUDINARY_UPLOAD_PRESET
```

### Development

```bash
npm run dev
```

The application will start at `http://localhost:5173` by default.

---

## Production Build

```bash
npm run build
```

The output is generated in the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

---

## Deployment

### Netlify

The repository includes a `netlify.toml` that configures a catch-all redirect for SPA routing:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Deploy by connecting the repository to a Netlify site. Set all required environment variables in the Netlify dashboard under **Site settings → Environment variables**.

The `public/_redirects` file provides the same SPA routing fallback as a redundancy.

### Firebase Functions

Cloud Functions are located in the `functions/` directory. To deploy:

```bash
cd functions
npm install
npm run build
firebase deploy --only functions
```

---

## Responsive Design

The application uses a mobile-first responsive layout built with Tailwind CSS. The navbar includes a hamburger menu for small screens with a scrollable drawer for all navigation links and services. Grid layouts throughout the site adapt from single-column on mobile to multi-column on larger screens.

---

## Authentication

Authentication is handled by **Firebase Authentication**. Admin users log in via email and password at `/admin/login` (and per-sector login pages for Qirat, Dawa, and Charity).

After login, the user's role is fetched from Firestore (`users/{uid}.role`). The `ProtectedRoute` component wraps admin routes and redirects unauthenticated users to `/admin/login` and unauthorised users to `/admin/unauthorized`.

---

## Database / Backend

**Firebase Firestore** is the primary database. All form submissions, posts, and media metadata are stored in Firestore collections. **Firebase Authentication** manages admin user sessions. **Cloudinary** is used as the media asset host for images, videos, audio, and documents uploaded through the Media Library.

**Firebase Analytics** is also initialised for usage tracking in the browser.

---

## Screenshots

**Homepage — Hero Section**


<img width="962" height="448" alt="screenshoot-1" src="https://github.com/user-attachments/assets/4996166c-6ccb-4d51-aed0-7db53f635d56" />


**About — Leadership Team**


<img width="961" height="449" alt="screenshoot-2" src="https://github.com/user-attachments/assets/fba6dbe1-b3c7-4d03-b3d6-537ea1378ab8" />


**Contact — Services Dropdown & Contact Form**


<img width="963" height="441" alt="screenshoot-4" src="https://github.com/user-attachments/assets/a663680e-4292-4e7d-b164-6a24b527ad4f" />




**News & Updates — Category Filter**

<img width="814" height="435" alt="screenshoot-3" src="https://github.com/user-attachments/assets/e84ef26d-0a17-4c94-9ac5-436994b4c85e" />



---

## Live Project

[https://humsj.vercel.app/](https://humsj.vercel.app/)

---

## Repository

[https://github.com/Nure-Tem/HUMSJ](https://github.com/Nure-Tem/HUMSJ)

---

## Future Improvements

- Add email notifications for new form submissions and contact messages.
- Implement pagination for the news feed.
- Add a full news article detail page with a unique URL per post.
- Introduce a public donation tracking/receipt system.
- Add push notifications or a newsletter subscription feature.
- Expand Firebase Security Rules for tighter Firestore access control.
- Add unit and integration tests.

---

## License

This project is privately maintained by the HUMSJ External Affairs Sector. All rights reserved.

---

## Author

Developed and maintained by the **HUMSJ External Affairs Sector**, Haramaya University, Ethiopia.

Contact: [humsj.ea@gmail.com](mailto:humsj.ea@gmail.com)
