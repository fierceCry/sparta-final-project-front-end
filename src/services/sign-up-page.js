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
    throw new Error("인증 코드 전송에 실패했습니다.");
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/sign-up`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.message;
  } catch (error) {
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

export const startTimer = (isModalOpen, timer, setTimer, setIsModalOpen) => {
  if (isModalOpen && timer > 0) {
    return setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
  } else if (timer === 0) {
    alert("인증 코드가 만료되었습니다.");
    setIsModalOpen(false);
    setTimer(300);
  }
};

export const handleVerificationCode = async (email, validateEmail, sendVerificationCode, setIsModalOpen, setTimer) => {
  if (!validateEmail(email)) {
    alert("유효한 이메일 주소를 입력하세요.");
    return;
  }

  try {
    const message = await sendVerificationCode(email);
    alert(message);
    setIsModalOpen(true);
    setTimer(300);
  } catch (error) {
    alert(error.message);
  }
};

export const handleModalSubmit = (verificationCode, setSavedVerificationCode, setIsModalOpen) => {
  const code = verificationCode.join("");
  setSavedVerificationCode(code);
  console.log("입력한 인증 코드:", code);
  setIsModalOpen(false);
};

export const handleSignup = async (userData, signupUser, navigate) => {
  try {
    await signupUser(userData);
    alert('회원가입이 완료되었습니다.');
    navigate("/sign-in");
  } catch (error) {
    alert(error.message);
  }
};

export const handleCodeChange = (index, value, verificationCode, setVerificationCode) => {
  const newCode = [...verificationCode];
  newCode[index] = value;
  setVerificationCode(newCode);

  if (value && index < verificationCode.length - 1) {
    document.getElementById(`code-input-${index + 1}`).focus();
  }

  if (!value && index > 0) {
    document.getElementById(`code-input-${index - 1}`).focus();
  }
};
