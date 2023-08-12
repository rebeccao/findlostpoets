// app/utils/prisma.server.ts
import { PrismaClient } from '@prisma/client'

let prisma: PrismaClient
declare global {
  var __db: PrismaClient | undefined
}

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
  prisma.$connect()
} else {
  if (!global.__db) {
    global.__db = new PrismaClient({
      log: [
        {
          emit: 'stdout',
          level: 'query',
        },
        "info",
        "warn",
        "error",
      ],
    });
    
    global.__db.$connect()
    console.log("New Prisma connect")
  }
  prisma = global.__db
  console.log("Made it here")
}

export { prisma }
