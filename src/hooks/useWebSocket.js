import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import logger from "../utils/logger";

const hookLogger = logger.createChildLogger('useWebSocket');

export default function useWebSocket(onMessage) {
    const socket = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Połącz z backend Socket.IO server przez Vite proxy
        socket.current = io({
            withCredentials: true,
            transports: ['websocket', 'polling']
        });

        socket.current.on('connect', () => {
            hookLogger.info('Connected to Socket.IO server');
            setConnected(true);
        });

        socket.current.on('disconnect', () => {
            hookLogger.warn('Disconnected from Socket.IO server');
            setConnected(false);
        });

        // Nasłuchuj na odpowiedzi o dodanych tagach
        socket.current.on('tagAddResponse', (data) => {
            hookLogger.debug('Received tag add response', data);
            if (onMessage) {
                onMessage(data);
            }
        });

        // Nasłuchuj na nowe karty z enrollment
        socket.current.on('cardEnrolled', (data) => {
            hookLogger.debug('Received card enrolled', data);
            if (onMessage) {
                onMessage(data);
            }
        });

        // Nasłuchuj na wszystkie broadcast messages
        socket.current.on('broadcast', (data) => {
            hookLogger.debug('Received broadcast', data);
            if (onMessage) {
                onMessage(data);
            }
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, [onMessage]);

    const sendMessage = (event, data) => {
        if (socket.current && connected) {
            socket.current.emit(event, data);
        }
    };

    const startEnrollment = (reader = 'mainEntrance') => {
        if (socket.current && connected) {
            socket.current.emit('startEnrollment', { deviceId: reader });
        }
    };

    return { 
        sendMessage, 
        startEnrollment,
        connected,
        socket: socket.current 
    };
}