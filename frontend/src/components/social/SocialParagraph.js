import Twitter from '../../images/Twitter.svg';
import Instagram from '../../images/Instagram.svg';
import Attic from '../../images/Attic.svg';
import './SocialParagraph.css';

function SocialParagraph() {
  const redirectToInstagram = () => {
    window.open(
      'https://www.instagram.com/coffeemonsters_croco/',
      '_blank',
      'noopener noreferrer',
    );
  };

  const redirectToTwitter = () => {
    window.open(
      'https://twitter.com/The_Croco_Team',
      '_blank',
      'noopener noreferrer',
    );
  };

  const redirectToAttic = () => {
    window.open(
      'https://atticc.xyz/c/0x232c4428F5291297c653BC6906C5225fD5C5D075',
      '_blank',
      'noopener noreferrer',
    );
  };

  return (
    <div className="social">
      <div className="social-paragraph">
        <div onClick={redirectToInstagram}>
          <img src={Instagram} alt="Instagram" />
          <p>Instagram</p>
        </div>
        <div onClick={redirectToTwitter}>
          <img src={Twitter} alt="Twitter" />
          <p>Twitter</p>
        </div>
        <div onClick={redirectToAttic}>
          <img src={Attic} alt="Attic" />
          <p>Attic</p>
        </div>
      </div>
    </div>
  );
}

export default SocialParagraph;
