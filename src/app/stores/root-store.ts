import FilmsStore from "./films-store.ts";
import { createContext, useContext } from "react";
import ModalStore from "./modal-store.ts";
import UserStore from "./user-store.ts";
import CommonStore from "./common-store.ts";

interface Store {
  filmsStore: FilmsStore;
  usersStore: UserStore;
  modalsStore: ModalStore;
  commonStore: CommonStore;
}

export const store: Store = {
  filmsStore: new FilmsStore(),
  usersStore: new UserStore(),
  modalsStore: new ModalStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

const useMobx = () => useContext(StoreContext);

export default useMobx;
