import Logo from '../../images/Logo.svg';
import Main from '../../images/Main.svg';
import ConnectButton from '../wallet/ConnectButton';
import './HomeParagraph.css';

function HomeParagraph() {
  const handleNavClick = (anchor) => {
    const element = document.querySelector(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home">
      <div className="home-paragraph">
        <img className="home-logo" src={Logo} alt="Logo" />
        <ConnectButton />
        <img className="home-main" src={Main} alt="Main" />
        <a
          href="#mint"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#mint');
          }}
        >
          <button className="home-mint-button">Mint</button>
        </a>
      </div>
    </div>
  );
}

export default HomeParagraph;
