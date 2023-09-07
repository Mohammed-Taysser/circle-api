import express from 'express';

const app = express();

const PORT = process.env.PORT ?? 8080;

// declare a route with a response
app.get('/', (_request, res) => {
  res.status(200).json({ msg: "What's up doc ?!" });
});

// start the server
app.listen(PORT, () => {
  console.log(`server running http://localhost:${PORT}`);
});
