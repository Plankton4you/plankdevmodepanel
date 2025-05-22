import { useState, useEffect, useRef, useCallback } from 'react';

type WebSocketStatus = 'connecting' | 'open' | 'closing' | 'closed' | 'error';

interface UseWebSocketProps {
  url: string;
  onOpen?: (event: WebSocketEventMap['open']) => void;
  onMessage?: (event: WebSocketEventMap['message']) => void;
  onClose?: (event: WebSocketEventMap['close']) => void;
  onError?: (event: WebSocketEventMap['error']) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useWebSocket({
  url,
  onOpen,
  onMessage,
  onClose,
  onError,
  reconnectInterval = 5000,
  reconnectAttempts = 5
}: UseWebSocketProps) {
  const [status, setStatus] = useState<WebSocketStatus>('connecting');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  
  const connect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) return;
    
    setStatus('connecting');
    const websocket = new WebSocket(url);
    
    websocket.onopen = (event) => {
      setStatus('open');
      reconnectCount.current = 0;
      if (onOpen) onOpen(event);
    };
    
    websocket.onmessage = (event) => {
      setLastMessage(event.data as string);
      if (onMessage) onMessage(event);
    };
    
    websocket.onclose = (event) => {
      setStatus('closed');
      if (onClose) onClose(event);
      
      // Attempt to reconnect if not intentionally closed
      if (reconnectCount.current < reconnectAttempts) {
        setTimeout(() => {
          reconnectCount.current += 1;
          connect();
        }, reconnectInterval);
      }
    };
    
    websocket.onerror = (event) => {
      setStatus('error');
      if (onError) onError(event);
    };
    
    ws.current = websocket;
  }, [url, onOpen, onMessage, onClose, onError, reconnectInterval, reconnectAttempts]);
  
  const disconnect = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setStatus('closing');
      ws.current.close();
    }
  }, []);
  
  const send = useCallback((data: string | ArrayBufferLike | Blob | ArrayBufferView) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(data);
      return true;
    }
    return false;
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    status,
    lastMessage,
    send,
    disconnect,
    reconnect: connect
  };
}
