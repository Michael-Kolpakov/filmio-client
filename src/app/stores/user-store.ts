import { makeAutoObservable } from "mobx";
import User, { UserLoginRequest, UserRegistrationRequest } from "../../models/user/user.model";
import AuthApi from "../api/auth/auth.api";
import { jwtDecode, JwtPayload } from 'jwt-decode';

export default class UserStore {
  private accessTokenName: string = "accessToken";
  private userName: string = "user";

  constructor() {
    makeAutoObservable(this);
  }

  public setUser = (user: User) => {
    localStorage.setItem(this.userName, JSON.stringify(user));
  };

  public getUser = () => {
    const userJson = localStorage.getItem(this.userName);

    if (userJson !== null) {
      return JSON.parse(userJson);
    }
  };

  public clearUser = () => {
    localStorage.removeItem(this.userName);
  };

  public getAccessToken = () => {
    return localStorage.getItem(this.accessTokenName);
  };

  public setAccessToken = (accessToken: string) => {
    localStorage.setItem(this.accessTokenName, accessToken);
  };
  
  public isLoggedIn = () => {
    const token = this.getAccessToken();

    return !(!this.isAccessTokenHasValidSignature(token) || this.isAccessTokenExpired(token!));
  }

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

    return response;
  };

  public logout = async () => {
    this.clearAccessToken();
    this.clearUser();
  };

  public deleteAccount = async () => {
    await AuthApi.delete().then(() => {
      this.clearAccessToken();
      this.clearUser();
    });
  };

  private isAccessTokenHasValidSignature = (token: string | null) => {
    return !!token && !!this.getDecodedAccessToken(token);
  }

  private getDecodedAccessToken = (token: string) => {
    let decodedToken: JwtPayload | null = null;

    try {
      decodedToken = jwtDecode<JwtPayload>(token);
    } catch {
      return null;
    }

    return decodedToken;
  }

  private isAccessTokenExpired = (token: string) => {
    const decodedToken = this.getDecodedAccessToken(token);
    const expirationTime = ((decodedToken && decodedToken?.exp) || 0) * 1000;
    const actualTime = new Date().getTime();

    return expirationTime <= actualTime;
  }
}
