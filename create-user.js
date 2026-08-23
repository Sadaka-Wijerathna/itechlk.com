const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const email = 'test@example.com';
  const password = 'password123';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create or update the test user
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date()
    },
    create: {
      email,
      password: hashedPassword,
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      role: 'admin',
      emailVerified: new Date()
    }
  });

  console.log(`Successfully created/updated user!`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${user.role}`);
}

main()
  .catch(e => {
    console.error('Error creating user:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
