import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './Pages/LandingPage'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import CartPage from './Pages/Cart'
import BrowsePage from './Pages/Browse'
import { Provider } from 'react-redux'
import { Toaster } from 'sonner'
import { AuthProvider } from './Middleware/AuthProvider'
import ItemDashboard from './Pages/PostItems'


function App() {
  return (
    <>
      <BrowserRouter>
      <Toaster/>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<SignIn/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path='/browse' element={<BrowsePage/>}/>
          <Route path='/dashboard' element={<ItemDashboard/>}/>
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App
