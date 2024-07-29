import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
export const sendVerificationCode = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/email/verification`, {
      email,
    }, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data.message;
  } catch (error) {
    console.error(error);
    throw new Error("인증 코드 전송에 실패했습니다.");
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/local/sign-up`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.message;
  } catch (error) {
    console.error(error);
    if(error.response.data.message === '이메일이 이미 존재합니다.'){
      throw new Error('이미 가입된 이메일입니다.');
    }
  }
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  const regex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};

export const validateNickname = (nickname) => {
  return nickname.length >= 2 && nickname.length <= 20;
};
