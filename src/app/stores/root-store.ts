import FilmsStore from "./films-store.ts";
import {createContext, useContext} from "react";

interface Store {
    filmsStore: FilmsStore,
}

export const store: Store = {
    filmsStore: new FilmsStore(),
}

const storeContext = createContext(store);

const useMobx = () => useContext(storeContext);

export default useMobx;