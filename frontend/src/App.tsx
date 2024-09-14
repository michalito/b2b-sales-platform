import React from 'react';
import Footer from './components/Footer';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './AuthContext';
import { MessageProvider } from './MessageContext';
import { CartProvider } from './CartContext';
import ErrorBoundary from './ErrorBoundary';
import ErrorDisplay from './MessageDisplay';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import EmailVerification from './components/EmailVerification';
import AdminApproval from './components/AdminApproval';
import AdminProductManagement from './components/AdminProductManagement';
import CartView from './components/CartView';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';


const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please refresh the page.</div>}>
      <MessageProvider>
        <AuthProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <Router>
                <ErrorDisplay />
                <Navigation />
                <div className="container mx-auto mt-8">
                  <Routes>
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegisterForm />} />
                    <Route path="/forgot-password" element={<PasswordResetRequest />} />
                    <Route path="/reset-password" element={<PasswordReset />} />
                    <Route path="/verify-email" element={<EmailVerification />} />
                    <Route 
                      path="/admin/approvals" 
                      element={
                        <AdminRoute>
                          <AdminApproval />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/admin/products" 
                      element={
                        <AdminRoute>
                          <AdminProductManagement />
                        </AdminRoute>
                      } 
                    />
                    <Route 
                      path="/" 
                      element={
                        <PrivateRoute>
                          <ProductList />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/cart" 
                      element={
                        <PrivateRoute>
                          <CartView />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/checkout" 
                      element={
                        <PrivateRoute>
                          <CheckoutPage />
                        </PrivateRoute>
                      } 
                    />
                    <Route 
                      path="/order-confirmation" 
                      element={
                        <PrivateRoute>
                          <OrderConfirmation />
                        </PrivateRoute>
                      } 
                    />
                  </Routes>
                </div>
                <Footer />
              </Router>
            </QueryClientProvider>
          </CartProvider>
        </AuthProvider>
      </MessageProvider>
    </ErrorBoundary>
  );
};

export default App;