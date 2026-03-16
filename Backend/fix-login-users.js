import bcrypt from "bcrypt";
import prisma from "./utils/prisma.js";

const DEFAULT_PASSWORD = "password123";
const TARGET_USERS = [
  { username: "admin", email: "admin@test.com", type: "admin", firstName: "Admin", lastName: "User" },
  { username: "teacher", email: "teacher@test.com", type: "teacher", firstName: "Teach", lastName: "Er" },
  { username: "student1", email: "stud1@test.com", type: "student", firstName: "Stu", lastName: "Dent" },
];

async function ensureCollege() {
  let college = await prisma.college.findFirst();
  if (!college) {
    college = await prisma.college.create({
      data: { name: "Default College", email: "college@test.com", regNo: "REG-001" },
    });
  }
  return college;
}

async function main() {
  const college = await ensureCollege();
  const hashed = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  for (const user of TARGET_USERS) {
    await prisma.user.upsert({
      where: { username: user.username },
      update: { password: hashed, email: user.email, type: user.type, collegeId: college.id },
      create: {
        username: user.username,
        email: user.email,
        password: hashed,
        type: user.type,
        collegeId: college.id,
        userDetails: {
          create: {
            firstName: user.firstName,
            lastName: user.lastName,
            sex: "other",
            dob: new Date("2000-01-01"),
          },
        },
        xp: { create: { xp: 0, level: 1 } },
      },
    });
    console.log(`? ensured user ${user.username}`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
