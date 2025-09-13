import React, { createContext, useContext, useReducer, useEffect } from 'react';
import googleSheetsService from '../services/googleSheetsService';
import cartService from '../services/cartService';

// إنشاء Context
const AppContext = createContext();

// الحالة الأولية
const initialState = {
  products: [],
  categories: [],
  cart: [],
  loading: false,
  error: null,
  currentCategory: null,
  searchQuery: "",
  filters: {
    category: "",
    minPrice: "",
    maxPrice: "",
    inStock: false
  },
  sortBy: "name",
  productsPerPage: 60,
  currentPage: 1
};

// Reducer لإدارة الحالة
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload, loading: false, error: null };
    
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    
    case 'SET_CART':
      return { ...state, cart: action.payload };
    
    case 'SET_CURRENT_CATEGORY':
      return { ...state, currentCategory: action.payload };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload };
    
    case 'ADD_TO_CART':
      const updatedCart = cartService.addToCart(action.payload.product, action.payload.quantity);
      return { ...state, cart: updatedCart };
    
    case 'REMOVE_FROM_CART':
      const cartAfterRemove = cartService.removeFromCart(action.payload);
      return { ...state, cart: cartAfterRemove };
    
    case 'UPDATE_CART_QUANTITY':
      const cartAfterUpdate = cartService.updateQuantity(action.payload.productId, action.payload.quantity);
      return { ...state, cart: cartAfterUpdate };
    
    case 'CLEAR_CART':
      const clearedCart = cartService.clearCart();
      return { ...state, cart: clearedCart };
    
    default:
      return state;
  }
};

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // تحميل البيانات الأولية
  useEffect(() => {
    loadInitialData();
    loadCart();
  }, []);

  // تحميل البيانات من Google Sheets
  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const products = await googleSheetsService.fetchProducts();
      const categories = await googleSheetsService.getCategories();
      
      dispatch({ type: 'SET_PRODUCTS', payload: products });
      dispatch({ type: 'SET_CATEGORIES', payload: categories });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'خطأ في تحميل البيانات' });
      console.error('خطأ في تحميل البيانات:', error);
    }
  };

  // تحميل السلة
  const loadCart = () => {
    const cart = cartService.getCart();
    dispatch({ type: 'SET_CART', payload: cart });
  };

  // إضافة منتج للسلة
  const addToCart = (product, quantity = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, quantity } });
  };

  // إزالة منتج من السلة
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // تحديث كمية منتج في السلة
  const updateCartQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity } });
  };

  // مسح السلة
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // تحديد القسم الحالي
  const setCurrentCategory = (category) => {
    dispatch({ type: 'SET_CURRENT_CATEGORY', payload: category });
  };

  // تحديد استعلام البحث
  const setSearchQuery = (query) => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
  };

  const setCurrentPage = (page) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: 'SET_SORT_BY', payload: sortBy });
  };

  // الحصول على المنتجات المفلترة
  const getFilteredProducts = () => {
    let filtered = state.products;

    // فلترة حسب القسم (من الفلاتر أو من الفئة الحالية)
    if (state.filters.category) {
      filtered = filtered.filter(product => product.category === state.filters.category);
    } else if (state.currentCategory) {
      filtered = filtered.filter(product => product.category === state.currentCategory);
    }

    // فلترة حسب البحث
    if (state.searchQuery) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // فلترة حسب نطاق السعر
    if (state.filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(state.filters.minPrice));
    }
    if (state.filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(state.filters.maxPrice));
    }

    // فلترة حسب التوفر
    if (state.filters.inStock) {
      filtered = filtered.filter(product => product.inStock);
    }

    // الفرز
    switch (state.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // افتراض أن المنتجات لديها خاصية `dateAdded` أو `id` يمكن استخدامها للفرز
        // حاليًا، سنستخدم الـ ID كبديل إذا لم تكن هناك خاصية تاريخ
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'popular':
        // يتطلب منطقًا لتحديد الشعبية (مثل عدد المبيعات أو المشاهدات)
        // حاليًا، لا يوجد بيانات للشعبية، لذا يمكن تركها كما هي أو تطبيق فرز افتراضي
        break;
      default:
        break;
    }

    return filtered;
  };

  // الحصول على المنتجات للصفحة الحالية
  const getProductsForCurrentPage = (products) => {
    const indexOfLastProduct = state.currentPage * state.productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - state.productsPerPage;
    return products.slice(indexOfFirstProduct, indexOfLastProduct);
  };

  // الحصول على المنتجات المميزة
  const getFeaturedProducts = () => {
    return state.products.filter(product => product.featured);
  };

  // الحصول على منتج بالمعرف
  const getProductById = (id) => {
    return state.products.find(product => product.id === parseInt(id));
  };

  // الحصول على عدد العناصر في السلة
  const getCartItemsCount = () => {
    return cartService.getCartItemsCount();
  };

  // الحصول على إجمالي السلة
  const getCartTotal = () => {
    return cartService.getCartTotal();
  };

  // إرسال الطلب عبر WhatsApp
  const sendOrderToWhatsApp = () => {
    cartService.sendOrderToWhatsApp();
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    return cartService.formatPrice(price);
  };

  // إعادة تحميل البيانات
  const refreshData = () => {
    googleSheetsService.clearCache();
    loadInitialData();
  };

  // القيم المتاحة في Context
  const value = {
    // الحالة
    ...state,
    
    // الوظائف
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    setCurrentCategory,
    setSearchQuery,
    getFilteredProducts,
    getFeaturedProducts,
    getProductById,
    getCartItemsCount,
    getCartTotal,
    sendOrderToWhatsApp,
    formatPrice,
    refreshData,
    loadInitialData,
    setCurrentPage,
    getProductsForCurrentPage
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook لاستخدام Context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;

