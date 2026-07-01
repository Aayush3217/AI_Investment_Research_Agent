<<<<<<< HEAD
# AI Investment Research Agent

## Overview

The AI Investment Research Agent is a full-stack web application that helps users analyze a company before making an investment decision. Instead of manually collecting information from different sources, users simply enter a company name, and the application generates a detailed investment report using an AI model.

The report includes an investment recommendation, confidence score, key strengths, potential risks, and the reasoning behind the decision. Users can also save and revisit their previous research reports after logging into the application.

---

# Features

* Secure user registration and login using JWT authentication
* AI-generated investment research reports
* Investment recommendation (Invest / Pass / Hold)
* Confidence score with detailed reasoning
* Research history for logged-in users
* Real-time report generation
* Responsive React-based user interface

---

# Tech Stack

### Frontend

* React.js
* React Router
* Axios

### Backend

* Node.js
* Express.js

### Database

* PostgreSQL

### AI

* LangChain
* Groq Llama 3.3 70B Model

### Authentication

* JWT (JSON Web Token)
* bcrypt.js

---

# Project Structure

```
AI Project

├── frontend
│   ├── src
│   ├── public
│   └── package.json
│
├── backend
│   ├── agent.js
│   ├── authRoutes.js
│   ├── researchRoutes.js
│   ├── authMiddleware.js
│   ├── db.js
│   ├── index.js
│   └── package.json
│
└── README.md
```

---

# How to Run

## 1. Clone the repository

```bash
git clone <repository-url>

cd AI_Investment_Research_Agent
```

---

## 2. Backend Setup

```bash
cd backend

npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000

DATABASE_URL=your_postgresql_database_url

JWT_SECRET=your_secret_key

GROQ_API_KEY=your_groq_api_key
```

Start the backend server.

```bash
npm start
```

---

## 3. Frontend Setup

Open another terminal.

```bash
cd frontend

npm install

npm start
```

The application will open at:

```
http://localhost:3000
```

---

# How It Works

1. The user logs into the application.
2. The user enters the name of a company.
3. The frontend sends the request to the backend.
4. The backend invokes the LangChain agent.
5. The agent uses the Groq Llama model to analyze the company.
6. The generated report includes:

   * Investment recommendation
   * Confidence score
   * Key strengths
   * Risks
   * Overall analysis
7. The report is saved in PostgreSQL so that the user can access it later.

---

# Architecture

```
                React Frontend
                       │
                 Axios Requests
                       │
               Express Backend
                       │
      ┌────────────────┼────────────────┐
      │                │                │
 Authentication   Research API     PostgreSQL
      │                │                │
      │          LangChain Agent        │
      │                │                │
      └──────────── Groq LLM ───────────┘
                       │
             Investment Recommendation
```

# Key Decisions & Trade-offs

### Why React?

React provides a clean component-based architecture and makes it easy to build an interactive user interface.

### Why Express?

Express is lightweight, simple to configure, and works well for creating REST APIs.

### Why PostgreSQL?

PostgreSQL offers reliable storage for user accounts and research history while allowing the project to scale in the future.

### Why LangChain?

LangChain simplifies working with Large Language Models by providing a structured way to build AI workflows.

### Why Groq?

The Groq API offers very fast inference with the Llama 3.3 model, making report generation quick and responsive.

### Trade-offs

Due to the limited development time, a few features were intentionally left out:

* Live stock price charts
* News sentiment analysis
* Portfolio management
* PDF report export
* Unit and integration testing
* Docker deployment

---

# Example Runs

## Example 1

**Company:** Microsoft

**Recommendation:** Invest

**Confidence:** 92%

**Reason**

Microsoft has strong financial performance, a leading cloud platform, and significant investments in artificial intelligence. Its consistent growth and healthy cash flow make it a strong long-term investment.

---

## Example 2

**Company:** Tesla

**Recommendation:** Hold

**Confidence:** 76%

**Reason**

Tesla continues to lead the electric vehicle market, but increasing competition and valuation concerns create additional investment risk.

---

## Example 3

**Company:** NVIDIA

**Recommendation:** Invest

**Confidence:** 95%

**Reason**

NVIDIA continues to dominate the AI hardware market with exceptional revenue growth and strong future demand for its products.

---

# Future Improvements

If given more time, I would like to improve the project by adding:

* Live financial data from stock market APIs
* Company news and sentiment analysis
* Interactive stock charts
* Portfolio tracking
* PDF report download
* Multi-agent workflow using LangGraph
* Docker support
* CI/CD pipeline
* Automated testing
* Better error handling and logging

---

# AI Usage

AI was used throughout the development process to assist with project planning, debugging, prompt engineering, and improving the overall implementation. The application itself uses LangChain with the Groq Llama model to generate investment research reports.

---

# LLM Chat Transcript (Bonus)

During development, I used an LLM to discuss implementation ideas, debug issues, improve prompts, and refine the project architecture. These conversations helped speed up development while ensuring I understood every part of the codebase. The exported chat history can be included separately as part of the submission.

---

# Author

**Aayush Pal**

B.Tech Student

Full Stack Developer
=======
# AI_Investment_Research_Agent
>>>>>>> 165a6217c8d73947dfd3d930253112d716ccf83c
