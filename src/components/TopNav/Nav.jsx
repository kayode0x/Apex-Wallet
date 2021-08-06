import { Cross as Hamburger } from 'hamburger-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './Nav.scss';

const Nav = () => {
	const location = useLocation();
	const { pathname } = location;
	const splitLocation = pathname.split('/')[1];

	const [navOpen, setNavOpen] = useState(false);
	const [activeNav, setActiveNav] = useState(splitLocation);

	//prevent scrolling when the navbar is open
	switch (navOpen) {
		case true:
			var bodyOpen = document.getElementsByTagName('BODY')[0];
			bodyOpen.style.overflow = 'hidden';
			break;
		case false:
			var bodyClose = document.getElementsByTagName('BODY')[0];
			bodyClose.style.overflow = 'auto';
			break;
		default:
		//
	}
	return (
    <>
      <nav>
        <Link to="/" className="logo">
          <p>apexwallet</p>
        </Link>
        <div className="desktop">
          <a
            href="https://apexwallet.s3.us-east-2.amazonaws.com/Crypto+Lexicons.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Learn
          </a>
          <Link
            onClick={() => setActiveNav("about")}
            className={activeNav === "about" ? "active" : ""}
            to="/about"
          >
            About Us
          </Link>
          <Link to="/login">Sign In</Link>
          <Link className="signupBtn" to="/signup">
            Get Started
          </Link>
        </div>
        <div className="mobile">
          <Hamburger size={25} toggled={navOpen} toggle={setNavOpen} />
        </div>
      </nav>
      {navOpen && (
        <div className="mobileNav">
          <a
            href="https://apexwallet.s3.us-east-2.amazonaws.com/Crypto+Lexicons.pdf"
            target="_blank"
            rel="noreferrer"
          >
            Learn
          </a>
          <a href="/about">About Us</a>
          <a href="/login">Sign In</a>
          <a href="/signup" className="signupBtn">
            Get Started
          </a>
        </div>
      )}
    </>
  );
};

export default Nav;
