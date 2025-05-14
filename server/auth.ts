import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key";

export function generateToken(userId: number): string {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "1h" });
}

export function verifyToken(token: string): number | null {
  try {
    const decoded = jwt.verify(token, SECRET_KEY) as { userId: number };
    return decoded.userId;
  } catch (err) {
    return null;
  }
}