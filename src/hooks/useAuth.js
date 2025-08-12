import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';
import logger from '../utils/logger';

const hookLogger = logger.createChildLogger('useAuth');

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    hookLogger.error('useAuth must be used within AuthProvider');
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;