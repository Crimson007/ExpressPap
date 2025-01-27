Here’s a comprehensive README file based on the details you’ve provided: 

---

# **Express Pap!**

## **Project Overview**
Express Pap! is an IoT-Based Toll System designed to address congestion and delays on busy toll roads. By leveraging the ESP32-CAM to capture vehicle registration plates and integrating M-Pesa for instant toll payments via STK Push, this project ensures fast, efficient, and user-friendly toll collection. 

### **Target Audience**
- Expressway Users
- Investors
- Government Agencies
- Technology Enthusiasts

---

## **Features**
- **Vehicle Registration Scanning:** Captures vehicle details and user information using an ESP32-CAM.
- **Instant Payments:** M-Pesa STK Push simplifies toll payment for registered vehicles.
- **MongoDB Integration:** Keeps user and vehicle data securely stored in a cloud-hosted database.
- **Search Functionality:** Quickly search for vehicle and user details using the registration number and phone number.

---

## **Tech Stack**
### **Frontend**
- React
- Bootstrap
- Vite
- (Legacy: TailwindCSS)

### **Backend**
- Node.js
- Express.js
- MongoDB

---

## **Folder Structure**
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

## **Setup Instructions**

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

### **Installation**
1. Clone this repository:
   ```bash
   git clone <repository_url>
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

### **Running the Project**
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

## **Backend Details**
- **Database Schema:**
  - Transactions: Includes fields for transaction ID, vehicle registration, user ID, and payment status.
  - Vehicle Details: Includes registration number, user name, and contact details.
- **M-Pesa Integration:** The backend communicates with M-Pesa APIs to process toll payments and verify transactions.
- The backend can be tested independently using tools like Postman by sending requests to endpoints defined in `server.js`.

---

## **Usage Guide**
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

## **Common Issues & Troubleshooting**
- **Ngrok Configuration:**
  - Always start Ngrok after running the backend and ensure the correct callback URL is updated in the `.env` file.
- **Database Errors:**
  - Verify that the MongoDB connection string (`MONGO_URI`) is correct.
- **Frontend Not Loading:**
  - Check if `npm run dev` was executed in the correct directory (`express-pap`).

---

## **Contribution Guide**
We welcome contributions to improve this project. To contribute:
1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Submit a pull request.

---

## **License**
This project is part of a final-year group project and is not currently licensed for public use.

---

## **Additional Notes**
- Future improvements include adding APIs for IoT devices to enhance toll system functionality.
- For any questions or feedback, feel free to contact us via the **Contact** page in the project frontend.

---
