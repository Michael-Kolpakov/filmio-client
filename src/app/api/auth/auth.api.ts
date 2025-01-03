import {
  UserLoginRequest,
  UserLoginResponse,
  UserRegistrationRequest,
  UserRegistrationResponse,
} from "../../../models/user/user.model";
import { API_ROUTES } from "../../common/constants/api-routes.constants";
import Agent from "../agent.api";

const AuthApi = {
  registration: (userRegistrationRequest: UserRegistrationRequest) =>
    Agent.post<UserRegistrationResponse>(API_ROUTES.AUTH.REGISTRATION, userRegistrationRequest),

  login: (userLoginRequest: UserLoginRequest) => Agent.post<UserLoginResponse>(API_ROUTES.AUTH.LOGIN, userLoginRequest),

  delete: () => Agent.delete(API_ROUTES.AUTH.DELETE),
};

export default AuthApi;
