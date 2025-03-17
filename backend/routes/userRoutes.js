const express = require("express");
const { registerUser, loginUser, getAllPegawaiUsers, getUserById, updateUser, deleteUser, findOrCreateUserByEmail, getUserByEmail } = require("../services/userService");
const { PrismaClient } = require("@prisma/client");

const router = express.Router();
const prisma = new PrismaClient();

// Google login
router.post("/google-login", async (req, res) => {
  const { name, email } = req.body;

  // Pastikan name dan email disertakan dalam body
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  try {
    const user = await findOrCreateUserByEmail({ name, email });
    res.json({ user });
  } catch (error) {
    console.error("Error in google-login:", error);
    res.status(500).json({ error: "Google login failed" });
  }
});

// Register user
router.post("/register", async (req, res) => {
  const { name, email, password, role, no_hp } = req.body;
  try {
    const newUser = await registerUser({ name, email, password, role, no_hp });
    res.json(newUser);
  } catch (error) {
    if (error.message === "Email already registered") {
      res.status(400).json({ error: "Email sudah digunakan" });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all Pegawai users
router.get("/users/pegawai", async (req, res) => {
  try {
    const pegawaiUsers = await getAllPegawaiUsers();
    res.json(pegawaiUsers);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Pegawai users" });
  }
});

// Get a user by ID
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
// Get user by email
router.get("/user", async (req, res) => {
  const { email } = req.query;
  console.log("Fetching user with email:", email); // Log email yang diterima
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      console.log("User not found for email:", email); // Log jika user tidak ditemukan
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User found:", user); // Log data user yang ditemukan
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
});
// Create user
router.post("/user", async (req, res) => {
  const { name, email, role } = req.body;
  try {
    // Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.json(existingUser); // Kembalikan user yang sudah ada
    }

    // Jika user tidak ada, buat user baru
    const newUser = await prisma.user.create({
      data: { name, email, role },
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
});

// Update a user by ID
router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role, no_hp } = req.body;
  try {
    const updatedUser = await updateUser(id, { name, email, password, role, no_hp });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
});

// Delete a user by ID
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteUser(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Pastikan email dan password disertakan dalam body
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await loginUser({ email, password });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;
