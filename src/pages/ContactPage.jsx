import React from 'react';

const ContactPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">اتصل بنا</h1>
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="text-lg text-gray-700 mb-4">
          نحن هنا لمساعدتك! يمكنك التواصل معنا عبر الطرق التالية:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6">
          <li className="mb-2">البريد الإلكتروني: <a href="mailto:info@gnstore.com" className="text-blue-600 hover:underline">info@gnstore.com</a></li>
          <li className="mb-2">الهاتف: <a href="tel:+9647700000000" className="text-blue-600 hover:underline">+964 770 000 0000</a></li>
          <li className="mb-2">العنوان: بغداد، العراق</li>
        </ul>
        <p className="text-gray-700">
          ساعات العمل: الأحد - الخميس، 9:00 صباحًا - 5:00 مساءً.
        </p>
      </div>
    </div>
  );
};

export default ContactPage;


