import { makeAutoObservable } from "mobx";
import User, { RefreshTokenRequest, UserLoginRequest, UserRegistrationRequest } from "../../models/user/user.model";
import AuthApi from "../api/auth/auth.api";

export default class UserStore {
  private user = {} as User;
  private isAuth = false;
  private accessTokenName: string = "accessToken";

  constructor() {
    makeAutoObservable(this);
  }

  public setAuth = (isAuth: boolean) => {
    this.isAuth = isAuth;
  };

  public getAuth = () => {
    return this.isAuth;
  };

  public setUser = (user: User) => {
    this.user = user;
  };

  public getUser = () => {
    return this.user;
  };

  public getAccessToken = () => {
    return localStorage.getItem(this.accessTokenName);
  };

  public setAccessToken = (accessToken: string) => {
    localStorage.setItem(this.accessTokenName, accessToken);
  };

  public clearAccessToken = () => {
    localStorage.removeItem(this.accessTokenName);
  };

  public registration = async (fullName: string, email: string, password: string) => {
    const userRegistrationRequest: UserRegistrationRequest = {
      fullName: fullName,
      email: email,
      password: password,
    };

    const response = await AuthApi.registration(userRegistrationRequest);
    this.setAccessToken(response.accessToken);
    this.setAuth(true);
    this.setUser(response.user);

    return response;
  };

  public login = async (email: string, password: string) => {
    const userLoginRequest: UserLoginRequest = {
      login: email,
      password: password,
    };

    const response = await AuthApi.login(userLoginRequest);
    this.setAccessToken(response.accessToken);
    this.setAuth(true);
    this.setUser(response.user);

    return response;
  };

  public logout = async () => {
    await AuthApi.logout();
    this.clearAccessToken();
    this.setAuth(false);
    this.setUser({} as User);
  };

  public deleteAccount = async () => {
    await AuthApi.delete();
    this.clearAccessToken();
    this.setAuth(false);
    this.setUser({} as User);
  };

  public refreshToken = async () => {
    const accessToken = this.getAccessToken();

    if (!accessToken) {
      return;
    }

    const refreshTokenRequest: RefreshTokenRequest = {
      accessToken: accessToken,
    };

    const response = await AuthApi.refreshToken(refreshTokenRequest);
    this.setAccessToken(response.accessToken);
    this.setAuth(true);

    return response;
  };
}
