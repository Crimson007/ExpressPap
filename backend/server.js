import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import axios from 'axios';
import { Buffer } from 'buffer';
import dotenv from 'dotenv';
dotenv.config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// CORS Headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// MongoDB connection
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectToDatabase();

// Vehicle Schema
const vehicleSchema = new mongoose.Schema({
  licensePlate: String,
  ownerName: String,
  carType: String,
  brand: String,
  color: String,
  registrationDate: String,
  contact: Number,
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

// Transaction Schema
const transactionSchema = new mongoose.Schema({
  licensePlate: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 1
  },
  status: {
    type: String,
    enum: ['pending', 'success', 'failed'],
    default: 'pending'
  },
  mpesaReceiptNumber: String,
  checkoutRequestID: String,
  merchantRequestID: String,
  transactionDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// M-Pesa Token Handling
let mpesaAccessToken = null;
let tokenExpiryTime = null;

async function getMpesaAccessToken() {
  try {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');

    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      headers: { Authorization: `Basic ${auth}` }
    });

    mpesaAccessToken = response.data.access_token;
    tokenExpiryTime = Date.now() + 55 * 60 * 1000;
    console.log("Access token refreshed");
  } catch (error) {
    console.error("Error fetching access token:", error.message);
    throw error;
  }
}

// Schedule token refresh
setInterval(async () => {
  if (!mpesaAccessToken || Date.now() >= tokenExpiryTime) {
    await getMpesaAccessToken();
  }
}, 55 * 60 * 1000);

// Initial token fetch
getMpesaAccessToken();

async function initiateMpesaPayment(phone, amount = 1) {
  try {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-T:]/g, '');
    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const formattedPhone = phone.startsWith("0") ? `254${phone.slice(1)}` : phone;

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: formattedPhone,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'TollPayment',
        TransactionDesc: 'Toll Fee Payment'
      },
      {
        headers: { Authorization: `Bearer ${mpesaAccessToken}` }
      }
    );

    return response.data;
  } catch (error) {
    console.error("M-Pesa payment initiation error:", error.response?.data || error.message);
    throw error;
  }
}

// Routes
app.get('/', (req, res) => res.send("API is running..."));

app.post('/register', async (req, res) => {
  try {
    const vehicle = new Vehicle(req.body);
    await vehicle.save();
    res.status(201).send({ message: "✔️ Successful Registration" });
  } catch (error) {
    res.status(500).send({ message: "❌ Error registering vehicle!", error });
  }
});

app.post('/verify', async (req, res) => {
  try {
    const { licensePlate, phoneNumber } = req.body;
    const vehicle = await Vehicle.findOne({ licensePlate });

    if (!vehicle) {
      return res.status(404).send({ 
        registered: false, 
        message: "Vehicle not found. Please register first." 
      });
    }

    const paymentResponse = await initiateMpesaPayment(phoneNumber);
    console.log("Payment initiation response:", paymentResponse);

    if (paymentResponse.ResponseCode === "0") {
      const transaction = new Transaction({
        licensePlate,
        phoneNumber,
        amount: 1,
        status: 'pending',
        checkoutRequestID: paymentResponse.CheckoutRequestID,
        merchantRequestID: paymentResponse.MerchantRequestID
      });
      
      await transaction.save();
      console.log("Transaction created:", transaction);

      res.status(200).send({
        registered: true,
        message: "Payment initiated successfully",
        vehicle,
        transactionId: transaction._id
      });
    } else {
      res.status(400).send({
        registered: true,
        message: "Payment initiation failed",
        error: paymentResponse.ResponseDescription
      });
    }
  } catch (error) {
    console.error('Verify endpoint error:', error);
    res.status(500).send({ 
      message: "Error processing request", 
      error: error.message 
    });
  }
});

app.post('/mpesa/callback', async (req, res) => {
  try {
    console.log("M-Pesa callback received:", JSON.stringify(req.body, null, 2));
    
    const { Body } = req.body;
    const { stkCallback } = Body;
    
    const transaction = await Transaction.findOne({
      checkoutRequestID: stkCallback.CheckoutRequestID,
      status: 'pending'
    }).sort({ createdAt: -1 });

    if (!transaction) {
      console.log("Transaction not found for CheckoutRequestID:", stkCallback.CheckoutRequestID);
      return res.status(404).send({ message: "Transaction not found" });
    }

    if (stkCallback.ResultCode === 0) {
      const metadata = stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = metadata.find(item => item.Name === "MpesaReceiptNumber")?.Value;
      
      transaction.status = 'success';
      transaction.mpesaReceiptNumber = mpesaReceiptNumber;
    } else {
      transaction.status = 'failed';
    }

    await transaction.save();
    console.log(`Transaction ${transaction._id} updated:`, {
      status: transaction.status,
      mpesaReceiptNumber: transaction.mpesaReceiptNumber,
      updatedAt: transaction.updatedAt
    });

    res.status(200).send({
      status: "success",
      message: "Callback processed successfully"
    });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    res.status(500).send({ 
      status: "error", 
      message: error.message 
    });
  }
});

app.post('/test-callback/:transactionId', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.transactionId);
    if (!transaction) {
      return res.status(404).send({ message: "Transaction not found" });
    }

    transaction.status = 'success';
    transaction.mpesaReceiptNumber = 'TEST' + Date.now();
    await transaction.save();

    res.status(200).send({
      message: "Test callback processed successfully",
      transaction
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// In server.js
app.get('/transaction-status/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).send({ 
        status: 'error',
        message: "Transaction not found" 
      });
    }

    // Add timestamp for debugging
    console.log(`Status check for transaction ${req.params.id}:`, {
      status: transaction.status,
      checkoutRequestID: transaction.checkoutRequestID,
      updatedAt: transaction.updatedAt,
      timestamp: new Date()
    });

    res.status(200).send({
      status: transaction.status,
      transactionId: transaction._id,
      mpesaReceiptNumber: transaction.mpesaReceiptNumber,
      updatedAt: transaction.updatedAt
    });
  } catch (error) {
    console.error("Transaction status error:", error);
    res.status(500).send({ 
      status: 'error',
      message: "Error fetching transaction status", 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 