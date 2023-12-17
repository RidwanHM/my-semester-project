import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import logo from "../../assets/wl.png";

function Footer() {
  return (
    <footer className="bg-blue-500 p-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="text-white text-lg">© BMSF 2023</div>

        <div className="my-4 lg:my-0">
          <img className="w-auto h-20 mx-auto" src={logo} alt="Your Company" />
        </div>

        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            className="text-white hover:text-blue-300"
          >
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a
            href="https://twitter.com"
            className="text-white hover:text-blue-300"
          >
            <FontAwesomeIcon icon={faTwitter} />
          </a>
          <a
            href="https://instagram.com"
            className="text-white hover:text-blue-300"
          >
            <FontAwesomeIcon icon={faInstagram} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
