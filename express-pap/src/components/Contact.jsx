import React from 'react';

const Contact = () => (
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-center text-4xl font-bold mb-8 text-gray-800 dark:text-white">Contact Us</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[
        { name: 'Gideon Maina', email: 'maina.gideon@students.kyu.ac.ke', phone: '+254 712 345 678', image: '../hero-bg.png' },
        { name: 'Tonyblaire Odhiambo', email: 'maina.gideon@students.kyu.ac.ke', phone: '+254 723 456 789', image: '../hero-bg.png' },
        { name: 'Millicent Mbuka', email: 'maina.gideon@students.kyu.ac.ke', phone: '+254 734 567 890', image: '../hero-bg.png' },
      ].map((founder, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <img src={founder.image} alt={founder.name} className="w-full h-48 object-cover" />
          <div className="p-6 text-center">
            <h5 className="text-xl font-bold text-gray-800 dark:text-white">{founder.name}</h5>
            <p className="text-gray-700 dark:text-gray-300">Phone: {founder.phone}</p>
            <p className="text-gray-700 dark:text-gray-300">{founder.email}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Contact;