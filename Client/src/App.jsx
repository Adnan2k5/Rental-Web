import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './Pages/LandingPage'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import CartPage from './Pages/Cart'
import BrowsePage from './Pages/Browse'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/signup' element={<SignUp/>}/>
          <Route path='/login' element={<SignIn/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path='/browse' element={<BrowsePage/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
