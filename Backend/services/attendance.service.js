import prisma from "../utils/prisma.js";

export const listAttendance = async (limit = 200) => {
  return prisma.attendance.findMany({
    take: limit,
    orderBy: { date: "desc" },
    include: {
      user: { select: { username: true, userDetails: { select: { firstName: true, lastName: true } } } },
      course: { select: { name: true } },
    },
  });
};

export const createAttendance = async (payload) => {
  return prisma.attendance.create({ data: payload });
};

export const deleteAttendance = async (id) => {
  return prisma.attendance.delete({ where: { id } });
};
