import { Entity } from "redis-om";

export type SafeUser = Pick<User, keyof { email: string; username: string }>;
export const getSafeUser = (user: any) => {
  const safeUser: any = { ...user.entityData };

  delete safeUser.password;

  return safeUser as any;
};

export class User extends Entity {
  username: string;
  email: string;
  password: string;
}
