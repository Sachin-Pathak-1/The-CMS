import { AdminPage } from './pages/adminpage/AdminPage.jsx';
import { TeacherPage } from './pages/teacher/TeacherPage.jsx';
import { StudentPage } from './pages/student/StudentPage.jsx';
import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import FeaturesPage from './pages/LandingPage/FeaturesPage.jsx';
import { TeacherListPage } from './pages/list/teacher/page.jsx';
import { ParentListPage } from './pages/list/parent/page.jsx';
import { StudentListPage } from './pages/list/student/page.jsx';
import { SubjectListPage } from './pages/list/subject/page.jsx';
import { ClassesListPage } from './pages/list/classes/page.jsx';
import { LessonsListPage } from './pages/list/lessons/page.jsx';
import { ExamsListPage } from './pages/list/exams/page.jsx';
import { AssignmentsListPage } from './pages/list/assignments/page.jsx';
import { ResultsListPage } from './pages/list/results/page.jsx';
import { EventsListPage } from './pages/list/events/page.jsx';
import { AnnouncemetnsListPage } from './pages/list/announcements/page.jsx';
import { TeacherDetails } from './pages/list/teacher/TeacherDetails.jsx';

function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
      <Route path="/student" element={<StudentPage />} />
      <Route path="/list/teachers" element={<TeacherListPage />} />
      <Route path="/list/students" element={<StudentListPage />} />
      <Route path="/list/parents" element={<ParentListPage />} />
      <Route path="/list/subjects" element={<SubjectListPage />} />
      <Route path="/list/classes" element={<ClassesListPage />} />
      <Route path="/list/lessons" element={<LessonsListPage />} />
      <Route path="/list/exams" element={<ExamsListPage />} />
      <Route path="/list/assignments" element={<AssignmentsListPage />} />
      <Route path="/list/results" element={<ResultsListPage />} />
      <Route path="/list/events" element={<EventsListPage />} />
      <Route path="/list/announcements" element={<AnnouncemetnsListPage />} />
      <Route path="/teacher/details" element={<TeacherDetails />} />
    </Routes>
  )
}

export default App
