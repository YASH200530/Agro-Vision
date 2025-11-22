# AgroVision Backend

Minimal Express backend that connects to MongoDB and provides a `User` model.

Quick start (PowerShell):

```powershell
cd c:\Users\YASH\minor\AgroVision-Backend
npm install
copy .env.example .env
# Edit .env to set MONGO_URI if needed
npm run dev
```

Endpoints:
- `GET /` — health check
- `POST /api/users` — create a user (body: `name`, `email`, `password`, optional `phoneNumber`)

Notes:
- This project uses `mongoose` for MongoDB. Ensure MongoDB is running and `MONGO_URI` in `.env` points to it.
