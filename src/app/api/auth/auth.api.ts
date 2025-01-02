import {
  RefreshTokenRequest,
  RefreshTokenResponse,
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

  refreshToken: (refreshTokenRequest: RefreshTokenRequest) =>
    Agent.post<RefreshTokenResponse>(API_ROUTES.AUTH.REFRESH_TOKEN, refreshTokenRequest),

  logout: () => Agent.post(API_ROUTES.AUTH.LOGOUT, {}),

  delete: () => Agent.delete(API_ROUTES.AUTH.DELETE),
};

export default AuthApi;
