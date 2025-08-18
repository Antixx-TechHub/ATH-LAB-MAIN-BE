const prisma = require('../../lib/prisma');

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.users.findMany({
        select: { id: true, username: true, firstname: true, lastname: true, role: true }, // Exclude password for security
      });
      res.status(200).json(users.map(user => ({ ...user, id: user.id.toString() })));
    } catch (error) {
      console.error("GET Error:", error);
      res.status(500).json({ error: "Failed to fetch users", details: error.message });
    }
  } else if (req.method === "POST") {
    try {
      const { username, password, firstname, lastname, role = ['user'] } = req.body;
      if (!username || !password || !firstname || !lastname) {
        return res.status(400).json({ error: "All fields (username, password, firstname, lastname) are required" });
      }

      const existingUser = await prisma.users.findUnique({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }

      const hashedPassword = require('bcryptjs').hashSync(password, 10); // Hash password
      const newUser = await prisma.users.create({
        data: {
          username,
          password: hashedPassword,
          firstname,
          lastname,
          role,
        },
      });
      res.status(201).json({ ...newUser, id: newUser.id.toString(), password: undefined }); // Exclude password
    } catch (error) {
      console.error("POST Error:", error);
      res.status(500).json({ error: "Failed to create user", details: error.message });
    }
  } else if (req.method === "PUT") {
    try {
      const { id, updatedUser } = req.body;
      if (!id || !updatedUser) {
        return res.status(400).json({ error: "ID and updated user data are required" });
      }
      const userId = BigInt(id);
      const existingUser = await prisma.users.findUnique({ where: { id: userId } });
      if (!existingUser) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedData = { ...updatedUser };
      if (updatedData.password) {
        updatedData.password = require('bcryptjs').hashSync(updatedData.password, 10); // Hash new password if provided
      }
      const updatedUserResult = await prisma.users.update({
        where: { id: userId },
        data: updatedData,
        select: { id: true, username: true, firstname: true, lastname: true, role: true },
      });
      res.status(200).json({ ...updatedUserResult, id: updatedUserResult.id.toString() });
    } catch (error) {
      console.error("PUT Error:", error);
      res.status(500).json({ error: "Failed to update user", details: error.message });
    }
  } else if (req.method === "DELETE") {
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ error: "ID is required" });
      }
      const userId = BigInt(id);
      const deletedUser = await prisma.users.delete({
        where: { id: userId },
        select: { id: true },
      });
      res.status(200).json({ message: "User deleted", id: deletedUser.id.toString() });
    } catch (error) {
      console.error("DELETE Error:", error);
      if (error.code === 'P2025') {
        res.status(404).json({ error: "User not found" });
      } else {
        res.status(500).json({ error: "Failed to delete user", details: error.message });
      }
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}