/**
 * Frontend Logger - prosty logger wzorowany na winston backend
 */

const isDevelopment = import.meta.env.NODE_ENV === 'development';

// Formatowanie wiadomości podobne do winston
const formatMessage = (level, service, message) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const serviceTag = service ? `[${service}]` : '';
    return `${timestamp} [${level}] ${serviceTag}: ${message}`;
};

// Główny logger
const logger = {
    info: (message, extra = null) => {
        if (isDevelopment) {
            console.log(formatMessage('INFO', 'frontend', message), extra || '');
        }
    },
    
    error: (message, extra = null) => {
        console.error(formatMessage('ERROR', 'frontend', message), extra || '');
    },
    
    warn: (message, extra = null) => {
        console.warn(formatMessage('WARN', 'frontend', message), extra || '');
    },
    
    debug: (message, extra = null) => {
        if (isDevelopment) {
            console.debug(formatMessage('DEBUG', 'frontend', message), extra || '');
        }
    },

    // Tworzenie child logger dla komponentów (jak winston)
    createChildLogger: (componentName) => {
        return {
            info: (message, extra = null) => {
                if (isDevelopment) {
                    console.log(formatMessage('INFO', `frontend:${componentName}`, message), extra || '');
                }
            },
            error: (message, extra = null) => {
                console.error(formatMessage('ERROR', `frontend:${componentName}`, message), extra || '');
            },
            warn: (message, extra = null) => {
                console.warn(formatMessage('WARN', `frontend:${componentName}`, message), extra || '');
            },
            debug: (message, extra = null) => {
                if (isDevelopment) {
                    console.debug(formatMessage('DEBUG', `frontend:${componentName}`, message), extra || '');
                }
            }
        };
    }
};

export default logger;
