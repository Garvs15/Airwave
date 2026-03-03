import { CHANGE_PASSWORD, LOGIN, SEND_OTP, SIGN_UP, UPDATE_USER, USER, VALIDATE_EMAIL, VERIFY_OTP } from "../api";
import { authHttp } from "../authHttp";


class user {
  signUp(data: object){
    return authHttp.post(SIGN_UP, data);
  }
  login(data: object){
    return authHttp.post(LOGIN, data);
  }
  sendOtp(data: object){
    return authHttp.post(SEND_OTP, data);
  }
  verifyOtp(data: object){
    return authHttp.post(VERIFY_OTP, data);
  }
  getUser(token:string){
    return authHttp.get(USER, undefined, 'application/json', token)
  }
  updateUser(payload: object){
    return authHttp.patch(UPDATE_USER, payload)
  }
  validateEmail(payload: object) {
    return authHttp.post(VALIDATE_EMAIL, payload)
  }
  changePassword(payload: object) {
    return authHttp.post(CHANGE_PASSWORD, payload)
  }
}

const userInstance = new user();
export default userInstance;