import { compareSync } from "bcrypt";
import { NextApiRequest } from "next";
import { Client, HashData, Repository, Schema } from "redis-om";
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
  },
  { dataStructure: "JSON" }
);

export const createUser = async (data: any) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = rep.createEntity(data);

  await client.close();

  return await rep.save(user);
};

export const getUser = async (id: string) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = rep.fetch(id);

  await client.close();
  return user;
};

export const getUserLogin = async (req: NextApiRequest) => {
  await connect();

  const rep = new Repository(userSchema, client);
  const user = await rep
    .search()
    .where("email")
    .equals(req.body.email)
    .return.returnFirst();

  if (!compareSync(req.body.password, user.password)) {
    return null;
  }

  await client.close();

  return user;
};
