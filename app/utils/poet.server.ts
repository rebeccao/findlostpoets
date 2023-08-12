// app/utils/user.server.ts
import { prisma } from '~/utils/prisma.server'

export const getPoetCount = async () => {
    return prisma.poet.count()
  }
  
export const getOnePoet = async () => {
  return prisma.poet.findUnique ({
    where: {
      id: '1'
    }
  })
}

export const getPoets = async () => {
  return prisma.poet.findMany ({
    skip: 7042,
    take: 20,
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
  