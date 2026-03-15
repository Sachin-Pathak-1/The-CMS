import prisma from "../utils/prisma.js";
import { Sex, TransactionStatus, TransactionType, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

async function main() {
  await prisma.$connect();

  const seededPassword = await bcrypt.hash("password123", 10);

  await prisma.auditLog.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.transactionHistory.deleteMany();
  await prisma.submission.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.announcement.deleteMany();
  await prisma.xp.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.userDetails.deleteMany();
  await prisma.userRoles.deleteMany();
  await prisma.user.deleteMany();
  await prisma.course.deleteMany();
  await prisma.college.deleteMany();
  await prisma.address.deleteMany();

  const address = await prisma.address.create({
    data: {
      addressLine1: "123 Main St",
      city: "Mumbai",
      state: "MH",
      postalCode: "400001",
      country: "India",
    },
  });

  const college = await prisma.college.create({
    data: {
      name: "Demo College",
      email: "college@test.com",
      regNo: "REG123",
      addressId: address.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: "admin@test.com",
      username: "admin",
      password: seededPassword,
      type: UserRole.admin,
      collegeId: college.id,
      userDetails: {
        create: {
          firstName: "Admin",
          lastName: "User",
          sex: Sex.other,
          dob: new Date("1990-01-01"),
        },
      },
      xp: { create: { xp: 100, level: 2 } },
    },
  });

  const teacher = await prisma.user.create({
    data: {
      email: "teacher@test.com",
      username: "teacher",
      password: seededPassword,
      type: UserRole.teacher,
      collegeId: college.id,
      userDetails: {
        create: {
          firstName: "Teach",
          lastName: "Er",
          sex: Sex.male,
          dob: new Date("1985-05-05"),
        },
      },
      xp: { create: { xp: 50 } },
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: "stud1@test.com",
      username: "student1",
      password: seededPassword,
      type: UserRole.student,
      collegeId: college.id,
      userDetails: {
        create: {
          firstName: "Stu",
          lastName: "Dent1",
          sex: Sex.female,
          dob: new Date("2004-03-10"),
        },
      },
      xp: { create: {} },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: "stud2@test.com",
      username: "student2",
      password: seededPassword,
      type: UserRole.student,
      collegeId: college.id,
      userDetails: {
        create: {
          firstName: "Stu",
          lastName: "Dent2",
          sex: Sex.male,
          dob: new Date("2003-07-12"),
        },
      },
      xp: { create: {} },
    },
  });

  const course = await prisma.course.create({
    data: {
      name: "Intro to Programming",
      description: "Seeded course",
    },
  });

  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course.id },
      { userId: student2.id, courseId: course.id },
    ],
  });

  const assignment = await prisma.assignment.create({
    data: {
      title: "Hello World",
      courseId: course.id,
      dueDate: new Date(),
    },
  });

  await prisma.submission.create({
    data: {
      userId: student1.id,
      assignmentId: assignment.id,
      filePath: "/submissions/hw1.txt",
    },
  });

  const product = await prisma.product.create({
    data: {
      creatorId: admin.id,
      name: "Notebook",
      price: 50,
      stock: 100,
    },
  });

  await prisma.order.create({
    data: {
      userId: student1.id,
      totalAmount: 50,
      items: {
        create: {
          productId: product.id,
          quantity: 1,
          price: 50,
        },
      },
    },
  });

  await prisma.transactionHistory.create({
    data: {
      userId: student1.id,
      amount: 50,
      type: TransactionType.debit,
      status: TransactionStatus.success,
      note: "Purchase",
    },
  });

  console.log("Seed complete");
  console.log("Demo logins:");
  console.log("admin@test.com / password123");
  console.log("teacher@test.com / password123");
  console.log("stud1@test.com / password123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
