import { createContext, Dispatch, SetStateAction } from "react";
import { SafeUser } from "./entities/user";

export const userContext =
  createContext<{
    user: SafeUser;
    setUser: Dispatch<SetStateAction<SafeUser>>;
  }>(undefined);
