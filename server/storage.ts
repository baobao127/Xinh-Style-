import { db } from "./db";
import { ObjectId } from "mongodb";

export class MongoStorage {
  private usersCollection = db.collection("users");

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(insertUser.password, 10);
    const newUser = {
      ...insertUser,
      password: hashedPassword,
      createdAt: new Date(),
      role: "user",
    };
    const result = await this.usersCollection.insertOne(newUser);
    return { ...newUser, id: result.insertedId.toString() };
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await this.usersCollection.findOne({ username });
    return user ? { ...user, id: user._id.toString() } : undefined;
  }
}