import { server } from "./utils/socket.js";
import connectDB from "./utils/db.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at port ${PORT}`);
  });
});
