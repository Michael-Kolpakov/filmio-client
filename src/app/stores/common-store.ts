import { makeAutoObservable } from "mobx";
import { ServerError } from "../../models/errors/server-error.model";

export default class CommonStore {
  private error: ServerError | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  public setServerError = (error: ServerError) => {
    this.error = error;
  };

  public getServerError = () => {
    return this.error;
  };
}
