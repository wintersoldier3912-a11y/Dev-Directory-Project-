# DevDirectory (Round 2)

A production-ready Full-Stack Developer Directory with Authentication, Protected Routes, and Persistence.

## Features
- **Authentication**: JWT-based Signup and Login.
- **Protected Routes**: Only authenticated users can access the directory.
- **Persistent Storage**: Uses a JSON file-based database (Server-side) for data persistence across restarts.
- **Advanced Filtering**: Filter by Role, Tech Stack, and Search by Name.
- **Sorting & Pagination**: Sort developers by experience or date; browse with page controls.
- **Detailed Profiles**: dedicated profile pages with deep linking.
- **Responsive Design**: Mobile-first UI with Tailwind CSS.

## Tech Stack
- **Frontend**: React 18, React Router v6, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Native Crypto (for hashing/JWT), File System (DB)
- **Icons**: Lucide React

## Setup & Run

### 1. Start the Backend
The backend runs on port 3001.

```bash
cd server
npm install express cors uuid
# Install dev types
npm install --save-dev @types/express @types/cors @types/uuid ts-node typescript

# Run the server
npx ts-node index.ts
```

### 2. Start the Frontend
The frontend runs on port 3000.

```bash
npm install
npm run start
```

## Demo Credentials
To login immediately without signing up:
- **Email**: `admin@talrn.com`
- **Password**: `password123`

## Architecture
- **Auth**: The `AuthContext` manages the JWT token in `localStorage`. The `api.ts` service intercepts requests to add the `Authorization: Bearer <token>` header.
- **Persistence**: The server uses a `FileDB` class to write to `server/db.json`. This simulates a real NoSQL database but requires no external setup.
- **Routing**: `react-router-dom` handles client-side routing. `PrivateRoute` ensures unauthenticated users are redirected to Login.

## Deployment
1. **Frontend**: Build (`npm run build`) and deploy to Vercel/Netlify.
2. **Backend**: Deploy `server/` to Render/Railway.
   - *Note*: On ephemeral file systems (like Vercel Functions), data in `db.json` may not persist. For production, switch the `FileDB` class to connect to MongoDB Atlas.

## Contact
- **Email**: intern@talrn.com
- **Availability**: Immediate