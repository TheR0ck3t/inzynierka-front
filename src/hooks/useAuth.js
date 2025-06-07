import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    console.error('❌ useAuth must be used within AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;