const app = require("./app");

app.get("/", (req, res) => {
  res.send("Hello, Express !");
  res.status(200).json({
    status: "success",
    message: "Welcome to express!",
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
