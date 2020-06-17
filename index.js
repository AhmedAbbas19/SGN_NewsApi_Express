const app = require("./app");
const { PORT } = require("./config");

require("./db/mongoose");

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
