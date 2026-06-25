import React, { useState, useEffect } from 'react';
import Login from './Login';
import Logo from '../components/Logo';
import ContactForm from '../components/ContactForm';
import { RecentAnnouncementsWidget } from '../components/Announcements';

const COLORS = {
  primary: 'from-cyan-500 to-blue-600',
  accent: 'from-pink-400 to-orange-400',
  card: 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white /70 dark:bg-gray-900/70',
  text: 'text-gray-800 dark:text-gray-100',
  button: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white',
  buttonAccent: 'bg-gradient-to-r from-pink-400 to-orange-400 text-white',
};

const Hero = ({ onLoginClick, darkMode, toggleDarkMode }) => (
  <section className={`relative flex flex-col items-center justify-center bg-dark transition-colors duration-500 overflow-hidden ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-cyan-50 via-blue-100 to-cyan-100'}`}
    style={{ position: 'relative' }}>
    {/* Animated background blobs */}

    <div className="top-4 right-4 flex items-center gap-2 z-10">
      <button
        onClick={toggleDarkMode}
        className="rounded-full p-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white /80 dark:bg-gray-800/80 shadow hover:scale-110 transition-transform focus:ring-2 focus:ring-cyan-400"
        aria-label="Toggle dark mode"
      >
        {darkMode ? (
          <svg className="w-6 h-6 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 4.95l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
        ) : (
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
        )}
      </button>
      <button
        onClick={onLoginClick}
        className={`rounded-full px-6 py-2 font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform duration-200 focus:ring-2 focus:ring-cyan-400 ${COLORS.button}`}
        style={{ boxShadow: '0 4px 24px 0 rgba(6,182,212,0.15)' }}
      >
        Login
      </button>
    </div>
   
    <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180" style={{height: '60px'}}>
      <svg viewBox="0 0 500 60" preserveAspectRatio="none" className="w-full h-full"><path d="M0,0 C150,60 350,0 500,60 L500,00 L0,0 Z" fill={darkMode ? '#111827' : '#e0f2fe'} /></svg>
    </div>
  </section>
);

const FeatureCard = ({ title, description, icon, accent, delay, darkMode }) => (
  <div
    className={`rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 transform hover:-translate-y-2 hover:shadow-2xl hover:ring-2 hover:ring-cyan-300 dark:hover:ring-cyan-600 transition-all duration-300 ${COLORS.card} animate-fade-in-up`}
    style={{ borderTop: `4px solid ${accent}`, animationDelay: `${delay}ms` }}
  >
    <div className="text-4xl mb-2 animate-bounce-slow">{icon}</div>
    <h3 className="text-xl font-bold mb-1 text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-center">{description}</p>
  </div>
);

const features = [
  {
    title: 'Student Management',
    description: 'Track, enroll, and manage students with ease.',
    icon: '🎓',
    accent: '#06b6d4',
  },
  {
    title: 'Parent Portal',
    description: 'Parents stay connected and informed.',
    icon: '👨‍👩‍👧‍👦',
    accent: '#f472b6',
  },
  {
    title: 'Teacher Tools',
    description: 'Empower teachers with smart tools.',
    icon: '🧑‍🏫',
    accent: '#f59e42',
  },
  {
    title: 'Attendance & Analytics',
    description: 'Real-time attendance and insights.',
    icon: '📊',
    accent: '#6366f1',
  },
  {
    title: 'Secure & Fast',
    description: 'Your data is safe and always available.',
    icon: '🔒',
    accent: '#10b981',
  },
  {
    title: 'Mobile Friendly',
    description: 'Works beautifully on any device.',
    icon: '📱',
    accent: '#fbbf24',
  },
];

