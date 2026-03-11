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
import { AttendanceListPage } from './pages/list/attendance/page.jsx';
import { EventsListPage } from './pages/list/events/page.jsx';
import { AnnouncemetnsListPage } from './pages/list/announcements/page.jsx';
import { TeacherDetails } from './pages/list/teacher/TeacherDetails.jsx';
import { StudentDetails } from './pages/student/StudentDetails.jsx';
import { ProfilePage } from './pages/profile/ProfilePage.jsx';
import { SettingsPage } from './pages/settings/SettingsPage.jsx';
import { StorePage } from './pages/store/StorePage.jsx';
import { WalletPage } from './pages/wallet/WalletPage.jsx';
import { OrderPage } from './pages/order/OrderPage.jsx';
import { OrdersPage } from './pages/orders/OrdersPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { ChatPage } from './pages/chat/ChatPage.jsx';
import { AssignmentDetailsPage } from './pages/assignments/AssignmentDetailsPage.jsx';
import { ProtectedRoute } from './components/Auth/ProtectedRoute.jsx';

function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/chat" element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
      <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherPage /></ProtectedRoute>} />
      <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentPage /></ProtectedRoute>} />
      <Route path="/list/teachers" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><TeacherListPage /></ProtectedRoute>} />
      <Route path="/list/students" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentListPage /></ProtectedRoute>} />
      <Route path="/list/parents" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ParentListPage /></ProtectedRoute>} />
      <Route path="/list/subjects" element={<ProtectedRoute allowedRoles={['admin']}><SubjectListPage /></ProtectedRoute>} />
      <Route path="/list/classes" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ClassesListPage /></ProtectedRoute>} />
      <Route path="/list/lessons" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><LessonsListPage /></ProtectedRoute>} />
      <Route path="/list/exams" element={<ProtectedRoute><ExamsListPage /></ProtectedRoute>} />
      <Route path="/list/assignments" element={<ProtectedRoute><AssignmentsListPage /></ProtectedRoute>} />
      <Route path="/assignments/:id" element={<ProtectedRoute><AssignmentDetailsPage /></ProtectedRoute>} />
      <Route path="/list/results" element={<ProtectedRoute><ResultsListPage /></ProtectedRoute>} />
      <Route path="/list/attendance" element={<ProtectedRoute><AttendanceListPage /></ProtectedRoute>} />
      <Route path="/list/events" element={<ProtectedRoute><EventsListPage /></ProtectedRoute>} />
      <Route path="/list/announcements" element={<ProtectedRoute><AnnouncemetnsListPage /></ProtectedRoute>} />
      <Route path="/store" element={<ProtectedRoute><StorePage /></ProtectedRoute>} />
      <Route path="/wallet" element={<ProtectedRoute><WalletPage /></ProtectedRoute>} />
      <Route path="/order" element={<ProtectedRoute><OrderPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      <Route path="/teacher/details/:id" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><TeacherDetails /></ProtectedRoute>} />
      <Route path="/student/details/:id" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentDetails /></ProtectedRoute>} />
    </Routes>
  )
}

export default App
