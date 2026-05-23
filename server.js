const express = require("express");
const cors = require("cors");

const app = express();

// allow frontend to talk to backend
app.use(cors());
app.use(express.json());

let balance = 100;

// health check route
app.get("/", (req, res) => {
  res.send("Casino backend is running");
});

// balance
app.get("/balance", (req, res) => {
  res.json({ balance });
});

// simple dice bet
app.post("/bet", (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.json({ error: "Invalid bet" });
  }

  if (amount > balance) {
    return res.json({ error: "Not enough balance" });
  }

  balance -= amount;

  const roll = Math.random() * 100;
  const win = roll < 50;

  if (win) {
    const payout = amount * 2;
    balance += payout;

    return res.json({
      roll,
      win: true,
      payout,
      balance
    });
  }

  res.json({
    roll,
    win: false,
    balance
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
