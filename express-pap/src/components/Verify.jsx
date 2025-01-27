import React, { useState, useEffect } from 'react';

const Verify = () => {
  const [licensePlate, setLicensePlate] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [vehicle, setVehicle] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [transactionStatus, setTransactionStatus] = useState(null);
  const [errors, setErrors] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [pollCount, setPollCount] = useState(0); // Add counter for polling attempts

  useEffect(() => {
    let pollInterval;

    const checkStatus = async () => {
      if (!transactionId) return;

      try {
        const response = await fetch(`http://localhost:5000/transaction-status/${transactionId}`);
        const data = await response.json();
        
        console.log('Transaction status check:', data); // Debug log

        if (data.status === 'success') {
          setTransactionStatus('success');
          setMessage(`✅ Payment successful! Receipt: ${data.mpesaReceiptNumber}`);
          clearInterval(pollInterval);
        } else if (data.status === 'failed') {
          setTransactionStatus('failed');
          setMessage("❌ Payment failed or was cancelled. Please try again.");
          clearInterval(pollInterval);
        } else if (data.status === 'pending') {
          setPollCount(prev => {
            // Stop polling after 60 seconds (12 attempts at 5-second intervals)
            if (prev >= 12) {
              clearInterval(pollInterval);
              setTransactionStatus('timeout');
              setMessage("Transaction timed out. Please try again or check your M-Pesa messages.");
              return prev;
            }
            return prev + 1;
          });
        }
      } catch (error) {
        console.error("Error checking status:", error);
        clearInterval(pollInterval);
        setTransactionStatus('error');
        setMessage("Error checking payment status. Please check your M-Pesa messages.");
      }
    };

    if (transactionId && transactionStatus === 'pending') {
      // Reset poll count when starting new transaction
      setPollCount(0);
      
      // Check immediately
      checkStatus();
      
      // Then start polling
      pollInterval = setInterval(checkStatus, 5000);
    }

    // Cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [transactionId, transactionStatus]);

  const validateFields = () => {
    const newErrors = {};
    if (!licensePlate.trim()) newErrors.licensePlate = "License plate cannot be blank.";
    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number cannot be blank.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerify = async () => {
    if (!validateFields()) return;

    setLoading(true);
    setMessage('');
    setVehicle(null);
    setTransactionStatus('pending');
    setTransactionId(null);

    try {
      const response = await fetch('http://localhost:5000/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ licensePlate, phoneNumber }),
      });
      const data = await response.json();
      
      if (response.ok && data.registered) {
        setVehicle(data.vehicle);
        setTransactionId(data.transactionId);
        setMessage("Please check your phone to complete the M-Pesa payment.");
      } else {
        setTransactionStatus(null);
        setMessage(data.message || "Vehicle not found. Please register.");
      }
    } catch (error) {
      console.error("Verify error:", error);
      setTransactionStatus('error');
      setMessage("Error verifying vehicle. Please try again.");
    }

    setLoading(false);
  };

  const getStatusClass = () => {
    switch (transactionStatus) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'failed':
        return 'bg-red-500 text-white';
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'timeout':
      case 'error':
        return 'bg-red-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const canStartNewTransaction = !loading && 
    transactionStatus !== 'pending' && 
    (!transactionId || ['success', 'failed', 'timeout', 'error'].includes(transactionStatus));

  return (
    <div className="container mx-auto my-4 p-4 bg-dark-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-2">Verify Vehicle</h2>
      <p className="text-light-200 mb-6">Verify your registration status for a smooth experience at toll points.</p>
      
      <div className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Enter License Plate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white placeholder-light-200 ${
              errors.licensePlate ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!canStartNewTransaction}
          />
          {errors.licensePlate && (
            <div className="text-red-500 text-sm mt-1">{errors.licensePlate}</div>
          )}
        </div>
        
        <div>
          <input
            type="text"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className={`w-full px-3 py-2 border rounded bg-transparent text-white placeholder-light-200 ${
              errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={!canStartNewTransaction}
          />
          {errors.phoneNumber && (
            <div className="text-red-500 text-sm mt-1">{errors.phoneNumber}</div>
          )}
        </div>

        <button 
          onClick={handleVerify} 
          disabled={!canStartNewTransaction}
          className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify'}
        </button>
      </div>

      {message && (
        <div className={`mt-4 p-3 rounded ${getStatusClass()}`}>
          {message}
          {transactionStatus === 'pending' && (
            <div className="inline-block ml-2 animate-spin">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {vehicle && (
        <div className="mt-4 p-4 bg-dark-100 rounded-lg border border-light-100/10">
          <h3 className="text-xl font-bold text-white mb-3">Vehicle Information</h3>
          <p className="text-light-200"><strong>Owner:</strong> {vehicle.ownerName}</p>
          <p className="text-light-200"><strong>Car Type:</strong> {vehicle.carType}</p>
          <p className="text-light-200"><strong>Brand:</strong> {vehicle.brand}</p>
          <p className="text-light-200"><strong>Color:</strong> {vehicle.color}</p>
          <p className="text-light-200"><strong>Registration Date:</strong> {vehicle.registrationDate}</p>
          <p className="text-light-200"><strong>Contact:</strong> {vehicle.contact}</p>
        </div>
      )}
    </div>
  );
};

export default Verify;