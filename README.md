# DevDirectory

A Full-Stack Developer Directory App that allows adding, viewing, searching, and filtering developer profiles.

## Tech Stack
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express
- **Icons:** Lucide React
- **Persistence:** In-memory array (Mock Database for demo purposes)

## Project Structure
- `/` - React Frontend Application
- `/server` - Express Backend Application

## Setup & Run Instructions

### 1. Start the Backend
The backend runs on port 3001.

```bash
# Navigate to project root (or server folder if extracted)
cd server
npm install express cors uuid
# Install types for development (optional but recommended)
npm install --save-dev @types/express @types/cors @types/uuid ts-node typescript

# Run the server
npx ts-node index.ts
```

### 2. Start the Frontend
The frontend runs on port 3000 (or similar).

```bash
# Navigate to project root
npm install
npm run start
```

## Environment Variables
Create a `.env` file in the root if you wish to change ports (optional).
- `PORT`: Backend port (default: 3001)

## Deployment Guide
1. **Frontend:** Build using `npm run build`. Upload the `dist/` or `build/` folder to Vercel/Netlify.
2. **Backend:** Deploy the `server/` directory to Render, Heroku, or a Vercel Serverless Function.
3. Update `services/api.ts` with the production Backend URL.

## Contact
- **Repo:** [Your GitHub Link]
- **Hosted App:** [Your Hosted Link]
- **Name:** [Your Name]
- **Availability:** Immediate

