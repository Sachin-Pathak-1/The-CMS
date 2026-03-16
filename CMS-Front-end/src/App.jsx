import { AdminPage } from './pages/adminpage/AdminPage.jsx';
import { TeacherPage } from './pages/teacher/TeacherPage.jsx';
import { StudentPage } from './pages/student/StudentPage.jsx';
import { Route, Routes } from 'react-router-dom';
import './App.css'
import LandingPage from './pages/LandingPage/LandingPage.jsx';
import FeaturesPage from './pages/LandingPage/FeaturesPage.jsx';
import { TeacherListPage } from './pages/list/teacher/page.jsx';
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
import { AdmissionsListPage } from './pages/list/admissions/page.jsx';
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
import { Layout } from './pages/Layout.jsx';
import { TimetablePage } from './pages/timetable/TimetablePage.jsx';

function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/features" element={<FeaturesPage />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/list/exams" element={<ExamsListPage />} />
        <Route path="/list/assignments" element={<AssignmentsListPage />} />
        <Route path="/assignments/:id" element={<AssignmentDetailsPage />} />
        <Route path="/list/results" element={<ResultsListPage />} />
        <Route path="/list/attendance" element={<AttendanceListPage />} />
        <Route path="/list/events" element={<EventsListPage />} />
        <Route path="/list/announcements" element={<AnnouncemetnsListPage />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/wallet" element={<WalletPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPage /></ProtectedRoute>} />
        <Route path="/teacher" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherPage /></ProtectedRoute>} />
        <Route path="/student" element={<ProtectedRoute allowedRoles={['student']}><StudentPage /></ProtectedRoute>} />
        <Route path="/list/teachers" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><TeacherListPage /></ProtectedRoute>} />
        <Route path="/list/students" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentListPage /></ProtectedRoute>} />
        <Route path="/list/subjects" element={<ProtectedRoute allowedRoles={['admin']}><SubjectListPage /></ProtectedRoute>} />
        <Route path="/list/classes" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ClassesListPage /></ProtectedRoute>} />
        <Route path="/list/lessons" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><LessonsListPage /></ProtectedRoute>} />
        <Route path="/list/admissions" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><AdmissionsListPage /></ProtectedRoute>} />
        <Route path="/teacher/details/:id" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><TeacherDetails /></ProtectedRoute>} />
        <Route path="/student/details/:id" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><StudentDetails /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
