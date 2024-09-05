import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../AuthContext';
import { useCart } from '../CartContext';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { UKFlag, GreeceFlag } from '../utils/Flags';
import useClickOutside from '../utils/useClickOutside';

const Navigation: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { cart } = useCart();
  const { t, i18n } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLLIElement>(null);

  useClickOutside(dropdownRef, () => {
    if (isLangDropdownOpen) setIsLangDropdownOpen(false);
  });

  const cartItemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangDropdownOpen(false);
  };

  const getCurrentLanguageFlag = () => {
    return i18n.language === 'el' ? <GreeceFlag /> : <UKFlag />;
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <ul className="flex justify-between items-center">
        <li>
          <Link to="/" className="text-xl font-bold">{t('nav.home')}</Link>
        </li>
        <div className="flex space-x-4 items-center">
          {isAuthenticated ? (
            <>
              <li>{t('nav.welcome')}, {user?.name}</li>
              {user?.role === 'ADMIN' && (
                <>
                  <li>
                    <Link to="/admin/approvals" className="hover:text-gray-300">Approvals</Link>
                  </li>
                  <li>
                    <Link to="/admin/products" className="hover:text-gray-300">Manage Products</Link>
                  </li>
                </>
              )}
              <li>
                <Link to="/cart" className="relative">
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              </li>
              <li>
                <button onClick={logout} className="hover:text-gray-300">{t('nav.logout')}</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">{t('nav.login')}</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">{t('nav.register')}</Link>
              </li>
            </>
          )}
          <li className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center space-x-1 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isLangDropdownOpen}
            >
              {getCurrentLanguageFlag()}
              <ChevronDown size={16} />
            </button>
            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                <button
                  onClick={() => changeLanguage('en')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <UKFlag className="mr-2" /> English
                </button>
                <button
                  onClick={() => changeLanguage('el')}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                >
                  <GreeceFlag className="mr-2" /> Ελληνικά
                </button>
              </div>
            )}
          </li>
        </div>
      </ul>
    </nav>
  );
};

export default Navigation;