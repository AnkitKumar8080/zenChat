import app from "./app";
import { port } from "./config";

app.listen(port, () => {
  console.log("⚙️  server running on port " + port);
});
