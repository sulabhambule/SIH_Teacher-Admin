
# Backend: Faculty Appraisal and Career Advancement Portal

## Overview
The backend of the Faculty Appraisal and Career Advancement Portal is built using the MERN stack (MongoDB, Express.js, Node.js). It handles API requests from the frontend to manage faculty profiles, feedback, and career advancement data.

## Tech Stack
- **Backend Framework**: Express.js (Node.js)
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Google Cloud Platform with NGINX

## Installation

### Prerequisites
- Node.js and npm installed.
- MongoDB set up locally or remotely.
- Create a `.env` file for configuration.

### Steps to Set Up
1. Clone the backend repository:
   ```bash
   git clone https://github.com/your-username/your-backend-repo.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-backend-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following variables:
     ```
     MONGO_URI=your-mongo-uri
     JWT_SECRET=your-secret
     PORT=5000
     ```
5. Run the backend application:
   ```bash
   npm start
   ```

## API Endpoints
- **POST /login**: Authenticates a user and returns a JWT.
- **GET /faculty**: Retrieves all faculty data.
- **POST /feedback**: Submits feedback from students.

## Deployment
The backend is deployed on Google Cloud and can be accessed at:
[https://facultyappraisal-backend.live/](https://facultyappraisal-backend.live/)

---

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.
