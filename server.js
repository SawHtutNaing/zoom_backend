const app = require("./src/app");


const PORT = process.env.PORT || 5000;

const HOST = "localhost"; // Bind to all network interfaces
// const HOST = "192.168.1.24"; // Bind to all network interfaces


app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});