function RpmNavbar({ darkMode, toggleDarkMode, onLoginClick }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on link click (mobile)
  const handleLinkClick = () => {
    setMenuOpen(false);
    setDropdownOpen(null);
  };

  // Dropdown open on hover (desktop), on click (mobile)
  const handleDropdown = (idx) => {
    if (window.innerWidth < 768) {
      setDropdownOpen(dropdownOpen === idx ? null : idx);
    }
  };

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white dark:bg-gray-900 shadow-lg' : 'bg-white dark:bg-gray-900'}`}>
      <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-2">
        <a className="flex items-center gap-2" href="/">
          <Logo size={60} showText={true} />
        </a>
        <button className="md:hidden text-3xl text-gray-700 dark:text-gray-200 focus:outline-none" onClick={() => setMenuOpen(!menuOpen)}>&#9776;</button>
        {/* Overlay for mobile menu */}
        {menuOpen && <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMenuOpen(false)} />}
        <div className={`flex-col md:flex-row md:flex items-center gap-2 md:gap-4 bg-white dark:bg-gray-900 md:bg-transparent md:dark:bg-transparent rounded-lg md:rounded-none shadow md:shadow-none absolute md:static top-20 left-0 w-full md:w-auto transition-all duration-300 z-50 ${menuOpen ? 'flex' : 'hidden md:flex'}`}>
          <ul className="flex flex-col md:flex-row gap-1 md:gap-2 items-center font-medium text-gray-700 dark:text-gray-200">
            <li><a href="/" className="relative px-4 py-2 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white" onClick={handleLinkClick}>Overview</a></li>
            <li className="relative group">
              <button
                className="flex items-center gap-1 px-4 py-2 w-[117px] rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white"
                onClick={() => handleDropdown(0)}
                onMouseEnter={() => window.innerWidth >= 768 && setDropdownOpen(0)}
                onMouseLeave={() => window.innerWidth >= 768 && setDropdownOpen(null)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen === 0}
              >
                About Us <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <ul className={`absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[180px] z-20 ${dropdownOpen === 0 ? 'block' : 'hidden'} group-hover:block`}>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>About College</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>About University</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Our Leaders</a></li>
              </ul>
            </li>
            {/* Courses dropdown removed as per previous user edit */}
            <li className="relative group">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white"
                onClick={() => handleDropdown(2)}
                onMouseEnter={() => window.innerWidth >= 768 && setDropdownOpen(2)}
                onMouseLeave={() => window.innerWidth >= 768 && setDropdownOpen(null)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen === 2}
              >
                Admission <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <ul className={`absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[180px] z-20 ${dropdownOpen === 2 ? 'block' : 'hidden'} group-hover:block`}>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Admission Procedure</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Admission Form</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Admission Intake</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Admission Scholarship</a></li>
              </ul>
            </li>
            <li className="relative group">
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white"
                onClick={() => handleDropdown(3)}
                onMouseEnter={() => window.innerWidth >= 768 && setDropdownOpen(3)}
                onMouseLeave={() => window.innerWidth >= 768 && setDropdownOpen(null)}
                aria-haspopup="true"
                aria-expanded={dropdownOpen === 3}
              >
                Explore R.P.M.School <svg width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6" /></svg>
              </button>
              <ul className={`absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 min-w-[180px] z-20 ${dropdownOpen === 3 ? 'block' : 'hidden'} group-hover:block`}>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Our Club</a></li>
                <li><a href="#/about-us" className="block px-4 py-2 hover:bg-red-100 dark:hover:bg-red-900 rounded" onClick={handleLinkClick}>Our Blog</a></li>
              </ul>
            </li>
            <li><a href="/vacancy-view" className="relative px-4 py-2 rounded-md transition-colors duration-200 hover:bg-red-600 hover:text-white" onClick={handleLinkClick}>Career</a></li>
            <li><a href="#contact" className="hover:text-blue-600 transition">Contact</a></li>
          </ul>
          <button
            onClick={toggleDarkMode}
            className="ml-4 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun h-5 w-5 text-yellow-400" aria-hidden="true"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon h-5 w-5 text-gray-700 dark:text-yellow-300" aria-hidden="true"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
            )}
          </button>
          <button onClick={onLoginClick} className=" px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold shadow hover:from-cyan-600 hover:to-blue-700 transition">Login</button>
        </div>
      </nav>
    </header>
  );
}

