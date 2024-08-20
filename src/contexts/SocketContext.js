// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom'; // react-router-dom v6 사용 시
import { refreshAccessToken } from '../services/auth.service'; // auth.js에서 함수 가져오기

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate(); // navigate hook 사용

  useEffect(() => {
    const connectSocket = async () => {
      let token = localStorage.getItem("accessToken");

      if (!token) {
        token = await refreshAccessToken(navigate);
        if (!token) return;
      }

      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: `Bearer ${token}`,
        },
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      newSocket.on("connect_error", async (err) => {
        if (err.message === "Unauthorized") {
          token = await refreshAccessToken(navigate);
          if (token) {
            newSocket.auth.token = `Bearer ${token}`;
            newSocket.connect();
          }
        }
      });

      setSocket(newSocket);

      const handleBeforeUnload = () => {
        newSocket.disconnect();
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        newSocket.disconnect();
      };
    };

    connectSocket();
  }, [navigate]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
