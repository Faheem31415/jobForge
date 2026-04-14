import app from "../backend/app.js";
import connectDB from "../backend/utils/db.js";

let connectionPromise;

export default async function handler(req, res) {
  if (!connectionPromise) {
    connectionPromise = connectDB();
  }

  await connectionPromise;
  return app(req, res);
}
