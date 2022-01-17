import { Client, Repository, Schema } from "redis-om";
import { User } from "../entities/user";

const client = new Client();

async function connect() {
  if (!client.isOpen()) {
    await client.open(process.env.REDIS_URL);
  }
}

const userSchema = new Schema(
  User,
  {
    email: { type: "string" },
    password: { type: "string" },
    username: { type: "string" },
    nickname: { type: "string" },
  },
  { dataStructure: "JSON" }
);

export const createUser = async (data: any) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = rep.createEntity({ ...data, nickname: data.username });

  const id = await rep.save(user);

  await client.close();

  return id;
};

export const getUser = async (id: string) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = rep.fetch(id);

  await client.close();
  return user;
};

export const getUserWithEmailOrUsername = async (emailOrUsername: string) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = await rep
    .search()
    .where(emailOrUsername.includes("@") ? "email" : "username")
    .equals(emailOrUsername)
    .return.returnFirst();

  await client.close();

  return user;
};
export const changeUserNickname = async (
  userId: string,
  newNickname: string
) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = await rep.fetch(userId);

  user.nickname = newNickname;

  return await rep.save(user);
};
