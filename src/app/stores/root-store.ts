import FilmsStore from "./films-store.ts";
import { createContext, useContext } from "react";
import ModalStore from "./modal-store.ts";

interface Store {
  filmsStore: FilmsStore;
}

interface ModalDataStore {
  modalStore: ModalStore;
}

export const store: Store = {
  filmsStore: new FilmsStore(),
};

export const modalDataStore: ModalDataStore = {
  modalStore: new ModalStore(),
};

export const StoreContext = createContext(store);
const ModalContext = createContext(modalDataStore);

export const useModalContext = () => useContext(ModalContext);

const useMobx = () => useContext(StoreContext);

export default useMobx;
