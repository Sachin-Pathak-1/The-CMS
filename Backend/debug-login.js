import bcrypt from "bcrypt";
import prisma from "./utils/prisma.js";

async function debugLogin() {
  console.log("🔍 Debugging login...\n");

  try {
    // Step 1: Find user by username
    console.log("1️⃣ Finding user 'admin'...");
    const user = await prisma.user.findUnique({
      where: { username: "admin" }
    });
    
    if (!user) {
      console.log("❌ User not found!");
      const allUsers = await prisma.user.findMany();
      console.log(`Available users: ${allUsers.map(u => u.username).join(", ")}`);
      return;
    }
    
    console.log("✅ User found:", user);
    
    // Step 2: Verify password
    console.log("\n2️⃣ Verifying password...");
    console.log("Password field type:", typeof user.password);
    console.log("Password starts with:", user.password.substring(0, 10));
    
    const isMatch = await bcrypt.compare("password123", user.password);
    console.log("Password match:", isMatch);
    
    if (!isMatch) {
      console.log("❌ Password does not match!");
      return;
    }
    
    // Step 3: Get user details
    console.log("\n3️⃣ Getting user details...");
    const userDetails = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        email: true,
        type: true,
        college: {
          select: {
            name: true,
            regNo: true,
          },
        },
        userDetails: {
          select: {
            avatar: true,
            firstName: true,
            lastName: true,
            sex: true,
            dob: true,
            phone: true,
            address: {
              select: {
                addressLine1: true,
                addressLine2: true,
                city: true,
                state: true,
                postalCode: true,
                country: true,
              },
            },
          },
        },
        roles: {
          select: {
            role: {
              select: {
                name: true,
                description: true,
              },
            },
          },
        },
        xp: {
          select: {
            xp: true,
            level: true,
          },
        },
      },
    });
    
    console.log("✅ User details retrieved");
    console.log(JSON.stringify(userDetails, null, 2));
    
    // Step 4: Check wallet
    console.log("\n4️⃣ Checking wallet...");
    const walletRows = await prisma.$queryRaw`
      SELECT wallet_id, balance
      FROM wallet
      WHERE user_id = ${user.id}
      LIMIT 1
    `;
    
    console.log("✅ Wallet query result:", walletRows);
    
    console.log("\n✅ All steps succeeded!");
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("Stack:", error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
