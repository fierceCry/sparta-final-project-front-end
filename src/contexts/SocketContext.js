import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate, useLocation } from 'react-router-dom';
import { refreshAccessToken } from '../services/auth.service';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const connectSocket = async () => {
      // 로그인 및 회원가입 페이지에서는 소켓 연결을 시도하지 않음
      if (location.pathname === '/sign-in' || location.pathname === '/sign-up') {
        return;
      }

      let token = localStorage.getItem("accessToken");

      if (!token) {
        token = await refreshAccessToken(navigate);
        if (!token) {
          navigate('/sign-in');
          return;
        }
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
          } else {
            navigate('/sign-in');
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
  }, [navigate, location]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
