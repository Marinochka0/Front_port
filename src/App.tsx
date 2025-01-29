
import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, NavLink } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const ThemeContext = createContext({ theme: 'dark', toggleTheme: () => {} });

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

const Header = () => {
  const { toggleTheme } = useTheme();

  return (
    <header>
      <nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/Skills'>Skills</NavLink>
        <NavLink to='/projects'>Projects</NavLink>
        <NavLink to='/contact'>Contact</NavLink>
      </nav>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </header>
  );
};

const Footer = () => (
  <footer>
    <p>&copy; 2025 Masik. All rights reserved.</p>
  </footer>
);

const Home = () => (
    <main className="home-container">
      <div className="text-content">
        <h1>Всем Приветик)</h1>
        <p>
          Меня зовут Марина и это мое портфолио)))
        </p>
      </div>
      <img src='/src/assets/fotoM.jpg' alt="Profile" className="profile-image" />
    </main>
  );

const About = () => (
  <main>
    <h1>Что-то про меня)</h1>
    <p>Я студентка, учусь на 3 курсе по специальности "Системное програмирование". Учеба не сильно нравится, планирую побыстрее закончить.</p>
  </main>
);

const Skills = () => (
  <main>
    <h1>Мои навыки</h1>
    <p>Pyton</p>
    <p>C++</p>
    <p>Vue</p>
    <p>React</p>
    <p>Django</p>
    <p>HTML/CSS</p>
  </main>
);

const Projects = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await axios.get('https://api.github.com/users/Marinochka0/repos');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching GitHub repositories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main>
      <h1>Projects</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <h2>{project.name}</h2>
              <p>{project.description}</p>
              <a href={project.html_url} target='_blank' rel='noopener noreferrer'>
                View on GitHub
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <main className="contact-container">
      <h1>Contact Me</h1>
      {submitted ? (
        <p className="success-message">Thank you for your message! I will get back to you soon.</p>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <input name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required className="input-field" />
          <input name="email" type="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required className="input-field" />
          <textarea name="message" placeholder="Your Message" value={formData.message} onChange={handleChange} required className="textarea-field" />
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      )}
    </main>
  );
};

const App = () => (
  <ThemeProvider>
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/Skills' element={<Skills />} />
        <Route path='/projects' element={<Projects />} />
        <Route path='/contact' element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  </ThemeProvider>
);

export default App;
