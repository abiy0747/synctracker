import bcrypt from "bcryptjs";
import prisma from "../config/prisma";
export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  // 1. Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Create the user
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // 4. Never return the password
  const { password: _, ...safeUser } = user;

  return safeUser;
};