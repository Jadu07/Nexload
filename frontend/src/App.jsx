import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { API_BASE_URL } from "./config/api";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import CategoryPage from "./components/CategoryPage";
import LatestResources from "./components/LatestResources";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
        color: '#fff'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <ScrollToTop />
      <Navbar user={user} />
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <Hero user={user} />
              <Categories />
              <LatestResources />
            </>
          } />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/templates" element={<CategoryPage categoryId="templates" />} />
          <Route path="/books" element={<CategoryPage categoryId="books" />} />
          <Route path="/icons" element={<CategoryPage categoryId="icons" />} />
          <Route path="/tools" element={<CategoryPage categoryId="tools" />} />
          <Route path="/fonts" element={<CategoryPage categoryId="fonts" />} />
          <Route path="/themes" element={<CategoryPage categoryId="themes" />} />
          <Route path="/plugins" element={<CategoryPage categoryId="plugins" />} />
          <Route path="/graphics" element={<CategoryPage categoryId="graphics" />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
