import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "data", "data.json");

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
    res.status(200).json(data.users);
  }

  else if (req.method === "POST") {
    const newUser = { id: Date.now().toString(), ...req.body };
    data.users.push(newUser);
    writeData(data);
    res.status(201).json(newUser);
  }

  else if (req.method === "PUT") {
    const { id, updatedUser } = req.body;
    const index = data.users.findIndex(user => user.id === id);
    if (index === -1) return res.status(404).json({ error: "User not found" });
    data.users[index] = { ...data.users[index], ...updatedUser };
    writeData(data);
    res.status(200).json(data.users[index]);
  }

  else if (req.method === "DELETE") {
    const { id } = req.body;
    const filtered = data.users.filter(user => user.id !== id);
    if (filtered.length === data.users.length) {
      return res.status(404).json({ error: "User not found" });
    }
    data.users = filtered;
    writeData(data);
    res.status(200).json({ message: "User deleted" });
  }

  else {
    res.status(405).json({ error: "Method not allowed" });
  }
}