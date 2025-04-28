import React from "react";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import LatestResources from "./components/LatestResources";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <main>
        <Hero />
        <Categories />
        <LatestResources />
      </main>
      <Footer />
    </>
  );
}
