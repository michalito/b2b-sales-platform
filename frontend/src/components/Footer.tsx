import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <img src="../../public/logo/logo-w.svg" alt="Company Logo" className="h-12 w-auto mb-2" />
            <p className="text-sm">{t('footer.companyDescription')}</p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-gray-300">{t('nav.home')}</Link></li>
              <li>
              <a href="https://fitnessproduction.gr" className="hover:text-gray-300" rel="noopener noreferrer" target="_blank">
                {t('footer.retail')}
              </a>
              </li>
              {/* <li><Link to="/products" className="hover:text-gray-300">{t('footer.products')}</Link></li>
              <li><Link to="/about" className="hover:text-gray-300">{t('footer.about')}</Link></li>
              <li><Link to="/contact" className="hover:text-gray-300">{t('footer.contact')}</Link></li> */}
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <h3 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h3>
            {/* <p className="mb-2">{t('footer.address')}</p> */}
            <p className="mb-2">{t('footer.phone')}: +30 210 9849 869</p>
            <p>{t('footer.email')}: info@fitnessproduction.gr</p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p>&copy; {new Date().getFullYear()} Fitness Production {t('footer.allRightsReserved')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;