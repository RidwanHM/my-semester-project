export const registerUser = async (userData) => {
   
    if (!userData.avatar) {
      delete userData.avatar;
    }
};