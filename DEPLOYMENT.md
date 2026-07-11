# Vortex Terminal — Vercel Deployment Guide

This guide walks you through deploying both the **Express Backend** and **Vite Frontend** of the Vortex Investment Terminal to Vercel as two separate connected projects.

---

## 📋 Prerequisites

Before deploying, ensure you have:
1. Pushed the latest code to your GitHub repository: `https://github.com/Aditya-kumar2004/ai-investment-research-agent.git`.
2. A free [Vercel Account](https://vercel.com).
3. A MongoDB Connection URI (such as MongoDB Atlas).
4. A Groq API Key.
5. Gmail SMTP App Password (for the newsletter subscription service).

---

## 🚀 Step 1: Deploy the Backend on Vercel

1. Log in to your **Vercel Dashboard** and click **Add New > Project**.
2. Import your GitHub repository: `ai-investment-research-agent`.
3. In the project configuration:
   * **Project Name:** `vortex-investment-backend` (or similar)
   * **Framework Preset:** Choose **Other** (Vercel Node will automatically handle it via the `vercel.json` config).
   * **Root Directory:** Edit and select **`backend`**.
4. Expand **Environment Variables** and add the following keys:
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `MONGO_URI` | `mongodb+srv://...` | Your MongoDB connection string |
   | `GROQ_API_KEY` | `gsk_...` | Your Groq Cloud API Key |
   | `EMAIL_USER` | `adityakuma876@gmail.com` | Your Gmail address |
   | `EMAIL_PASS` | `hpforvhcsyeinylu` | Your Gmail SMTP App Password |
   | `EMAIL_HOST` | `smtp.gmail.com` | `smtp.gmail.com` |
   | `EMAIL_PORT` | `587` | `587` |
   | `NODE_ENV` | `production` | Set to `production` |
5. Click **Deploy**.
6. Once the deployment finishes, copy the generated **Production URL** (e.g. `https://vortex-investment-backend.vercel.app`).

---

## 🔗 Step 2: Configure Frontend Rewrite Proxy

To allow the frontend to communicate with the backend securely without any CORS or origin issues:

1. Open [frontend/vercel.json](file:///c:/Users/hp/Desktop/AIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII/frontend/vercel.json) in your code editor.
2. Replace the placeholder URL with your **actual backend URL** copied from Step 1:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://vortex-investment-backend.vercel.app/api/:path*"
       }
     ]
   }
   ```
3. Commit and push this change to your GitHub:
   ```bash
   git add frontend/vercel.json
   git commit -m "config: update backend production URL rewrite proxy"
   git push origin main
   ```

---

## 💻 Step 3: Deploy the Frontend on Vercel

1. Go back to your **Vercel Dashboard** and click **Add New > Project**.
2. Import the same GitHub repository: `ai-investment-research-agent`.
3. In the project configuration:
   * **Project Name:** `vortex-investment-terminal` (or similar)
   * **Framework Preset:** Choose **Vite** (Vercel will auto-detect Vite and set the build settings automatically).
   * **Root Directory:** Edit and select **`frontend`**.
4. Click **Deploy**.
5. Once complete, your terminal application will be live at the generated frontend URL!
