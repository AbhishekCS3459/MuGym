
# 🎶 Gym Music Voting SAAS

**A SAAS platform that allows gym-goers to vote for their favorite songs, dynamically updating the playlist based on the real-time votes. Built using Next.js, Prisma ORM, and Postgres as the database.**

## 🚀 About the Project

This project is a Software as a Service (SAAS) that enhances the gym experience by letting gym members vote for the songs they want to hear. The playlist is dynamically updated based on these votes, ensuring that the gym’s music keeps everyone energized!

### 🎯 Key Features

- **Live Voting System**: Users can vote for songs in real-time via the platform.
- **Dynamic Playlist**: The playlist updates automatically based on current votes, ensuring the most popular songs are played.
- **Gym-Specific Playlists**: Each gym can customize its song list based on preferred genres or user input.
- **Mobile-Friendly**: The platform works across devices – smartphones, tablets, and desktops.
- **Secure Authentication**: User login and voting are secured with authentication mechanisms.
- **Admin Dashboard**: Manage gyms, users, and songs via an intuitive admin interface.

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js](https://nextjs.org/)** - React-based framework for building user interfaces
- **TypeScript** - Type-safe code for better maintainability and scaling

### Backend
- **Node.js** - Server-side JavaScript runtime environment
- **Prisma ORM** - Database ORM for connecting to Postgres and performing database operations
- **Postgres** - Relational database to store song data, user info, votes, and more
- **GraphQL (Optional)** - For efficient querying of data between frontend and backend

### DevOps
- **Docker** - Containerized deployment
- **CI/CD** - Automated testing and deployment using GitHub Actions

---

## 📂 Project Structure

```
.
├── prisma                # Prisma schema & migrations
├── src                   # Source code
│   ├── components        # React components
│   ├── pages             # Next.js pages
│   ├── api               # API routes for voting, playlists
│   ├── utils             # Utility functions
│   ├── styles            # Global CSS
│   └── prisma            # Prisma client and database interactions
├── public                # Static assets (images, etc.)
└── README.md             # Project readme
```

---

## ⚙️ Setup & Installation

### Prerequisites

- **Node.js** >= 14.x
- **Postgres** (Installed or use Docker for local development)
- **Prisma** (Install globally `npm install -g prisma`)

### Step-by-Step Guide

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/your-username/gym-music-voting-saas.git
   cd gym-music-voting-saas
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Set Up the Database:**

   - Create a `.env` file with your Postgres connection string:

     ```
     DATABASE_URL=postgresql://user:password@localhost:5432/yourdbname
     ```

   - Initialize the database:

     ```bash
     npx prisma migrate dev --name init
     ```

   - Generate Prisma client:

     ```bash
     npx prisma generate
     ```

4. **Start the Development Server:**

   ```bash
   npm run dev
   ```

   The app will run at `http://localhost:3000`.

---

## 🌱 Prisma Schema (Sample)

Here’s an example of what your `prisma/schema.prisma` might look like:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  votes     Vote[]
}

model Song {
  id        Int      @id @default(autoincrement())
  title     String
  artist    String
  votes     Vote[]
}

model Gym {
  id        Int      @id @default(autoincrement())
  name      String
  location  String
  songs     Song[]
}

model Vote {
  id        Int      @id @default(autoincrement())
  user      User     @relation(fields: [userId], references: [id])
  userId    Int
  song      Song     @relation(fields: [songId], references: [id])
  songId    Int
  createdAt DateTime @default(now())
}
```

---

## 🚀 Deployment

- **Docker**: You can deploy this project using Docker by following these steps:

  1. Create a `Dockerfile` and `docker-compose.yml` file.
  2. Build the Docker image:

     ```bash
     docker-compose up --build
     ```

- **Vercel**: If deploying on Vercel, simply link your repository and follow Vercel's setup process for **Next.js** apps.

---

## 🔐 Environment Variables

Make sure to create a `.env` file with the following environment variables:

- `DATABASE_URL`: The connection string for your Postgres database.
- `NEXTAUTH_SECRET`: A secret key for authentication (if using NextAuth for user authentication).
- `NEXT_PUBLIC_API_URL`: URL for API calls (for frontend to interact with backend).

---

## 🤝 Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Push the branch (`git push origin feature-branch`).
5. Create a pull request.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Vercel](https://vercel.com/)