const Dashboard = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log('darkMode:', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (showLogin) return <Login onClose={() => setShowLogin(false)} />;

  return (
    <div>
      <RpmNavbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(dm => !dm)} onLoginClick={() => setShowLogin(true)} />
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition-colors duration-500 pt-24">
        <div id="index-page" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          {/* Header Section */}
          {/* Hero Section */}
          <section className="relative flex flex-col items-center justify-center min-h-[60vh] py-20 px-4 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/60 via-cyan-400/40 to-pink-400/30 blur-2xl z-0" />
            <div className="relative z-10">
              <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-cyan-500 via-blue-600 to-pink-400 bg-clip-text text-transparent drop-shadow-lg mb-4 tracking-tight">Welcome to R.P.M.School</h1>
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-200 max-w-2xl mx-auto mb-8">A modern, all-in-one platform for schools, students, parents, and teachers. Experience seamless management, beautiful design, and powerful features.</p>
              <a href="#about" className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-700 transition">Learn More</a>
            </div>
          </section>

 {/* Announcements Section */}
          <section id="announcements" className="max-w-7xl mx-auto my-16 px-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8">
              <RecentAnnouncementsWidget maxItems={3} />
            </div>
          </section>
          
          {/* About Section */}
          <section id="about" className="max-w-5xl mx-auto my-16 px-4">
            <div className="bg-white/80 dark:bg-gray-800/80 rounded-3xl shadow-2xl p-10 flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">About <span className="text-yellow-500">R.P.M.School</span></h2>
                <p className="text-gray-700 dark:text-gray-200 text-lg mb-4">
                  R.P.M.School, located in New Baneshwor, Kathmandu, provides modern facilities, emphasizing a conducive learning environment. In 2017, the school partnered with the Asia Pacific University of Technology and Innovation (APU), offering world-class tech and business education in Nepal. This collaboration ensures international exposure and prepares students for dynamic and competitive industries in IT and business. R.P.M.School facilitates tech learning through partnership with Code Himalaya, one of Nepal's rapidly expanding IT enterprises.
                </p>
                <a href="" className="text-blue-600 hover:underline font-semibold">More About Us</a>
              </div>
            </div>
          </section>

          {/* Why Us Section */}
          <section id="why-us" className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 text-center mb-10">Why Choose R.P.M.School?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {features.map((feature, index) => (
                <FeatureCard
                  key={index}
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  accent={feature.accent}
                  delay={index * 100}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </section>

         

          {/* Partners Section */}
          <section id="partners" className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 text-center mb-10">Our Partners</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg">
                <img src="https://via.placeholder.com/150" alt="Partner 1" className="w-24 h-24 object-contain" />
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">APU</h4>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg">
                <img src="https://via.placeholder.com/150" alt="Partner 2" className="w-24 h-24 object-contain" />
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">Code Himalaya</h4>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg">
                <img src="https://via.placeholder.com/150" alt="Partner 3" className="w-24 h-24 object-contain" />
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">Nepal Government</h4>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-lg">
                <img src="https://via.placeholder.com/150" alt="Partner 4" className="w-24 h-24 object-contain" />
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">International Schools</h4>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section id="events" className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 text-center mb-10">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">School Annual Day</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4">Date: 15th December 2023</p>
                <p className="text-gray-700 dark:text-gray-200">Location: R.P.M.School Auditorium</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Parent-Teacher Meeting</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4">Date: 20th December 2023</p>
                <p className="text-gray-700 dark:text-gray-200">Location: R.P.M.School Conference Room</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Sports Day</h3>
                <p className="text-gray-700 dark:text-gray-200 mb-4">Date: 25th December 2023</p>
                <p className="text-gray-700 dark:text-gray-200">Location: R.P.M.School Sports Ground</p>
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section id="testimonials" className="max-w-7xl mx-auto my-16 px-4">
            <h2 className="text-4xl font-bold text-blue-700 dark:text-blue-400 text-center mb-10">What Parents Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <p className="text-gray-700 dark:text-gray-200 text-lg mb-4">"R.P.M.School has been a fantastic experience for our child. The teachers are highly qualified and the school environment is conducive to learning."</p>
                <p className="text-gray-700 dark:text-gray-200 font-semibold">- John Doe, Parent</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <p className="text-gray-700 dark:text-gray-200 text-lg mb-4">"The school's focus on technology and innovation is impressive. My child is thriving in this environment."</p>
                <p className="text-gray-700 dark:text-gray-200 font-semibold">- Jane Smith, Parent</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
                <p className="text-gray-700 dark:text-gray-200 text-lg mb-4">"R.P.M.School's commitment to student well-being and academic excellence is evident."</p>
                <p className="text-gray-700 dark:text-gray-200 font-semibold">- Michael Brown, Parent</p>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="max-w-7xl mx-auto my-16 px-4">
            <ContactForm />
          </section>

          {/* Footer */}
          <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 py-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16">
              <div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">R.P.M.School</h3>
                <p className="text-gray-700 dark:text-gray-200">
                  R.P.M.School, located in New Baneshwor, Kathmandu, provides modern facilities, emphasizing a conducive learning environment.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Quick Links</h3>
                <ul className="space-y-3">
                  <li><a href="#about" className="hover:text-blue-600 transition">About Us</a></li>
                  <li><a href="#courses" className="hover:text-blue-600 transition">Courses</a></li>
                  <li><a href="#admission" className="hover:text-blue-600 transition">Admission</a></li>
                  <li><a href="#events" className="hover:text-blue-600 transition">Events</a></li>
                  <li><a href="#contact" className="hover:text-blue-600 transition">Contact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Contact Us</h3>
                <p className="text-gray-700 dark:text-gray-200">
                  New Baneshwor, Kathmandu, Nepal<br />
                  Email: r.p.m.school@gmail.com<br />
                  Phone: +9779819640182
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-400 mb-4">Follow Us</h3>
                <div className="flex gap-4">
                  <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"><i className="fab fa-facebook-f"></i></a>
                  <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"><i className="fab fa-twitter"></i></a>
                  <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"><i className="fab fa-instagram"></i></a>
                  <a href="#" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 transition"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
            <div className="mt-16 text-center text-gray-600 dark:text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} R.P.M.School. All rights reserved.
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 