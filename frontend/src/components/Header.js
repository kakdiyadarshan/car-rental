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
import '../style/d_style.css';

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
      if (!e.target.closest('.d_user_dropdown_container')) {
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
      className="d_main_header_wrapper"
      style={{ boxShadow: scrolled ? '0 4px 40px rgba(0,0,0,0.5)' : 'none' }}
    >
      {/* ── Search overlay ── */}
      <div className={`d_search_overlay${searchOpen ? ' d_search_overlay--open' : ''}`}>
        <div className="d_search_inner" style={{ position: 'relative' }}>
          <RiSearchLine size={20} className="d_search_icon_inline" />
          <form onSubmit={handleSearchSubmit} style={{ flex: 1, display: 'flex' }}>
            <input
              ref={searchInputRef}
              className="d_search_input"
              type="text"
              placeholder="Search cars, brands, categories..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
            />
          </form>
          <button className="d_icon_btn" onClick={toggleSearch} aria-label="Close search">
            <RiCloseLine size={20} />
          </button>

          {/* Suggestions Dropdown */}
          {searchVal.trim() && (
            <div className="d_search_suggestions">
              {suggestions.length > 0 ? (
                suggestions.map((car) => (
                  <div
                    key={car._id}
                    className="d_suggestion_item"
                    onClick={() => handleSuggestionClick(car)}
                  >
                    <img src={car.image} alt={car.name} className="d_suggestion_img" />
                    <div className="d_suggestion_info">
                      <span className="d_suggestion_name">{car.name}</span>
                      <div className="d_suggestion_meta">
                        <span>{car.category}</span>
                        <span className="d_suggestion_price">${car.pricePerDay}/day</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="d_no_suggestions">No matches found for "{searchVal}"</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Navbar expand="lg">
        <Container fluid="xl">

          {/* ── Logo ── */}
          <Navbar.Brand as={Link} to="/" className="d_brand_container p-0">
            <div className="d_logo_badge">
              <RiCarLine size={20} color="#fff" />
            </div>
            <div className="d_logo_wordmark">
              <span className="d_logo_name">
                Auto<span>X</span>
              </span>
              <span className="d_logo_tagline">Premium Rentals</span>
            </div>
          </Navbar.Brand>

          {/* ── Mobile right side ── */}
          <div className="d-flex align-items-center d-lg-none gap-2">
            <button className="d_icon_btn" onClick={toggleSearch} aria-label="Search">
              <RiSearchLine size={18} />
            </button>

            {/* Mobile User Icon with Dropdown */}
            <div className="d_user_dropdown_container">
              <button className="d_icon_btn" onClick={toggleUserDropdown}>
                <RiUserLine size={18} />
              </button>
              {userDropdownOpen && (
                <div className="d_user_dropdown_menu">
                  {!userInfo ? (
                    <Link to="/Register" onClick={() => setUserDropdownOpen(false)}><RiLoginBoxLine /> Register / Login</Link>
                  ) : (
                    <>
                      <div className="d_user_dropdown_header">
                        <span className="d_user_name">{userInfo.firstname} {userInfo.lastname}</span>
                        <span className="d_user_email">{userInfo.email}</span>
                      </div>
                      <div className="d_dropdown_divider" />
                      <Link to="/profile" onClick={() => setUserDropdownOpen(false)}><RiUserSettingsLine /> Profile</Link>
                      {/* <Link to="/bookings" onClick={() => setUserDropdownOpen(false)}><RiHistoryLine /> My Bookings</Link> */}
                      <div className="d_dropdown_divider" />
                      <button className="d_dropdown_logout_btn" onClick={logoutHandler}><RiLoginBoxLine /> Logout</button>
                    </>
                  )}
                </div>
              )}
            </div>

            <Navbar.Toggle aria-controls="autox-nav">
              <RiMenuFoldLine size={22} color="var(--x-text)" />
            </Navbar.Toggle>
          </div>

          <Navbar.Collapse id="autox-nav">

            {/* ── Nav ── */}
            <Nav className="mx-auto d_nav_cluster">
              {NAV_ITEMS.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i === 3 && <div className="d_nav_divider d-none d-lg-block" />}
                  <div className="d_nav_item">
                    <Nav.Link
                      as={Link}
                      to={item.href}
                      className={`d_nav_link${activeNav === item.href ? ' active' : ''}`}
                    >
                      {item.label}
                    </Nav.Link>
                  </div>
                </React.Fragment>
              ))}
            </Nav>

            {/* ── Auth Cluster ── */}
            <div className="d_auth_cluster mt-3 mt-lg-0">

              <button
                className="d_icon_btn d-none d-lg-flex"
                title="Search"
                aria-label="Search"
                onClick={toggleSearch}
              >
                <RiSearchLine size={18} />
              </button>

              {/* <button
                className="d_icon_btn d-none d-lg-flex"
                title="Notifications"
                aria-label="Notifications"
              >
                <RiBellLine size={18} />
                <span className="d_notif_dot" />
              </button> */}

              {/* Desktop User Dropdown */}
              <div className="d_user_dropdown_container d-none d-lg-block">
                <button className="d_icon_btn" onClick={toggleUserDropdown}>
                  <RiUserLine size={18} />
                </button>
                {userDropdownOpen && (
                  <div className="d_user_dropdown_menu">
                    {!userInfo ? (
                      <Link to="/Register" onClick={() => setUserDropdownOpen(false)}><RiLoginBoxLine /> Register / Login</Link>
                    ) : (
                      <>
                        <div className="d_user_dropdown_header">
                          <span className="d_user_name">{userInfo.firstname} {userInfo.lastname}</span>
                          <span className="d_user_email">{userInfo.email}</span>
                        </div>
                        <div className="d_dropdown_divider" />
                        <Link to="/profile" onClick={() => setUserDropdownOpen(false)}><RiUserSettingsLine /> Profile</Link>
                        {/* <Link to="/bookings" onClick={() => setUserDropdownOpen(false)}><RiHistoryLine /> My Bookings</Link> */}
                        <div className="d_dropdown_divider" />
                        <button className="d_dropdown_logout_btn" onClick={logoutHandler}><RiLoginBoxLine /> Logout</button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <Link to="/Fleet" className="d_btn_cta">
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
