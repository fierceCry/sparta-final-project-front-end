// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

    if (token) {
      const newSocket = io(REACT_APP_API_URL, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ['websocket', 'polling'], // 웹소켓과 폴링 전송 방식 사용
        withCredentials: true, // 쿠키와 인증 정보 포함
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
