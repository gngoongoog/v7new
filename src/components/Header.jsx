import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, Smartphone, Zap, Cable, Shield, Headphones, Home, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useApp } from '../context/AppContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  
  const { 
    categories, 
    cart, 
    getCartItemsCount, 
    setSearchQuery, 
    setCurrentCategory 
  } = useApp();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentCategory(null);
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleCategoryClick = (category) => {
    setCurrentCategory(category);
    setSearchQuery('');
    setSearchInput('');
    navigate('/');
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    setCurrentCategory(null);
    setSearchQuery("");
    setSearchInput("");
    navigate("/");
    setIsMenuOpen(false);
  };

  // أيقونات الأقسام
  const categoryIcons = {
    'سماعات': Headphones,
    'شاحنات': Zap,
    'كيبلات': Cable,
    'لزكات شاشة': Shield,
    'اكسسوارات': Smartphone
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* الصف العلوي */}
        <div className="flex items-center justify-between py-4">
          {/* الشعار */}
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 space-x-reverse"
          >
            <Smartphone className="h-8 w-8 text-black" />
            <div className="text-right">
              <h1 className="text-xl font-bold text-black">Gn store</h1>
              <p className="text-xs text-gray-600">جودة عالية وأسعار منافسة</p>
            </div>
          </Link>

          {/* شريط البحث - مخفي على الشاشات الصغيرة */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="ابحث عن المنتجات..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 pr-4 text-right"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>

          {/* أيقونات التنقل */}
          <div className="flex items-center space-x-4 space-x-reverse">
            {/* سلة التسوق */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-6 w-6" />
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Button>
            </Link>

            {/* زر القائمة للشاشات الصغيرة */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" dir="rtl" className="w-[250px] sm:w-[300px] bg-white p-6 shadow-xl animate-slide-in-left rounded-r-lg">
                <nav className="flex flex-col gap-4 pt-8">
                  <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Home className="h-5 w-5" />
                    الرئيسية
                  </Link>
                  {categories.map((category) => {
                    const IconComponent = categoryIcons[category] || Smartphone;
                    return (
                      <Link
                        key={category}
                        to="/"
                        onClick={() => handleCategoryClick(category)}
                        className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                      >
                        <IconComponent className="h-5 w-5" />
                        {category}
                      </Link>
                    );
                  })}
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                    <Phone className="h-5 w-5" />
                    اتصل بنا
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* شريط البحث للشاشات الصغيرة */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="ابحث عن المنتجات..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10 pr-4 text-right"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </form>


      </div>
    </header>
  );
};

export default Header;

