import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdminUser() {
  const email = 'michael.sinoplis@fitnessproduction.gr' // Change this to your desired email
  const password = 'admin123' // Change this to your desired password
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hashedPassword,
        approved: true, // Ensure the user is approved
        emailVerified: true, // Ensure the email is verified
        role: 'ADMIN' // Ensure the role is correct
      }
    })

    console.log('User created successfully')
    console.log('New user:', newUser)
  } catch (error) {
    console.error('Error creating admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdminUser()
