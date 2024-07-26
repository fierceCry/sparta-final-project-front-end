export const signin = {
  handleNaverLogin: async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/naver`;
  },

  handleKakaoLogin: async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/kakao`;
  },

  handleGoogleLogin: async () => {
    window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
  }
};