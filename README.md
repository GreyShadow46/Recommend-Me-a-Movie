# 📽️ Recommend Me a Movie — Final Year Project

This project is a full‑stack movie recommendation website built as part of my final year project. It provides personalised movie suggestions, user accounts, and a clean interface for browsing recommendations. A short overview of the site is available on the homepage once the app is running.

The application is fully containerised and can be run using Docker.

---

## Features

- Movie recommendation engine  
- User authentication and sessions  
- MySQL database backend  
- Nginx reverse proxy  
- Fully Dockerised multi‑container stack  

---

## Requirements

Before running the project, ensure you have:

- **Docker** installed  
- **Git** to clone the repository  
- A valid `.env` file (see below)  

---

## Getting Started

### 1. Clone the repository

```
git clone https://github.com/GreyShadow46/Recommend-Me-a-Movie.git
cd recommend-me-a-movie
```

### 2. Configure environment variables

Copy the example file:

```
cp .env.example .env
```

Then open `.env` and fill in your own values:

- Database credentials  
- Session secret  
- Email credentials 
- Encryption key  

### 3. Start the application

Run the full stack using Docker Compose:

```
docker compose up -d
```

This will automatically start:

- MySQL database  
- Node.js application  
- Nginx reverse proxy  

Once everything is running, visit:

```
http://localhost
```

---

## Database Setup

The MySQL container automatically initializes using the `init.sql` file included in the project. No manual setup is required unless you want to customise the schema.

---

## Development Notes

- The Node.js app runs in production mode inside the container.  
- Static assets and logs are mounted as volumes for easier development.
- The project is designed to run as a **multi‑container stack**