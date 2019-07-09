import React from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import Footer from "./Footer";
import "./App.css";
import LandingPage from "./landingPage/LandingPage.js"

function App() {
  return (
    <div className="App">
      <LandingPage />
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
}

export default App;
