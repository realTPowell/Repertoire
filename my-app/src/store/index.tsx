import { createContext, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import createAgent from "./createAgent.ts";
import createAuth from "./createAuth.js";



const StoreContext = createContext();

export function Provider(props) {
  let currentUser;

  let [state, setState] = createStore({
    // get currentUser() {
    //   return currentUser();
    // },
    // token: localStorage.getItem("jwt"),
    appName: "repertoire"
  })

  let actions = {}
  let store = [state, actions];
  let agent = createAgent(store);

  // currentUser = createAuth(agent, actions, setState);


  return (
      <StoreContext.Provider value={store}>
        {props.children}
      </StoreContext.Provider>
  );
}

export function useStore() {
  console.log("Using store")
  return useContext(StoreContext);
}