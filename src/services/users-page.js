export const users = {
  handlePasswordChange: async () => {
    try {
      console.log("비밀번호 변경 시도");
    } catch (error) {
      console.error("비밀번호 변경 중 오류 발생:", error);
    }
  },

  handlePersonalInfoChange: async () => {
    try {
      console.log("개인정보 변경 시도");
    } catch (error) {
      console.error("개인정보 변경 중 오류 발생:", error);
    }
  },

  handleLogout: async () => {
    try {
      console.log("로그아웃 시도");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  },
};
