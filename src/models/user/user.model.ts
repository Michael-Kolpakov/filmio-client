export default interface User {
  fullName: string;
  login: string;
}

export interface UserRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface UserRegistrationResponse {
  user: User;
  accessToken: string;
}

export interface UserLoginRequest {
  login: string;
  password: string;
}

export interface UserLoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenRequest {
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
