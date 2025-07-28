import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "cards.json");

function readData() {
  const file = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(file);
}

function writeData(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

export default function handler(req, res) {
  let data = readData();

  if (req.method === "GET") {
    res.status(200).json(data.cards);
  }

  else if (req.method === "POST") {
    const newCard = { id: Date.now().toString(), ...req.body };
    data.cards.push(newCard);
    writeData(data);
    res.status(201).json(newCard);
  }

  else if (req.method === "PUT") {
    const { id, updatedCard } = req.body;
    const index = data.cards.findIndex(card => card.id === id);
    if (index === -1) return res.status(404).json({ error: "Card not found" });
    data.cards[index] = { ...data.cards[index], ...updatedCard };
    writeData(data);
    res.status(200).json(data.cards[index]);
  }

  else if (req.method === "DELETE") {
    const { id } = req.body;
    data.cards = data.cards.filter(card => card.id !== id);
    writeData(data);
    res.status(200).json({ message: "Card deleted" });
  }

  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
