import {
  Dispatch,
  ReactNode,
  createContext,
  useContext,
  useReducer,
} from "react";

export type User = {
  name: string;
  email: string;
  password: string;
  avatar: string;
};

const emptyUser: User = {
  name: "",
  email: "",
  password: "",
  avatar: "",
};

type State = {
  user: User;
  isAuthenticated: boolean;
};

type Action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: User | any; // your action payload type here
};

type ProviderType = {
  children: ReactNode;
};
const initialState = {
  user: emptyUser,
  isAuthenticated: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: emptyUser, isAuthenticated: false };

    default:
      throw new Error("Unknown Action");
  }
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

// It is really important the create a context type
type AuthContextType = {
  user: User;
  isAuthenticated: boolean;
  dispatch: Dispatch<Action>;
  login: (email: string, password: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: ProviderType) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email: string, password: string) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      dispatch({ type: "login", payload: FAKE_USER as User });
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, dispatch, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw Error("AuthContext was used outside AuthProvider");

  return context;
}
