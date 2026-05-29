import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useGetCarsQuery } from '../slices/carsApiSlice';
import { TfiUser } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa";

import {
  RiMailLine,
  RiTimeLine,
  RiPhoneLine,
  RiGlobalLine,
  RiUserLine,
  RiMoonLine,
  RiSunLine,
  RiArrowDownSLine,
  RiShoppingCartLine,
  RiMenuLine,
  RiCloseLine,
  RiSearchLine,
  RiArrowRightLine,
  RiLoginBoxLine,
  RiUserSettingsLine,
  RiFacebookFill,
  RiTwitterXFill,
  RiCarLine,
} from 'react-icons/ri';


const NAV_ITEMS = [
  {
    label: 'Home',
    href: '/',
    submenu: [
      { label: 'Home Page', href: '/' }
    ]
  },
  {
    label: 'Vehicles',
    href: '/Fleet',
    submenu: [
      { label: 'Vehicles', href: '/Fleet' },
      { label: 'Vehicle Details', href: '/Fleet' }
    ]
  },
  {
    label: 'Pages',
    href: '#',
    submenu: [
      { label: 'About Us', href: '/AboutUs' },
      { label: 'Gallery', href: '/Gallery' },
      { label: 'FAQ', href: '/FAQ' },
      { label: 'Feedback', href: '/Feedback' },
      { label: 'Help Center', href: '/Help' }
    ]
  },
  {
    label: 'Services',
    href: '#',
    submenu: [
      { label: 'Premium Cars', href: '/Fleet' },
      { label: 'Airport Transfer', href: '/Contact' },
      { label: 'Wedding Rental', href: '/Contact' },
      { label: 'City Tour', href: '/Contact' }
    ]
  },
  {
    label: 'Shop',
    href: '#',
    submenu: [
      { label: 'Car Accessories', href: '/Fleet' },
      { label: 'GPS & Gadgets', href: '/Fleet' }
    ]
  },
  {
    label: 'Blog',
    href: '#',
    submenu: [
      { label: 'Travel Stories', href: '/FAQ' },
      { label: 'Car Care Tips', href: '/FAQ' }
    ]
  },
  {
    label: 'Contact Us',
    href: '/Contact'
  }
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: cars } = useGetCarsQuery();

  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState(location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [mobileSearchVal, setMobileSearchVal] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') ||
      localStorage.getItem('theme') === 'dark';
  });

  const searchInputRef = useRef(null);

  const suggestions = React.useMemo(() => {
    if (!searchVal.trim() || !cars) return [];
    return cars
      .filter((car) =>
        car.name.toLowerCase().includes(searchVal.toLowerCase()) ||
        car.brand?.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
        car.category.toLowerCase().includes(searchVal.toLowerCase())
      )
      .slice(0, 5); // Limit to 5 suggestions
  }, [searchVal, cars]);

  /* focus search input when opened */
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100); // Small delay to ensure overlay transition started
    }
  }, [searchOpen]);

  /* sync active nav and close mobile menu on URL change */
  useEffect(() => {
    setActiveNav(location.pathname);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* scroll shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close search on Escape */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSearchOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  /* close dropdown on click outside */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.top-bar-user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleSearch = () => {
    setSearchOpen((prev) => !prev);
    setSearchVal('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate('/Fleet', { state: { searchTerm: searchVal } });
      setSearchOpen(false);
      setSearchVal('');
    }
  };

  const handleMobileSearchSubmit = (e) => {
    e.preventDefault();
    if (mobileSearchVal.trim()) {
      navigate('/Fleet', { state: { searchTerm: mobileSearchVal } });
      setMobileMenuOpen(false);
      setMobileSearchVal('');
    }
  };

  const handleSuggestionClick = (car) => {
    navigate(`/car/${car._id}`);
    setSearchOpen(false);
    setSearchVal('');
  };

  const logoutHandler = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const toggleExpand = (label) => {
    setExpandedItem(expandedItem === label ? null : label);
  };

  const getInitials = () => {
    if (!userInfo) return '';
    const first = userInfo.firstname || userInfo.name || '';
    const last = userInfo.lastname || '';
    if (first && last) {
      return `${first[0]}${last[0]}`.toUpperCase();
    }
    return first ? first[0].toUpperCase() : 'U';
  };


  return (



    <header className="fixed top-0 left-0 w-full z-[1050] transition-all duration-300 font-dm">

      {/* ── 2. Main Header Bar (Dark Glassmorphic Background) ── */}
      <div
        className={`w-full transition-all duration-300 bg-slate-950/80 backdrop-blur-lg border-b border-white/[0.08] ${scrolled ? 'py-2.5 lg:py-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.15)]' : 'py-4 lg:py-5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center no-underline gap-2.5 shrink-0 group">
              <div className="w-10 h-10 bg-primary-text flex items-center justify-center text-white text-xl [clip-path:polygon(12%_0%,88%_0%,100%_12%,100%_88%,88%_100%,12%_100%,0%_88%,0%_12%)] transition-transform duration-500 group-hover:rotate-[360deg]">
                <RiCarLine />
              </div>
              <div className="flex flex-col">
                <span className="font-bebas text-2xl tracking-widest text-white leading-none uppercase">Auto<span className="text-primary-text">X</span></span>
                <span className="text-[7px] tracking-[3px] text-slate-400 uppercase font-bold mt-1">Premium Rentals</span>
              </div>
            </Link>

            {/* ── Desktop Navigation (Dropdown on Hover) ── */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
              {NAV_ITEMS.map((item, idx) => (
                <div key={idx} className="relative group py-5">
                  <Link
                    to={item.href}
                    className={`font-jakarta text-[13px] font-bold tracking-wider uppercase transition-colors flex items-center gap-1 relative py-1 ${activeNav === item.href || (item.submenu && item.submenu.some(sub => activeNav === sub.href))
                      ? 'text-primary-text'
                      : 'text-slate-200 hover:text-primary-text'
                      }`}
                  >
                    {item.label}
                    {item.submenu && <RiArrowDownSLine size={13} className="opacity-70 group-hover:rotate-180 transition-transform duration-200" />}
                    <span className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary-text transition-transform duration-300 origin-left ${
                      activeNav === item.href || (item.submenu && item.submenu.some(sub => activeNav === sub.href))
                        ? 'scale-x-100'
                        : 'scale-x-0 group-hover:scale-x-100'
                    }`} />
                  </Link>

                  {item.submenu && (
                    <div className="absolute top-full left-0 w-52 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] py-2.5 z-50 transition-all duration-300 opacity-0 invisible translate-y-2 origin-top scale-95 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:scale-100">
                      {item.submenu.map((sub, sIdx) => (
                        <Link
                          key={sIdx}
                          to={sub.href}
                          className={`block px-5 py-2.5 text-xs font-bold transition-colors uppercase tracking-wider ${activeNav === sub.href
                            ? 'text-primary-text bg-white/[0.03]'
                            : 'text-slate-300 hover:text-primary-text hover:bg-white/[0.02]'
                            }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* ── Desktop Action Cluster (Search, Cart, Menu) ── */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:border-primary-text hover:text-primary-text hover:bg-white/[0.03] hover:shadow-[0_4px_12px_rgba(255,134,21,0.15)] transition-all duration-300 cursor-pointer"
                title="Search"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <RiSearchLine size={18} className="sm:hidden" />
                <RiSearchLine size={20} className="hidden sm:block" />
              </button>

              <button
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:border-primary-text hover:text-primary-text hover:bg-white/[0.03] hover:shadow-[0_4px_12px_rgba(255,134,21,0.15)] transition-all duration-300 relative cursor-pointer"
                title="Cart"
                aria-label="Cart"
                onClick={() => navigate('/Fleet')}
              >
                <RiShoppingCartLine size={18} className="sm:hidden" />
                <RiShoppingCartLine size={20} className="hidden sm:block" />
                <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-4.5 h-4.5 sm:w-5 sm:h-5 bg-primary-text text-white text-[9px] sm:text-[10px] rounded-full flex items-center justify-center font-bold leading-none">0</span>
              </button>

              {/* ── User Dropdown / Login Action ── */}
              {userInfo ? (
                <div className="relative top-bar-user-dropdown-container">
                  <button
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-800 border border-white/10 hover:bg-primary-text text-white flex items-center justify-center transition-all duration-300 font-bold font-jakarta text-xs sm:text-sm cursor-pointer shadow-sm hover:shadow-[0_4px_12px_rgba(255,134,21,0.15)]"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    title="User Account"
                    aria-label="User Account"
                  >
                    {getInitials()}
                  </button>

                  <div
                    className={`absolute right-0 mt-3 w-60 bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/[0.08] py-3.5 px-4 z-50 transition-all duration-300 origin-top-right ${
                      userDropdownOpen ? 'opacity-100 visible scale-100 translate-y-0' : 'opacity-0 invisible scale-95 -translate-y-2'
                    }`}
                  >
                    <div className="pb-2.5 mb-2 border-b border-white/[0.08]">
                      <span className="block text-[9px] uppercase tracking-wider text-slate-400 font-extrabold mb-0.5">Logged in as</span>
                      <span className="block font-jakarta font-bold text-white text-sm truncate">
                        {userInfo.firstname} {userInfo.lastname}
                      </span>
                      <span className="block text-[11px] text-slate-400 truncate mt-0.5">{userInfo.email}</span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-primary-text hover:bg-white/[0.03] transition-colors uppercase tracking-wider"
                      >
                        <RiUserSettingsLine size={16} />
                        <span>My Profile</span>
                      </Link>

                      {userInfo.role === 'admin' && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-primary-text hover:bg-white/[0.03] transition-colors uppercase tracking-wider"
                        >
                          <RiUserSettingsLine size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}

                      <button
                        onClick={logoutHandler}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 transition-colors uppercase tracking-wider text-left cursor-pointer"
                      >
                        <RiLoginBoxLine size={16} />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <Link
                    to="/Register"
                    className="hidden sm:flex items-center justify-center px-5 py-2.5 bg-slate-800 hover:bg-primary-text text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all border border-white/10 hover:border-transparent hover:shadow-[0_4px_12px_rgba(255,134,21,0.15)]"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/Register"
                    className="sm:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:border-primary-text hover:text-primary-text hover:bg-white/[0.03] transition-all cursor-pointer"
                    title="Sign In"
                  >
                    <RiUserLine size={18} className="sm:hidden" />
                    <RiUserLine size={20} className="hidden sm:block" />
                  </Link>
                </>
              )}

              <button
                className="lg:hidden w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:border-primary-text hover:text-primary-text hover:bg-white/[0.03] transition-all cursor-pointer"
                title="Menu"
                aria-label="Menu"
                onClick={() => setMobileMenuOpen(true)}
              >
                <RiMenuLine size={18} className="sm:hidden" />
                <RiMenuLine size={20} className="hidden sm:block" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── 3. Search overlay (Cream/White Theme) ── */}
      <div className={`fixed inset-0 z-[2000] bg-slate-950/95 backdrop-blur-xl transition-all duration-500 ease-smooth flex items-center justify-center p-5 ${searchOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible scale-105'
        }`}>
        <div className="w-full max-w-[800px] relative">
          <div className="flex items-center gap-4 bg-slate-900 border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl">
            <RiSearchLine size={24} className="text-primary-text shrink-0" />
            <form onSubmit={handleSearchSubmit} className="flex-grow flex">
              <input
                ref={searchInputRef}
                className="w-full bg-transparent border-none outline-none text-xl sm:text-2xl font-bold text-white placeholder:text-slate-500"
                type="text"
                placeholder="Search cars, brands, categories..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </form>
            <button
              className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors shrink-0"
              onClick={toggleSearch}
              aria-label="Close search"
            >
              <RiCloseLine size={28} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {searchVal.trim() && (
            <div className="absolute top-full left-0 w-full mt-4 bg-slate-900 border border-white/[0.08] rounded-2xl overflow-hidden shadow-2xl animate-fadeInScale z-50">
              {suggestions.length > 0 ? (
                suggestions.map((car) => (
                  <div
                    key={car._id}
                    className="flex items-center gap-4 p-4 hover:bg-white/[0.02] cursor-pointer transition-colors border-b border-white/[0.05] last:border-none group"
                    onClick={() => handleSuggestionClick(car)}
                  >
                    <img src={car.image} alt={car.name} className="w-16 h-10 object-contain rounded-lg bg-slate-950 p-1 border border-white/[0.05]" />
                    <div className="flex-grow">
                      <span className="block text-slate-200 font-bold">{car.name}</span>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="uppercase tracking-widest font-semibold">{car.category}</span>
                        <span className="w-1 h-1 rounded-full bg-primary-text/40"></span>
                        <span className="text-primary-text font-black">${car.pricePerDay}/day</span>
                      </div>
                    </div>
                    <RiArrowRightLine className="text-slate-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-slate-400 italic font-medium">No matches found for "{searchVal}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. Mobile Sidebar Backdrop Overlay ── */}
      <div
        className={`fixed inset-0 z-[1999] bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* ── 5. Mobile Navigation Sidebar Drawer (Left Side, Dark Slate Background) ── */}
      <div
        className={`fixed top-0 left-0 h-screen w-[360px] max-w-[85vw] bg-slate-950 border-r border-white/[0.08] z-[2000] shadow-2xl flex flex-col p-6 transition-transform duration-300 ease-smooth ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header (Fixed at top) */}
        <div className="flex items-center justify-between pb-5 border-b border-white/[0.08] mb-4 shrink-0">
          <Link to="/" className="flex items-center no-underline gap-2 shrink-0 group" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 bg-primary-text flex items-center justify-center text-white text-lg [clip-path:polygon(12%_0%,88%_0%,100%_12%,100%_88%,88%_100%,12%_100%,0%_88%,0%_12%)]">
              <RiCarLine />
            </div>
            <div className="flex flex-col">
              <span className="font-bebas text-xl tracking-widest text-white leading-none uppercase">Auto<span className="text-primary-text">X</span></span>
              <span className="text-[6px] tracking-[2.5px] text-slate-400 uppercase font-bold mt-0.5">Premium Rentals</span>
            </div>
          </Link>
          <button
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/[0.05] transition-colors shrink-0 outline-none focus:outline-none"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <RiCloseLine size={24} />
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="flex-grow overflow-y-auto py-2 pr-1 space-y-6 scrollbar-thin">

          {/* User context card inside mobile drawer */}
          {userInfo && (
            <div className="flex items-center gap-3.5 p-4 bg-white/[0.02] rounded-2xl border border-white/[0.06] shrink-0">
              <div className="w-11 h-11 rounded-full bg-white/10 text-white flex items-center justify-center font-bold font-jakarta text-sm shrink-0">
                {getInitials()}
              </div>
              <div className="flex-grow min-w-0">
                <span className="block font-jakarta font-bold text-white text-sm truncate leading-snug">
                  {userInfo.firstname} {userInfo.lastname}
                </span>
                <span className="block text-[11px] text-slate-400 truncate leading-none mt-0.5">
                  {userInfo.email}
                </span>
              </div>
            </div>
          )}

          {/* Description Text */}
          <p className="text-slate-400 font-medium text-[14px] leading-relaxed px-1 font-jakarta">
            Premium car rentals with transparent pricing and exceptional service.
          </p>

          {/* Sidebar Content Links (Accordion Style) */}
          <nav className="flex flex-col gap-1 border-t border-white/[0.08] pt-4">
            {NAV_ITEMS.map((item, idx) => {
              const hasSub = !!item.submenu;
              const isOpen = expandedItem === item.label;

              return (
                <div key={idx} className="border-b border-white/[0.05] last:border-none py-1.5">
                  {hasSub ? (
                    <div>
                      <button
                        onClick={() => toggleExpand(item.label)}
                        className={`w-full flex items-center justify-between py-2 text-sm font-bold transition-colors uppercase tracking-wider text-left outline-none focus:outline-none ${
                          isOpen ? 'text-primary-text' : 'text-slate-300 hover:text-primary-text'
                        }`}
                      >
                        <span>{item.label}</span>
                        <RiArrowDownSLine
                          size={16}
                          className={`text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-text' : ''}`}
                        />
                      </button>
                      {/* Collapsible Submenu */}
                      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60 mt-1 mb-2' : 'max-h-0'}`}>
                        <div className="pl-4 flex flex-col gap-2.5 border-l-2 border-white/10 ml-1">
                          {item.submenu.map((sub, sIdx) => (
                            <Link
                              key={sIdx}
                              to={sub.href}
                              className={`block py-0.5 text-xs font-bold transition-colors uppercase tracking-wider outline-none focus:outline-none ${
                                activeNav === sub.href
                                  ? 'text-primary-text'
                                  : 'text-slate-400 hover:text-primary-text'
                              }`}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {sub.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`block py-2 text-sm font-bold transition-colors uppercase tracking-wider outline-none focus:outline-none ${
                        activeNav === item.href
                          ? 'text-primary-text'
                          : 'text-slate-300 hover:text-primary-text'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Mobile Profile Actions */}
          {userInfo && (
            <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-1.5">
              <Link
                to="/profile"
                className="flex items-center gap-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-primary-text transition-colors uppercase tracking-wider outline-none focus:outline-none"
                onClick={() => setMobileMenuOpen(false)}
              >
                <RiUserSettingsLine size={16} />
                <span>My Profile</span>
              </Link>
              {userInfo.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-2.5 py-1.5 text-xs font-bold text-slate-400 hover:text-primary-text transition-colors uppercase tracking-wider outline-none focus:outline-none"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <RiUserSettingsLine size={16} />
                  <span>Admin Panel</span>
                </Link>
              )}
              <button
                onClick={() => {
                  logoutHandler();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2.5 py-1.5 text-xs font-bold text-rose-500 hover:text-rose-400 transition-colors uppercase tracking-wider text-left cursor-pointer outline-none focus:outline-none"
              >
                <RiLoginBoxLine size={16} />
                <span>Log Out</span>
              </button>
            </div>
          )}

          {/* Contact Info */}
          <div className="pt-5 border-t border-white/[0.08]">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 font-jakarta">Contact</h3>
            <div className="flex flex-col gap-3 text-[13px] text-slate-300 font-jakarta">
              <p className="leading-none">
                Call: <a href="tel:+18558079484" className="font-extrabold text-slate-200 hover:text-primary-text transition-colors">+1 855 - 807 9484</a>
              </p>
              <p className="leading-none">
                Email: <a href="mailto:support@autox.com" className="font-extrabold text-primary-text hover:underline transition-colors">support@autox.com</a>
              </p>
              <div className="leading-snug mt-1">
                <span className="text-slate-500 uppercase text-xs font-black tracking-wider block mb-1">Address:</span>
                <span className="block font-semibold text-slate-200">123 Luxury Drive, Beverly Hills, CA 90210</span>
              </div>
            </div>
          </div>

          {/* Social Section */}
          <div className="pt-5 border-t border-white/[0.08]">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3 font-jakarta">Social</h3>
            <div className="flex flex-col gap-2.5">
              <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-300 hover:text-primary-text transition-colors group outline-none focus:outline-none">
                <span className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:bg-primary-text group-hover:text-white transition-all shrink-0">
                  <RiFacebookFill size={16} />
                </span>
                <span>Facebook</span>
              </a>
              <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-300 hover:text-primary-text transition-colors group outline-none focus:outline-none">
                <span className="w-8 h-8 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-slate-400 group-hover:bg-primary-text group-hover:text-white transition-all shrink-0">
                  <RiTwitterXFill size={16} />
                </span>
                <span>Twitter/X</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Actions (Cart, Search Box) */}
        <div className="pt-5 border-t border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
          <button
            className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-slate-300 hover:border-primary-text hover:text-primary-text hover:bg-white/[0.02] transition-all relative shrink-0 cursor-pointer outline-none focus:outline-none"
            title="Cart"
            onClick={() => {
              setMobileMenuOpen(false);
              navigate('/Fleet');
            }}
          >
            <RiShoppingCartLine size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-text text-white text-[10px] rounded-full flex items-center justify-center font-bold leading-none">0</span>
          </button>

          <form onSubmit={handleMobileSearchSubmit} className="relative flex-grow">
            <input
              type="text"
              placeholder="Search for anything"
              value={mobileSearchVal}
              onChange={(e) => setMobileSearchVal(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-5 pr-10 py-3.5 text-[11px] font-bold text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary-text/60 focus:bg-transparent transition-all"
            />
            <button type="submit" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-text transition-colors cursor-pointer outline-none focus:outline-none">
              <RiSearchLine size={16} />
            </button>
          </form>
        </div>

      </div>
    </header>

  );
};

export default Header;
