import { useEffect, useState } from 'react';
import HomeParagraph from './components/home/HomeParagraph';
import AboutParagraph from './components/about/AboutParagraph';
import SocialParagraph from './components/social/SocialParagraph';
import MintParagraph from './components/mint/MintParagraph';
import Arrow from './images/Arrow.png';
import './App.css';

function App() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const shouldShowButton = document.documentElement.scrollTop > 100;
      setShowButton(shouldShowButton);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const smoothScrollTo = (elementId) => {
    document.querySelector(elementId).scrollIntoView({
      behavior: 'smooth',
    });
  };
  return (
    <div>
      <div onNavClick={smoothScrollTo} className="section" id="home">
        <HomeParagraph />
      </div>
      <div className="section" id="about">
        <AboutParagraph />
      </div>
      <div className="section" id="mint">
        <MintParagraph />
      </div>
      <div className="section" id="social">
        <SocialParagraph />
      </div>
      {showButton && (
        <img
          className="scroll-top-button"
          onClick={scrollToTop}
          src={Arrow}
          alt="up"
        />
      )}
    </div>
  );
}

export default App;
