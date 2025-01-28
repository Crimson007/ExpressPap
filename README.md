# **🚀 Express Pap!**

## 📑 **Table of Contents**
1. [🌍 Project Overview](#-project-overview)  
2. [✨ Features](#-features)  
3. [🛠️ Tech Stack](#️-tech-stack)  
4. [📂 Folder Structure](#-folder-structure)  
5. [⚙️ Setup Instructions](#️-setup-instructions)  
    - [Prerequisites](#prerequisites)  
    - [Installation](#installation)  
    - [Running the Project](#running-the-project)  
6. [🌐 Deployment](#-deployment)  
    - [Deploying on Vercel](#deploying-on-vercel)  
    - [Deploying on Render](#deploying-on-render)  
7. [🛡️ Backend Details](#️-backend-details)  
8. [🧑‍💻 Usage Guide](#-usage-guide)  
9. [⚠️ Common Issues & Troubleshooting](#️-common-issues--troubleshooting)  
10. [🤝 Contribution Guide](#-contribution-guide)  
11. [📜 License](#-license)  
12. [🌟 Additional Notes](#-additional-notes)  

---



## **🌍 Project Overview**
Express Pap! is an IoT-Based Toll System designed to address congestion and delays on busy toll roads. By leveraging the ESP32-CAM to capture vehicle registration plates and integrating M-Pesa for instant toll payments via STK Push, this project ensures fast, efficient, and user-friendly toll collection. 

### **Target Audience**
- 🎯 Target Audience
- 🛣️ Expressway Users
- 💼 Investors
- 🏛️ Government Agencies
- 💻 Technology Enthusiasts

---

## **✨ Features**
- **📸 Vehicle Registration Scanning:** Captures vehicle details and user information using an ESP32-CAM.
- **💳 Instant Payments:** M-Pesa STK Push simplifies toll payment for registered vehicles.
- **🗂️ MongoDB Integration:** Keeps user and vehicle data securely stored in a cloud-hosted database.
- **🔍 Search Functionality:** Quickly search for vehicle and user details using the registration number and phone number.

---

## 🛠️ **Tech Stack**

### **Frontend**
React <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="React" width="50">
Bootstrap<img src="https://upload.wikimedia.org/wikipedia/commons/b/b2/Bootstrap_logo.svg" alt="Bootstrap" width="50">
  Vite<img src="https://vitejs.dev/logo.svg" alt="Vite" width="50">
  TailwindCSS<img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" alt="TailwindCSS" width="50">
</p>

### **Backend**
Node.js  <img src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Node.js" width="50">
 Express.js <img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express.js" width="50">
 MongoDB <img src="https://upload.wikimedia.org/wikipedia/en/4/45/MongoDB-Logo.svg" alt="MongoDB" width="50">

### **💵 Payment Integration**

  Mpesa <img src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Mpesa_logo.png" alt="M-Pesa" width="50">

---

## **📂Folder Structure**
```
EXPRESSPAP/
├── backend/
│   ├── node_modules/
│   ├── .env
│   ├── app.js
│   ├── server.js
│   ├── package-lock.json
│   └── package.json
├── express-pap/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Contact.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Verify.jsx
│   │   │   ├── App.jsx
│   │   │   ├── App.css
│   │   │   └── index.css
│   ├── index.html
│   ├── main.jsx
│   ├── vite.config.js
│   └── package.json
├── .gitignore
└── README.md
```

---

## **⚙️ Setup Instructions**

### **Prerequisites**
1. Install the latest version of **Node.js**.
2. Set up a cloud-hosted **MongoDB database**.
3. Obtain M-Pesa API credentials and configure the following environment variables in the `.env` file:

   ```
   # MongoDB URL
   MONGO_URI=<Your MongoDB connection string>

   # M-Pesa API
   MPESA_CONSUMER_KEY=<Your Consumer Key>
   MPESA_CONSUMER_SECRET=<Your Consumer Secret>
   MPESA_SHORTCODE=<Your Shortcode>
   MPESA_PASSKEY=<Your Passkey>
   MPESA_CALLBACK_URL=<Your Ngrok HTTPS URL>/mpesa/callback
   ```

---

### **💽Installation**
1. Clone this repository:
   ```bash
   git clone https://github.com/Crimson007/ExpressPap.git
   ```
2. Navigate to the project directory:
   ```bash
   cd EXPRESSPAP
   ```
3. Install dependencies for both the backend and frontend:
   ```bash
   cd backend
   npm install
   cd ../express-pap
   npm install
   ```

### **🏃🏽‍♂️Running the Project**
1. Start the backend:
   ```bash
   cd backend
   node server.js
   ```
2. Expose your local server using Ngrok:
   ```bash
   ngrok http http://localhost:5000
   ```
   Copy the generated HTTPS link and update the `.env` file:
   ```
   MPESA_CALLBACK_URL=https://<ngrok-generated-url>/mpesa/callback
   ```
3. Start the frontend:
   ```bash
   cd express-pap
   npm run dev
   ```

4. Open your browser and navigate to the provided frontend development server link.

---
## **🌐 Deployment**

### **Deploying on Vercel**
1. **Setup:**
   - Ensure your frontend is in a separate folder (e.g., `express-pap`).
   - Push your project to a GitHub repository.

2. **Deploy:**
   - Visit [Vercel](https://vercel.com/) and sign in with your GitHub account.
   - Click **New Project** and import your repository.
   - Select the frontend directory (e.g., `express-pap`) as the root of the project.
   - Vercel automatically detects Vite as the framework and configures the deployment.

3. **Environment Variables:**
   - Add any environment variables (e.g., API base URLs) by navigating to the **Settings > Environment Variables** section in your Vercel dashboard.

4. **Build and Deployment:**
   - Click **Deploy** to start the build process. Once completed, your site will be live on a Vercel-provided domain (e.g., `https://express-pap.vercel.app`).

### **Deploying on Render**
1. **Setup:**
   - Ensure both your frontend and backend are pushed to a GitHub repository.

2. **Deploy Backend:**
   - Go to [Render](https://render.com/) and log in.
   - Click **New > Web Service** and link your GitHub repository.
   - Select the backend directory (e.g., `backend`) and configure:
     - **Environment:** Node.js
     - **Build Command:** `npm install`
     - **Start Command:** `node server.js`
   - Add necessary environment variables (e.g., `MONGO_URI`, `MPESA_*`) under the **Environment** section.

3. **Deploy Frontend:**
   - Follow similar steps as above, but select the frontend directory (e.g., `express-pap`).
   - Set the **Build Command** to `npm run build` and the **Publish Directory** to `dist`.

4. **Connect Frontend to Backend:**
   - Update the frontend `.env` file or API configuration to point to the deployed backend URL.

5. **Finalize Deployment:**
   - Once both services are deployed, you can access the frontend via the Render-provided domain.

---

## **🛡️Backend Details**
- **Database Schema:**
  - Transactions: Includes fields for transaction ID, vehicle registration, user ID, and payment status.
  - Vehicle Details: Includes registration number, user name, and contact details.
- **M-Pesa Integration:** The backend communicates with M-Pesa APIs to process toll payments and verify transactions.
- The backend can be tested independently using tools like Postman by sending requests to endpoints defined in `server.js`.

---

## **🧑‍💻Usage Guide**
Here’s how to use the system:
1. **Register a Vehicle:**
   - Input the vehicle registration number and user details via the frontend.
2. **Automatic Toll Detection:**
   - When a vehicle passes through, the ESP32-CAM captures the registration number.
3. **Payment Process:**
   - If registered, the system initiates an M-Pesa STK Push to the user's phone.
   - Upon successful payment, the barrier is opened.
4. **Search Vehicle Details:**
   - Use the frontend interface to search for any vehicle’s registration details.

---

## **⚠️ Common Issues & Troubleshooting**
- **Ngrok Configuration:**
  - Always start Ngrok after running the backend and ensure the correct callback URL is updated in the `.env` file.
- **Database Errors:**
  - Verify that the MongoDB connection string (`MONGO_URI`) is correct.
- **Frontend Not Loading:**
  - Check if `npm run dev` was executed in the correct directory (`express-pap`).

---


## **📜 License**
This project is part of a final-year group project and is not currently licensed for public use.

---

## **🌟 Additional Notes**
- Future improvements include adding APIs for IoT devices to enhance toll system functionality.
- For any questions or feedback, feel free to contact us via the **Contact** page in the project frontend.

---
