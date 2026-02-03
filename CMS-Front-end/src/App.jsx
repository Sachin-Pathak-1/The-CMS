import { AdminPage } from './pages/adminpage/AdminPage.jsx';
import { TeacherPage } from './pages/teacher/TeacherPage.jsx';
import { StudentPage } from './pages/student/StudentPage.jsx';
import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import FeaturesPage from './pages/LandingPage/FeaturesPage.jsx';
import { TeacherListPage } from './pages/list/teacher/page.jsx';
import { ParentListPage } from './pages/list/parent/page.jsx';
import { Route,Routes } from 'react-router-dom';
import './App.css'
import { StudentListPage } from './pages/list/student/page.jsx';

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
    </Routes>
  )
}

export default App
