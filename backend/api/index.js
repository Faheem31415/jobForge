import app from "../app.js";
import connectDB from "../utils/db.js";

let connectionPromise;

export default async function handler(req, res) {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  await connectionPromise;
  return app(req, res);
}
