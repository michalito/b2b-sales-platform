import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function updateAdminPassword() {
  const newPassword = 'admin123' // Change this to your desired password
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  try {
    const updatedUser = await prisma.user.update({
      where: { email: '' }, // Change this to your desired user email
      data: { 
        password: hashedPassword,
        approved: true, // Ensure the user is approved
        emailVerified: true // Ensure the email is verified
      }
    })

    console.log('Admin password updated successfully')
    console.log('Updated user:', updatedUser)
  } catch (error) {
    console.error('Error updating admin password:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateAdminPassword()