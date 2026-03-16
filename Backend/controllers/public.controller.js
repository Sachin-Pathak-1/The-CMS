import prisma from "../utils/prisma.js";
import { sendSuccess, sendError } from "../utils/response.js";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(11, 16);
};

const fullName = (details, fallback) => {
  if (!details) return fallback;
  const name = [details.firstName, details.lastName].filter(Boolean).join(" ").trim();
  return name || fallback;
};

const toAddress = (address) => {
  if (!address) return "N/A";
  return [address.addressLine1, address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
};

async function getTeachersList() {
  const [teachers, courses] = await Promise.all([
    prisma.user.findMany({
      where: { type: "teacher" },
      include: {
        userDetails: { include: { address: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.course.findMany({
      select: { id: true, name: true },
      orderBy: { id: "asc" },
    }),
  ]);

  const courseNames = courses.map((course) => course.name);
  const classNames = courses.map((course) => `C-${course.id}`);

  return teachers.map((teacher, index) => {
    const name = fullName(teacher.userDetails, teacher.username);
    return {
      id: teacher.id,
      teacherId: teacher.username,
      name,
      email: teacher.email,
      photo: teacher.userDetails?.avatar || "",
      phone: teacher.userDetails?.phone || "N/A",
      subjects: courseNames.slice(index % 3, (index % 3) + 2),
      classes: classNames.slice(index % 3, (index % 3) + 2),
      address: toAddress(teacher.userDetails?.address),
    };
  });
}

async function getStudentsList() {
  const students = await prisma.user.findMany({
    where: { type: "student" },
    include: {
      userDetails: { include: { address: true } },
      enrollments: {
        include: { course: true },
        orderBy: { enrolledAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return students.map((student) => {
    const name = fullName(student.userDetails, student.username);
    const firstEnrollment = student.enrollments[0];
    return {
      id: student.id,
      studentId: student.username,
      name,
      email: student.email,
      photo: student.userDetails?.avatar || "",
      phone: student.userDetails?.phone || "N/A",
      grade: firstEnrollment?.grade || "N/A",
      class: firstEnrollment?.course?.name || "N/A",
      address: toAddress(student.userDetails?.address),
    };
  });
}

async function getParentsList() {
  return [];
}

async function getSubjectsList() {
  const [courses, teachers] = await Promise.all([
    prisma.course.findMany({ orderBy: { id: "asc" } }),
    prisma.user.findMany({
      where: { type: "teacher" },
      include: { userDetails: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  const teacherNames = teachers.map((teacher) => fullName(teacher.userDetails, teacher.username));

  return courses.map((course, index) => ({
    id: course.id,
    name: course.name,
    teachers: teacherNames.length
      ? [teacherNames[index % teacherNames.length]]
      : [],
  }));
}

async function getClassesList() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { enrollments: true } } },
    orderBy: { id: "asc" },
  });

  return courses.map((course) => ({
    id: course.id,
    name: course.name,
    capacity: course._count.enrollments || 0,
    grade: "N/A",
    supervisor: "N/A",
  }));
}

async function getLessonsList() {
  const assignments = await prisma.assignment.findMany({
    include: { course: true },
    orderBy: { createdAt: "desc" },
  });

  return assignments.map((assignment) => ({
    id: assignment.id,
    subject: assignment.title,
    class: assignment.course?.name || "N/A",
    teacher: "N/A",
  }));
}

async function getExamsList() {
  const grades = await prisma.grade.findMany({
    include: { assignment: { include: { course: true } } },
    orderBy: { gradedAt: "desc" },
  });

  return grades.map((grade) => ({
    id: grade.id,
    subject: grade.assignment?.title || "N/A",
    class: grade.assignment?.course?.name || "N/A",
    teacher: grade.gradedBy || "N/A",
    date: formatDate(grade.gradedAt),
  }));
}

async function getAssignmentsList() {
  const assignments = await prisma.assignment.findMany({
    include: { course: true },
    orderBy: { dueDate: "asc" },
  });

  return assignments.map((assignment) => ({
    id: assignment.id,
    subject: assignment.title,
    class: assignment.course?.name || "N/A",
    teacher: "N/A",
    dueDate: formatDate(assignment.dueDate),
  }));
}

async function getResultsList() {
  const grades = await prisma.grade.findMany({
    include: {
      assignment: { include: { course: true } },
      user: { include: { userDetails: true } },
    },
    orderBy: { gradedAt: "desc" },
  });

  return grades.map((grade) => ({
    id: grade.id,
    subject: grade.assignment?.title || "N/A",
    student: fullName(grade.user?.userDetails, grade.user?.username || "N/A"),
    score: grade.grade,
    teacher: grade.gradedBy || "N/A",
    class: grade.assignment?.course?.name || "N/A",
    date: formatDate(grade.gradedAt),
  }));
}

async function getAttendanceList() {
  const records = await prisma.attendance.findMany({
    include: {
      user: { include: { userDetails: true } },
      course: true,
    },
    orderBy: { date: "desc" },
    take: 200,
  });

  return records.map((item) => ({
    id: item.id,
    studentName: fullName(item.user?.userDetails, item.user?.username || "Student"),
    class: item.course?.name || "N/A",
    status: item.status || "Present",
    date: formatDate(item.date),
  }));
}

async function getEventsList(limit = 4) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const urgentThreshold = new Date(today);
  urgentThreshold.setDate(urgentThreshold.getDate() + 7);

  const assignments = await prisma.assignment.findMany({
    where: { dueDate: { gte: today } },
    include: { course: true },
    orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
  });

  const normalizedLimit = Number.isInteger(limit) && limit > 0 ? limit : 4;
  const urgentAssignments = assignments.filter((assignment) => assignment.dueDate <= urgentThreshold);
  const latestAssignments = [...assignments].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const selectedAssignments = [];
  const seenIds = new Set();

  for (const assignment of urgentAssignments) {
    if (selectedAssignments.length >= normalizedLimit) break;
    selectedAssignments.push(assignment);
    seenIds.add(assignment.id);
  }

  for (const assignment of latestAssignments) {
    if (selectedAssignments.length >= normalizedLimit) break;
    if (seenIds.has(assignment.id)) continue;
    selectedAssignments.push(assignment);
    seenIds.add(assignment.id);
  }

  return selectedAssignments.map((assignment) => ({
    id: assignment.id,
    assignmentId: assignment.id,
    title: assignment.title,
    class: assignment.course?.name || "N/A",
    date: formatDate(assignment.dueDate),
    startTime: "09:00",
    endTime: "10:00",
    isUrgent: assignment.dueDate <= urgentThreshold,
  }));
}

async function getAnnouncementsList(limit = null) {
  const announcements = await prisma.announcement.findMany({
    include: { user: { include: { userDetails: true } } },
    orderBy: { createdAt: "desc" },
    ...(limit ? { take: limit } : {}),
  });

  return announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.title,
    class: "General",
    date: formatDate(announcement.createdAt),
    description: announcement.description || "",
    postedBy: fullName(announcement.user?.userDetails, announcement.user?.username || "N/A"),
  }));
}

const listResolvers = {
  teachers: getTeachersList,
  students: getStudentsList,
  parents: getParentsList,
  subjects: getSubjectsList,
  classes: getClassesList,
  lessons: getLessonsList,
  exams: getExamsList,
  assignments: getAssignmentsList,
  results: getResultsList,
  attendance: getAttendanceList,
  events: getEventsList,
  announcements: getAnnouncementsList,
};

export const getPublicList = async (req, res) => {
  try {
    const { type } = req.params;
    const resolver = listResolvers[type];
    if (!resolver) {
      return sendError(res, "Unknown list type", 404);
    }

    const limit = req.query.limit ? parseInt(req.query.limit, 10) : null;
    const data = await resolver(limit);
    return sendSuccess(res, data);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch list data", 500);
  }
};

export const getPublicTeacherById = async (req, res) => {
  try {
    const teachers = await getTeachersList();
    const teacher = teachers.find((item) => String(item.id) === String(req.params.id));
    if (!teacher) {
      return sendError(res, "Teacher not found", 404);
    }
    return sendSuccess(res, teacher);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch teacher", 500);
  }
};

export const getPublicStudentById = async (req, res) => {
  try {
    const students = await getStudentsList();
    const student = students.find((item) => String(item.id) === String(req.params.id));
    if (!student) {
      return sendError(res, "Student not found", 404);
    }
    return sendSuccess(res, student);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch student", 500);
  }
};

export const getPublicCalendarEvents = async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      include: { course: true },
      orderBy: { dueDate: "asc" },
      take: 100,
    });

    const events = assignments.map((assignment) => {
      const start = new Date(assignment.dueDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(assignment.dueDate);
      end.setHours(10, 0, 0, 0);

      return {
        id: assignment.id,
        title: `${assignment.title} (${assignment.course?.name || "Class"})`,
        start: start.toISOString(),
        end: end.toISOString(),
      };
    });

    return sendSuccess(res, events);
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch calendar events", 500);
  }
};

export const getPublicSummary = async (req, res) => {
  try {
    const [users, enrollments, transactions] = await Promise.all([
      prisma.user.findMany({
        select: {
          type: true,
          userDetails: { select: { sex: true } },
        },
      }),
      prisma.enrollment.findMany({
        where: {
          enrolledAt: {
            gte: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          },
        },
        select: { enrolledAt: true },
      }),
      prisma.transactionHistory.findMany({
        where: { status: "success" },
        select: { transactionDate: true, amount: true, type: true },
      }),
    ]);

    const userCounts = users.reduce(
      (acc, user) => {
        acc[user.type] = (acc[user.type] || 0) + 1;
        return acc;
      },
      { student: 0, teacher: 0, parent: 0, staff: 0, admin: 0 }
    );

    const sexCounts = users.reduce(
      (acc, user) => {
        const sex = user.userDetails?.sex;
        if (sex === "male") acc.boys += 1;
        if (sex === "female") acc.girls += 1;
        return acc;
      },
      { boys: 0, girls: 0 }
    );

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const attendanceMap = {};
    for (let i = 6; i >= 0; i -= 1) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      attendanceMap[day.toDateString()] = {
        name: weekDays[day.getDay()],
        present: 0,
        absent: 0,
      };
    }

    enrollments.forEach((item) => {
      const key = new Date(item.enrolledAt).toDateString();
      if (attendanceMap[key]) {
        attendanceMap[key].present += 1;
      }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const financeMap = {};
    monthNames.forEach((name) => {
      financeMap[name] = { name, income: 0, expence: 0 };
    });

    transactions.forEach((item) => {
      const month = monthNames[new Date(item.transactionDate).getMonth()];
      const amount = Number(item.amount || 0);
      if (item.type === "credit") {
        financeMap[month].income += amount;
      } else {
        financeMap[month].expence += amount;
      }
    });

    return sendSuccess(res, {
      userCounts,
      sexCounts,
      attendance: Object.values(attendanceMap),
      finance: monthNames.map((name) => financeMap[name]),
    });
  } catch (error) {
    console.error(error);
    return sendError(res, "Failed to fetch summary", 500);
  }
};
