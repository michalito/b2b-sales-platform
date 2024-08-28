import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorProvider } from './ErrorContext';
import ErrorBoundary from './ErrorBoundary';
import ErrorDisplay from './ErrorDisplay';
import Navigation from './components/Navigation';
import ProductList from './components/ProductList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import PasswordResetRequest from './components/PasswordResetRequest';
import PasswordReset from './components/PasswordReset';
import EmailVerification from './components/EmailVerification';
import AdminApproval from './components/AdminApproval';

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
      <ErrorProvider>
        <AuthProvider>
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
                    path="/" 
                    element={
                      <PrivateRoute>
                        <ProductList />
                      </PrivateRoute>
                    } 
                  />
                </Routes>
              </div>
            </Router>
          </QueryClientProvider>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
};

export default App;