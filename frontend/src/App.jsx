import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./config/api";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import LatestResources from "./components/LatestResources";
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/current_user`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then(data => {
        if (data && typeof data === 'object') {
          setUser(data);
        }
      })
      .catch(err => {
        console.error("Error fetching user:", err);
        setUser(null);
      });
  }, []);

  return (
    <>
      <Navbar user={user} onNavigate={setCurrentView} />
      <main>
        {currentView === 'home' ? (
          <>
            <Hero user={user} />
            <Categories />
            <LatestResources />
          </>
        ) : (
          <Profile user={user} />
        )}
      </main>
      <Footer />
    </>
  );
}
