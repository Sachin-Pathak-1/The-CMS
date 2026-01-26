import { AdminPage } from './pages/adminpage/AdminPage.jsx';
import { TeacherPage } from './pages/teacher/TeacherPage.jsx';
import { StudentPage } from './pages/student/StudentPage.jsx';
import { Route,Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage.jsx';

function App() {
  return (
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/teacher" element={<TeacherPage />} />
      <Route path="/student" element={<StudentPage />} />
    </Routes>
  )
}

export default App
