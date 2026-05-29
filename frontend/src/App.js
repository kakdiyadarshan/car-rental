import logo from './logo.svg';
import './App.css';
import './z_styles.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Main from './pages/Main';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Fleet from './pages/Fleet';
import GalleryPage from './pages/GalleryPage';
import Help from './pages/Help';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import FAQ from './pages/FAQ';
import Payment from './pages/Payment';
import Invoice from './pages/Invoice';
import HeroSlider from './pages/HeroSlider';
import BrandSlider from './pages/BrandSlider';
import BookingSearch from './pages/BookingSearch';
import AdminDashboard from './pages/Admin/AdminDashboard';
import ManageCars from './pages/Admin/ManageCars';
import ManageBookings from './pages/Admin/ManageBookings';
import ManageContacts from './pages/Admin/ManageContacts';
import Profile from './pages/Profile';
import Register from './components/Register';
import CarDetail from './pages/CarDetail';
import Feedback from './pages/Feedback';



import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword';
import { Blog } from './pages/Blog';
import { BlogDetails } from './pages/BlogDetails';

function App() {
  return (
      <BrowserRouter>
      <div className="App"> 
        <ToastContainer position="top-right" autoClose={3000} />
        <Header />

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/Header" element={<Header />} />
          <Route path="/car/:id" element={<CarDetail />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Fleet" element={<Fleet />} />
          <Route path="/Gallery" element={<GalleryPage />} />
          <Route path="/Help" element={<Help />} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
          <Route path="/TermsOfService" element={<TermsOfService />} />
          <Route path="/FAQ" element={<FAQ />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/invoice/:id" element={<Invoice />} />
          <Route path="/Slider" element={<HeroSlider />} />
          <Route path="/BrandSlider" element={<BrandSlider />} />
          <Route path="/Bookingsearch" element={<BookingSearch />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/Feedback" element={<Feedback />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blogdetails/:id" element={<BlogDetails />} />


        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;
