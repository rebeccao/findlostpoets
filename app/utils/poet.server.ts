// app/utils/user.server.ts
import { prisma } from '~/utils/prisma.server'
  
export const getOnePoet = async () => {
  return prisma.poet.findUnique ({
    where: {
      pid: 1
    }
  })
}

export const getPoets = async () => {
  return prisma.poet.findMany ({
    skip: 6079,
    take: 21,
    orderBy: {
      pid: 'asc',
    },
  })
}

export const getPoetBreed = async () => {
  return prisma.poet.findMany({
    where: {
      brd: "naia"
    }
  })
}

/*
  export const getPoets = async () => {
    return prisma.poets.findMany({
      orderBy: {
        poet_id: 'asc',
      },
    })
  }

  export const getPoets = async (userId: string) => {
    return prisma.user.findMany({
      where: {
        id: { not: userId },
      },
      orderBy: {
        profile: {
          firstName: 'asc',
        },
      },
    })
  }
  */
  