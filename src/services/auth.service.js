import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const refreshAccessToken = async (navigate) => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    navigate("/sign-in");
    return null;
  }

  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/jwt-reissue`, {},{
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    const newAccessToken = response.data.accessToken;
    localStorage.setItem('accessToken', newAccessToken);
    return newAccessToken;
  } catch (error) {
    navigate("/sign-in");
    return null;
  }
};
