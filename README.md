<div align="center">
  <br />
  <a href="https://github.com/your-org/acm-website">
    <img src="https://raw.githubusercontent.com/Bersinberz/acm-website/main/client/src/assets/acm-logo.png" alt="ACM SIGAI Logo" width="140" height="140">
  </a>

  <br />
  <img src="https://readme-typing-svg.herokuapp.com?font=Space+Grotesk&weight=600&size=36&pause=1000&color=007BFF&center=true&vCenter=true&width=800&lines=Welcome+to+ACM+SIGAI+Portal;Empowering+AI+Enthusiasts;Seamless+Event+Management;Dynamic+Recruitment+Platform" alt="Typing SVG" />

  <p align="center">
    <strong>A modernized, full-stack event and member management platform built with React, Node.js, and Docker.</strong>
  </p>

  <p align="center">
    <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node JS" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express JS" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://www.docker.com/"><img src="https://img.shields.io/badge/Docker-2CA5E0?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  </p>
</div>

<br />

> **Note:** Important environments and API keys have been containerized using Docker to ensure seamless scaling and cross-platform reliability.

---

## ✨ Features

- **🌐 Dynamic Public Portal:** Showcase upcoming events, a dedicated blog section, rich archives, and a history timeline ("Our Roots") of ACM SIGAI. Fluidly animated using `framer-motion` and `react-vanilla-tilt`.
- **🛡️ Secure Admin Dashboard:** Robust authentication using JWT tokens and secure cookie-based session management. Ensuring only authorized personnel have access to the internals of the platform.
- **📅 Comprehensive Event Management:** Create, read, update, and delete events. Displayed elegantly to standard members while giving administrators full granular control.
- **💼 Recruitment Engine:** Conduct, configure, and manage whole recruitment campaigns. View, filter, and approve candidate applications dynamically.
- **👥 Member Analytics & Directory:** Keep track of registered members, and visually analyze demographics and adoption metrics with **Recharts**.
- **💬 Live Query Resolution:** Public visitors can leave messages which admins can natively read, filter, and respond to directly from the internal suite.
- **🖼️ Automated Asset Management:** Real-time optimization and resizing via `Sharp`, subsequently shipped off natively to Cloudinary for robust artifact rendering.
- **📧 Built-In Mailer & Passports:** Need to let an applicant know their status? NodeMailer integrates inherently with templates. The system natively generates **QR Codes** for event entrances and attendance tracking.
- **🐳 Multi-Stage Docker Build:** A pristine local development file alongside a hardened, optimized production setup.

<br />

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework:** React 19 + TypeScript + Vite
- **Styling & Icons:** Vanilla CSS, Bootstrap 5, Bootstrap Icons, React Icons
- **Animations:** Framer Motion, React Vanilla Tilt
- **Visualization:** Recharts
- **Image Editing:** React Easy Crop 

### Backend Architecture
- **Runtime:** Node.js + Express 5
- **Language:** TypeScript
- **Database:** MongoDB (via Mongoose 9)
- **Security:** Helmet, CORS, Express-Rate-Limit
- **Authentication:** JSON Web Tokens (JWT)
- **Asset Processing:** Multer, Cloudinary, Streamifier, Sharp
- **Utilities:** Nodemailer (SMTP), QRCode generator, UUID

<br />

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- Docker & Docker Compose *(optional, but recommended)*
- MongoDB instance *(local or Atlas cluster)*
- Cloudinary Account
- SMTP Email Credentials

### Option 1: Running with Docker (Recommended)

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/acm-website.git
   cd acm-website
   ```

2. Configure environment credentials:
   - Duplicate the sample `.env` files internally *(or define them manually if they do not yet exist)* for `./server/.env.development` and `./client/.env.development`.

3. Spin up the cluster:
   ```bash
   # Execute the development composition
   docker-compose -f docker-compose.dev.yml up --build
   
   # For production builds
   docker-compose up --build
   ```

### Option 2: Local Manual Setup

1. **Install Submodule Dependencies:**
   ```bash
   # Setup backend server framework
   cd server
   npm install
   
   # Setup frontend client framework
   cd ../client
   npm install
   ```

2. **Boot the APIs and Client:**
   Open two separate windows/tabs in your terminal:
   
   **Terminal 1 (Server):**
   ```bash
   cd server
   npm run dev
   ```
   **Terminal 2 (Client):**
   ```bash
   cd client
   npm run dev
   ```

<br />

## 📂 System Architecture Breakdown

```text
acm-website/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Admin/      # Protected Administrative Subsystem
│   │   │   └── website/    # Public Facing VDOM
│   │   ├── components/     # Reusable UI Atoms
│   │   ├── services/       # Axios API & Network Controllers
│   │   ├── utils/          # Frontend Helpers & State Types
│   │   └── assets/         # Static global resources (.svg, .png)
│   ├── Dockerfile          # Production Web Server Layer
│   └── package.json
├── server/                 # Express REST API (NodeJS)
│   ├── src/
│   │   ├── controllers/    # Primary logic handling pipelines
│   │   ├── models/         # MongoDB Mongoose schemas maps
│   │   ├── routes/         # Express endpoint distribution
│   │   ├── middleware/     # Auth/Token guards & Validations
│   │   └── utils/          # Nodemailer, Cloudinary, QR Gen
│   ├── Dockerfile          # Production NodeJS Engine
│   └── package.json
├── docker-compose.yml      # Standardized Production Array
└── docker-compose.dev.yml  # Live-Reload Development Array
```

<br />

## 🔧 Scripts & Maintenance

- `npm run dev`: Bootstraps the local vite and nodemon configurations for rapid iteration.
- `npm run build`: Safely runs Typescript compilation checks, executing bundled output ready for caching.
- `npm run lint`: Validates the styling & rulesets across the platform.

<br />

<p align="center">
  Built with ❤️ by the ACM SIGAI Team.
</p>
