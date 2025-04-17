import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import LandingPage from './Pages/LandingPage';
import SignUp from './Pages/SignUp';
import SignIn from './Pages/SignIn';
import CartPage from './Pages/Cart';
import BrowsePage from './Pages/Browse';
import { Toaster } from 'sonner';
import { AuthProvider } from './Middleware/AuthProvider';
import ItemDashboard from './Pages/User/PostItems';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import AdminLayout from './Pages/Admin/Layout';
import ManageItems from './Pages/Admin/ManageItems';
import ManageUsers from './Pages/Admin/ManageUser';
import Chat from './Pages/Chat/Chat';
import ChatInbox from './Pages/Chat/ChatInbox';
import UserItems from './Pages/User/UserItems';

function App() {
  return (
    <>
      <BrowserRouter>
        <Toaster />
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<SignIn />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/dashboard" element={<ItemDashboard />} />
            <Route path='/dashboard/myitems' element={<UserItems />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/chat/:itemId' element={<Chat />} />
            <Route path='/messages' element={<ChatInbox />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="/admin/items" element={<ManageItems />} />
              <Route path="/admin/users" element={<ManageUsers />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
