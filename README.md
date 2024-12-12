
# Faculty Appraisal and Career Advancement Portal

## Overview
This is a MERN stack-based web application designed to simplify faculty appraisal and career advancement processes. The portal includes three distinct portals:
1. **Admin Portal**: For managing faculty profiles and appraisals.
2. **Faculty Portal**: For viewing feedback and appraisal details.
3. **Student Portal**: For submitting anonymous feedback.

The project is deployed on Google Cloud using NGINX.

---

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features
- Centralized faculty appraisal management.
- Simplified feedback collection from students.
- Analytics and reporting for career advancement.
- User-friendly interface for all stakeholders.

---

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Deployment**: Google Cloud Platform (GCP) with NGINX

---

## Installation

### Prerequisites
1. Node.js and npm installed.
2. MongoDB set up locally or on the cloud.
3. Google Cloud project configured (optional for local setup).

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo.git
   ```
2. Navigate to the project directory:
   ```bash
   cd your-repo
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the following:
     ```
     MONGO_URI=your-mongo-uri
     PORT=5000
     JWT_SECRET=your-secret
     ```
5. Run the application:
   ```bash
   npm start
   ```

---

## Usage

### Login Credentials

| **Role**    | **Username**               | **Password** |
|-------------|----------------------------|--------------|
| **Admin**   | `admin@gmail.com`           | `admin`      |
| **Faculty** | `akhiljaiby@gmail.com`      | `1234`       |
| **Student** | `himanshu@gmail.com`        | `1234`       |

### Steps to Use
1. Visit the deployed URL: [https://facultyappraisal.live/](https://facultyappraisal.live/)
2. Login using the credentials above.
3. Explore the respective portals:
   - **Admin**: Manage profiles, appraisals, and reports.
   - **Faculty**: View performance and feedback.
   - **Student**: Submit feedback anonymously.

---

## Deployment
The project is deployed on **Google Cloud Platform (GCP)** and can be accessed at:  
[https://facultyappraisal.live/](https://facultyappraisal.live/)

---

## Contributing
Contributions are welcome! Follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

---

## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
