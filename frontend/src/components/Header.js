import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { useGetCarsQuery } from '../slices/carsApiSlice';
import {
  RiCarLine,
  RiMenuFoldLine,
  RiUserLine,
  RiSearchLine,
  RiBellLine,
  RiArrowRightLine,
  RiCloseLine,
  RiLoginBoxLine,
  RiHistoryLine,
  RiUserSettingsLine,
} from 'react-icons/ri';

const NAV_ITEMS = [
  { label: 'Home',          href: '/'   },
  { label: 'Explore Fleet', href: '/Fleet' },
  { label: 'Gallery',       href: '/Gallery' },
  { label: 'Help Center',   href: '/Help'   },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const { data: cars } = useGetCarsQuery();

  const [scrolled,   setScrolled]   = useState(false);
  const [activeNav,  setActiveNav]  = useState(location.pathname);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal,  setSearchVal]  = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
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

  /* sync active nav with URL */
  useEffect(() => {
    setActiveNav(location.pathname);
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
      if (!e.target.closest('.user-dropdown-container')) {
        setUserDropdownOpen(false);
      }
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const handleNavClick = (href) => setActiveNav(href);

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

  const handleSuggestionClick = (car) => {
    navigate(`/car/${car._id}`);
    setSearchOpen(false);
    setSearchVal('');
  };

  const toggleUserDropdown = (e) => {
    e.stopPropagation();
    setUserDropdownOpen(!userDropdownOpen);
  };

  const logoutHandler = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[1050] transition-all duration-300 font-dm border-b border-x-border ${
        scrolled ? 'bg-x-bg/95 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.5)]' : 'bg-x-bg/80 backdrop-blur-md'
      }`}
    >
      {/* ── Search overlay ── */}
      <div className={`fixed inset-0 z-[2000] bg-x-bg/98 backdrop-blur-2xl transition-all duration-500 ease-smooth flex items-center justify-center p-5 ${
        searchOpen ? 'opacity-100 pointer-events-auto visible' : 'opacity-0 pointer-events-none invisible scale-105'
      }`}>
        <div className="w-full max-w-[800px] relative">
          <div className="flex items-center gap-4 bg-white/[0.03] border border-x-border rounded-2xl p-5 shadow-2xl">
            <RiSearchLine size={24} className="text-x-primary shrink-0" />
            <form onSubmit={handleSearchSubmit} className="flex-grow flex">
              <input
                ref={searchInputRef}
                className="w-full bg-transparent border-none outline-none text-2xl font-medium text-x-text placeholder:text-x-text-muted"
                type="text"
                placeholder="Search cars, brands, categories..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
              />
            </form>
            <button 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-x-text hover:bg-white/10 transition-colors shrink-0" 
              onClick={toggleSearch} 
              aria-label="Close search"
            >
              <RiCloseLine size={28} />
            </button>
          </div>

          {/* Suggestions Dropdown */}
          {searchVal.trim() && (
            <div className="absolute top-full left-0 w-full mt-4 bg-x-surface border border-x-border rounded-2xl overflow-hidden shadow-2xl animate-fadeInScale">
              {suggestions.length > 0 ? (
                suggestions.map((car) => (
                  <div
                    key={car._id}
                    className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/[0.05] last:border-none"
                    onClick={() => handleSuggestionClick(car)}
                  >
                    <img src={car.image} alt={car.name} className="w-16 h-10 object-contain rounded-lg bg-white/5 p-1" />
                    <div className="flex-grow">
                      <span className="block text-x-text font-semibold">{car.name}</span>
                      <div className="flex items-center gap-3 text-xs text-x-text-muted">
                        <span className="uppercase tracking-widest">{car.category}</span>
                        <span className="w-1 h-1 rounded-full bg-x-primary/40"></span>
                        <span className="text-x-primary font-bold">${car.pricePerDay}/day</span>
                      </div>
                    </div>
                    <RiArrowRightLine className="text-x-text-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-x-text-muted italic">No matches found for "{searchVal}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Navbar expand="lg" className="py-3 lg:py-4">
        <Container fluid="xl">

          {/* ── Logo ── */}
          <Navbar.Brand as={Link} to="/" className="flex items-center no-underline gap-0 shrink-0 p-0 hover:opacity-90 transition-opacity">
            <div className="flex items-center justify-center w-10 min-w-[40px] h-10 bg-x-primary [clip-path:polygon(12%_0%,88%_0%,100%_12%,100%_88%,88%_100%,12%_100%,0%_88%,0%_12%)] mr-2.5 transition-all duration-500 hover:bg-x-accent">
              <RiCarLine size={20} color="#fff" />
            </div>
            <div className="flex flex-col">
              <span className="font-bebas text-[1.6rem] tracking-[3px] text-x-text leading-none whitespace-nowrap uppercase">
                Auto<span className="text-x-primary">X</span>
              </span>
              <span className="text-[0.55rem] tracking-[3.5px] uppercase text-x-text-muted mt-0.5 whitespace-nowrap font-medium">Premium Rentals</span>
            </div>
          </Navbar.Brand>

          {/* ── Mobile right side ── */}
          <div className="flex items-center lg:hidden gap-2">
            <button 
              className="w-9 h-9 rounded-lg border border-x-border flex items-center justify-center text-x-text-muted hover:border-x-primary hover:text-x-primary transition-all" 
              onClick={toggleSearch} 
              aria-label="Search"
            >
              <RiSearchLine size={18} />
            </button>

            {/* Mobile User Icon with Dropdown */}
            <div className="relative user-dropdown-container">
              <button 
                className={`w-9 h-9 rounded-lg border border-x-border flex items-center justify-center transition-all ${
                  userDropdownOpen ? 'border-x-primary text-x-primary bg-x-primary/10' : 'text-x-text-muted hover:border-x-primary hover:text-x-primary'
                }`} 
                onClick={toggleUserDropdown}
              >
                <RiUserLine size={18} />
              </button>
              {userDropdownOpen && (
                <div className="absolute top-full right-0 mt-3 w-64 bg-x-surface border border-x-border rounded-2xl p-2.5 shadow-2xl z-[1000] animate-fadeInScale">
                  {!userInfo ? (
                    <Link to="/Register" className="flex items-center gap-3 px-4 py-3 text-x-text-muted hover:text-x-primary hover:bg-white/5 rounded-xl transition-all font-medium" onClick={() => setUserDropdownOpen(false)}>
                      <RiLoginBoxLine size={20} /> Register / Login
                    </Link>
                  ) : (
                    <>
                      <div className="px-4 py-3 mb-1 border-b border-white/[0.05]">
                        <span className="block text-x-text font-bold text-sm truncate">{userInfo.firstname} {userInfo.lastname}</span>
                        <span className="block text-x-text-muted text-[10px] truncate">{userInfo.email}</span>
                      </div>
                      <Link to="/profile" className="flex items-center gap-3 px-4 py-3 text-x-text-muted hover:text-x-primary hover:bg-white/5 rounded-xl transition-all font-medium" onClick={() => setUserDropdownOpen(false)}>
                        <RiUserSettingsLine size={20} /> Profile
                      </Link>
                      <div className="h-px bg-white/[0.05] my-1" />
                      <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all font-medium" onClick={logoutHandler}>
                        <RiLoginBoxLine size={20} /> Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Navbar.Toggle aria-controls="autox-nav" className="border-none p-0 !shadow-none outline-none group">
              <div className="w-9 h-9 rounded-lg border border-x-border flex items-center justify-center text-x-text group-aria-expanded:bg-x-primary group-aria-expanded:border-x-primary">
                <RiMenuFoldLine size={22} />
              </div>
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="autox-nav">

            {/* ── Nav ── */}
            <Nav className="mx-auto flex items-center gap-0.5 lg:gap-1 py-4 lg:py-0">
              {NAV_ITEMS.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i === 3 && <div className="hidden lg:block w-px h-[18px] bg-x-border mx-1.5" />}
                  <Nav.Link
                    as={Link}
                    to={item.href}
                    className={`relative px-4 py-2 text-[0.8rem] tracking-wider uppercase font-semibold transition-all duration-300 rounded-lg hover:bg-white/5 active:scale-95 ${
                      activeNav === item.href ? 'text-x-primary' : 'text-x-text-muted hover:text-x-text'
                    }`}
                  >
                    {item.label}
                    {activeNav === item.href && (
                      <span className="absolute bottom-1 left-1.2 right-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-x-primary" />
                    )}
                  </Nav.Link>
                </React.Fragment>
              ))}
            </Nav>

            {/* ── Auth Cluster ── */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-2.5">

              <button
                className="hidden lg:flex w-[38px] h-[38px] rounded-xl border border-x-border items-center justify-center text-x-text-muted hover:border-x-primary-active hover:text-x-primary hover:bg-x-primary-glow transition-all"
                title="Search"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <RiSearchLine size={18} />
              </button>

              {/* Desktop User Dropdown */}
              <div className="hidden lg:block relative user-dropdown-container">
                <button 
                  className={`w-[38px] h-[38px] rounded-xl border border-x-border flex items-center justify-center transition-all ${
                    userDropdownOpen ? 'border-x-primary text-x-primary bg-x-primary-glow' : 'text-x-text-muted hover:border-x-primary-active hover:text-x-primary hover:bg-x-primary-glow'
                  }`} 
                  onClick={toggleUserDropdown}
                >
                  <RiUserLine size={18} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute top-full right-0 mt-4 w-72 bg-x-surface border border-x-border rounded-2xl p-2 shadow-2xl z-[1000] animate-fadeInScale">
                    {!userInfo ? (
                      <Link to="/Register" className="flex items-center gap-3 px-4 py-3.5 text-x-text-muted hover:text-x-primary hover:bg-white/5 rounded-xl transition-all font-semibold uppercase tracking-wider text-xs" onClick={() => setUserDropdownOpen(false)}>
                        <RiLoginBoxLine size={18} className="text-x-primary" /> Register / Login
                      </Link>
                    ) : (
                      <>
                        <div className="px-4 py-4 mb-1 border-b border-white/[0.05] bg-white/[0.02] rounded-t-xl">
                          <span className="block text-x-text font-bold text-sm tracking-tight truncate leading-tight">{userInfo.firstname} {userInfo.lastname}</span>
                          <span className="block text-x-text-muted text-[10px] mt-1 tracking-wider truncate uppercase">{userInfo.email}</span>
                        </div>
                        <div className="p-1">
                          <Link to="/profile" className="flex items-center gap-3 px-3.5 py-3 text-x-text-muted hover:text-x-primary hover:bg-x-primary-glow rounded-lg transition-all font-semibold uppercase tracking-wider text-[10px]" onClick={() => setUserDropdownOpen(false)}>
                            <RiUserSettingsLine size={18} className="text-x-primary" /> User Profile
                          </Link>
                          {/* <Link to="/bookings" className="flex items-center gap-3 px-3.5 py-3 text-x-text-muted hover:text-x-primary hover:bg-x-primary-glow rounded-lg transition-all font-semibold uppercase tracking-wider text-[10px]" onClick={() => setUserDropdownOpen(false)}>
                            <RiHistoryLine size={18} className="text-x-primary" /> Rent History
                          </Link> */}
                          <div className="h-px bg-white/[0.05] my-1" />
                          <button className="w-full flex items-center gap-3 px-3.5 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all font-semibold uppercase tracking-wider text-[10px]" onClick={logoutHandler}>
                            <RiLoginBoxLine size={18} /> Logout Session
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link to="/Fleet" className="flex items-center justify-center gap-2.5 bg-x-primary text-white font-bold text-[0.8rem] tracking-wider uppercase px-6 py-[11px] rounded-xl transition-all hover:bg-x-accent hover:text-x-bg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(221,111,39,0.35)] active:translate-y-0 no-underline whitespace-nowrap">
                Rent A Car
                <RiArrowRightLine size={16} />
              </Link>

            </div>

          </Navbar.Collapse>

        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
