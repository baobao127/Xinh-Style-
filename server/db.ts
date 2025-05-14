import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // Thay đổi nếu sử dụng dịch vụ đám mây
const client = new MongoClient(uri);

export async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("xinhstyle"); // Tên cơ sở dữ liệu
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
}

export const db = client.db("xinhstyle");