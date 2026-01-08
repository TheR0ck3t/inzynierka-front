import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import logger from "../utils/logger";

const hookLogger = logger.createChildLogger('useWebSocket');

export default function useWebSocket(onMessage) {
    const socket = useRef(null);
    const [connected, setConnected] = useState(false);
    const onMessageRef = useRef(onMessage);

    // Aktualizuj ref gdy callback się zmieni (bez reconnect)
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    useEffect(() => {
        // Połącz z głównym namespace backend Socket.IO server przez Vite proxy
        // Ten hook jest używany głównie do enrollment i poleceń kontrolera
        socket.current = io({
            path: '/socket.io',
            transports: ['polling', 'websocket']
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
            if (onMessageRef.current) {
                onMessageRef.current(data);
            }
        });

        // Nasłuchuj na nowe karty z enrollment
        socket.current.on('cardEnrolled', (data) => {
            hookLogger.debug('Received card enrolled', data);
            if (onMessageRef.current) {
                onMessageRef.current(data);
            }
        });

        // Nasłuchuj na wszystkie broadcast messages
        socket.current.on('broadcast', (data) => {
            hookLogger.debug('Received broadcast', data);
            if (onMessageRef.current) {
                onMessageRef.current(data);
            }
        });

        // Nasłuchuj na aktualizacje listy czytników
        socket.current.on('readers_list', (data) => {
            hookLogger.debug('Received readers list update', data);
            if (onMessageRef.current) {
                onMessageRef.current({ type: 'readers_list', ...data });
            }
        });

        return () => {
            if (socket.current) {
                socket.current.disconnect();
            }
        };
    }, []); // Pusta tablica - połącz tylko raz!

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