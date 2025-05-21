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
import UserItems from './Pages/User/UserBookings';
import Settings from './Pages/User/Settings';
import { UserTickets } from './Pages/User/UserTickets';
import UserDashboardLayout from './Pages/User/Layout';
import { CreateTicket } from './Pages/User/CreateTickets';
import TicketsSupport from './Pages/Admin/TicketsSupport';
import TermsConditions from './Pages/Admin/Terms';
import { TicketDetails } from './Pages/User/TikcetDetails';
import UserVerification from './Pages/Admin/UserVerification';
import DocumentVerification from './Pages/User/DocumentVerification';
import { ProtectedRoute } from './Middleware/ProtectedRoute';
import { ProfilePage } from './Pages/Profile';
import { Terms } from './Pages/Terms';
import PayPalCheckout from './Pages/Payment';
import { LinkPaypal } from './Pages/User/LinkPaypal';
import { CallBack } from './Pages/User/PaypalCallBack';

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
            <Route path="/profile/:id" element={<ProfilePage />} />
            <Route path="/dashboard" element={<UserDashboardLayout />}>
              <Route index element={<ItemDashboard />} />
              <Route path="myitems" element={<UserItems />} />
              <Route path="verification" element={<DocumentVerification />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tickets" element={<UserTickets />} />
              <Route path='tickets/create' element={<CreateTicket />} />
              <Route path="tickets/:ticketId" element={<TicketDetails />} />
              <Route path="paypal" element={<LinkPaypal />} />
              {/* <Route path="tickets/create" element={<CreateTicket />} />  */}
            </Route>
            <Route path='/paypal/success' element={<CallBack />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/terms' element={<Terms />} />
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="/admin/items" element={<ManageItems />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path='/admin/users/verification' element={<UserVerification />} />
              <Route path='/admin/tickets' element={<TicketsSupport />} />
              <Route path='/admin/terms' element={<TermsConditions />} />
            </Route>
            <Route path='/payment' element={<PayPalCheckout />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
