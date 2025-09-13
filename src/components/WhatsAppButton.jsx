import React from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = ({ phoneNumber }) => {
  const handleClick = () => {
    const message = encodeURIComponent('مرحباً، أود الاستفسار عن منتجاتكم.');
    window.open(`https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center z-50 animate-bounce"
      aria-label="تواصل معنا عبر واتساب"
    >
      <MessageCircle className="h-8 w-8" />
    </button>
  );
};

export default WhatsAppButton;


