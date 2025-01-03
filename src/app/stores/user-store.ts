import { makeAutoObservable } from "mobx";
import User, { UserLoginRequest, UserRegistrationRequest } from "../../models/user/user.model";
import AuthApi from "../api/auth/auth.api";

export default class UserStore {
  private accessTokenName: string = "accessToken";
  private userName: string = "user";
  private isUserLoggedInName: string = "isUserLoggedIn";

  constructor() {
    makeAutoObservable(this);
  }

  public getUser = () => {
    const userJson = localStorage.getItem(this.userName);

    if (userJson !== null) {
      return JSON.parse(userJson);
    }
  };

  public setUser = (user: User) => {
    localStorage.setItem(this.userName, JSON.stringify(user));
  };

  public clearUser = () => {
    localStorage.removeItem(this.userName);
  };

  public getIsUserLoggedIn = () => {
    const isUserLoggedIn = localStorage.getItem(this.isUserLoggedInName);

    if (isUserLoggedIn !== null) {
      return JSON.parse(isUserLoggedIn);
    }
  };

  public setIsUserLoggedIn = (isUserLoggedIn: boolean) => {
    localStorage.setItem(this.isUserLoggedInName, JSON.stringify(isUserLoggedIn));
  };

  public clearIsUserLoggedIn = () => {
    localStorage.removeItem(this.isUserLoggedInName);
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
    this.setUser(response.user);
    this.setIsUserLoggedIn(true);

    return response;
  };

  public login = async (email: string, password: string) => {
    const userLoginRequest: UserLoginRequest = {
      email: email,
      password: password,
    };

    const response = await AuthApi.login(userLoginRequest);
    this.setAccessToken(response.accessToken);
    this.setUser(response.user);
    this.setIsUserLoggedIn(true);

    return response;
  };

  public logout = async () => {
    this.clearAccessToken();
    this.clearUser();
    this.clearIsUserLoggedIn();
  };

  public deleteAccount = async () => {
    await AuthApi.delete().then(() => {
      this.clearAccessToken();
      this.clearUser();
      this.clearIsUserLoggedIn();
    });
  };
}
