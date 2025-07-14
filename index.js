const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          { role: "system", content: "אתה עוזר שירות לקוחות של חברה ישראלית." },
          { role: "user", content: message }
        ],
        temperature: 0.7
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply = response.data.choices[0].message.content;
    res.json({ reply });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "שגיאה מהשרת" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("שרת רץ על פורט " + PORT);
});
