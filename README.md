VideoHub is a simple video uploading and streaming platform built using Next.js. This project was created as a hands-on learning experience to understand core concepts of Next.js, including routing, API routes, server-side rendering, and file handling.VideoHub is a simple video uploading and streaming platform built using Next.js. This project was created as a hands-on learning experience to understand core concepts of Next.js, including routing, API routes, server-side rendering, and file handling.# 📹 VideoHub – Video Uploading Platform

VideoHub is a full-stack video uploading and streaming platform built using **Next.js**. It allows users to register, upload videos, and view them in a modern, responsive interface.

This project was developed as a learning initiative to dive deeper into **Next.js App Router**, **authentication**, **file handling with ImageKit**, and **MongoDB** database integration.

---

## 🔍 Features

- ✅ User Authentication with **NextAuth**
- ☁️ Video upload and CDN delivery using **ImageKit**
- 📁 Video metadata storage with **MongoDB**
- 🔒 Protected routes for authenticated users
- 🎞️ Stream videos directly in the browser
- 🧭 Fully responsive UI
- ⚙️ Next.js App Router and Server Components

---

## 🛠️ Tech Stack

| Category        | Tech                                   |
|----------------|----------------------------------------|
| Frontend       | Next.js (App Router), React, Tailwind CSS |
| Authentication | NextAuth (Credentials or OAuth)        |
| Media Hosting  | ImageKit.io                            |
| Database       | MongoDB (via Mongoose)                 |
| Deployment     | Vercel / Render / Your choice          |

---

## 📦 Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/videohub.git
cd videohub
npm install


##  🙄 In .env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id


## 😌 Run For localy start 

```bash
npm run dev



👍