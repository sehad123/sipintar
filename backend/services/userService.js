const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

// Create a new user
const registerUser = async ({ name, email, password, role, no_hp }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword, role, no_hp },
    });
    return newUser;
  } catch (error) {
    throw new Error("User registration failed");
  }
};

// Read all users with role "Pegawai"
const getAllPegawaiUsers = async () => {
  return await prisma.user.findMany({
    where: {
      NOT: {
        role: "Admin",
      },
    },
  });
};

// Read a single user by ID
const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
};

// Update a user
const updateUser = async (id, { name, email, password, role, no_hp }) => {
  const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        no_hp,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error("Failed to update user");
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(id) },
    });
    return { message: "User deleted successfully" };
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};

// Login user
const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) return null;

  return user;
};

// Find or create user by email
const findOrCreateUserByEmail = async ({ name, email, role = "Mahasiswa" }) => {
  try {
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: { name, email, role },
      });
    }

    return user;
  } catch (error) {
    console.error("Error in findOrCreateUserByEmail:", error);
    throw new Error("Failed to find or create user");
  }
};

module.exports = {
  registerUser,
  getAllPegawaiUsers,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  findOrCreateUserByEmail,
};
