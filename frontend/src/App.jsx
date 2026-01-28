import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "./config/api";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import LatestResources from "./components/LatestResources";
import Footer from "./components/Footer";

export default function App() {
  const [user, setUser] = useState(null);

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
      <main>
        <Hero user={user} />
        <Categories />
        <LatestResources />
      </main>
      <Footer />
    </>
  );
}
