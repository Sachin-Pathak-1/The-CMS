import prisma from "../utils/prisma.js";

export const listAdmissions = async () => {
  return prisma.admission.findMany({ include: { course: true }, orderBy: { createdAt: "desc" } });
};

export const createAdmission = async (data) => {
  return prisma.admission.create({ data });
};

export const updateAdmission = async (id, data) => {
  return prisma.admission.update({ where: { id }, data });
};

export const deleteAdmission = async (id) => {
  return prisma.admission.delete({ where: { id } });
};
