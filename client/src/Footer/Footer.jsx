import logo from '../../public/logo_nav.png';
import mseuf_logo from '../../public/Official_Seal_of_MSEUF.png';
import ccms_logo from '../../public/ccmslogo.png';

function Footer() {
    return (
        <>

            <footer className="footer p-10 bg-base-200 text-base-content">

                <aside>
                    <img src={logo} alt="" width={150} />
                    <p>
                        <b>ArtisanFlix.</b>
                        <br />
                        Empowering Creators, Inspiring Viewers.
                        <br />© 2024 ArtisanFlix.
                    </p>
                </aside>

                <aside>
                    <div className="flex items-center">
                        <img src={mseuf_logo} alt="" width={115} />
                        <img src={ccms_logo} alt="" width={100} />
                    </div>
                    <p>
                        <a href="https://mseuf.edu.ph/" className="link link-hover font-bold" target="_blank" rel="noopener noreferrer">
                            MSEUF | CCMS
                        </a>
                        <br />
                        ITWM102: Web Development 2 (Backend)
                        <br /> Special thanks and credits to: EMC Students.
                        <br /> All videos are not owned by ArtisanFlix.
                    </p>
                </aside>

                <nav>
                    <h6 className="footer-title">Team</h6>
                    <a href="https://www.facebook.com/gailbnvntr" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        Gail Buenaventura
                    </a>
                    <a href="https://www.facebook.com/symon.dural.9" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        Symon Dural
                    </a>
                    <a href="https://www.facebook.com/sssipr/" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        Christian Rosales
                    </a>
                </nav>

                <nav>
                    <h6 className="footer-title">Technologies</h6>
                    <a href="https://www.mongodb.com" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        <b>M</b>ongoDB
                    </a>
                    <a href="https://expressjs.com" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        <b>E</b>xpress.js
                    </a>
                    <a href="https://reactjs.org" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        <b>R</b>eact
                    </a>
                    <a href="https://nodejs.org" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        <b>N</b>ode.js
                    </a>
                </nav>

                <nav>
                    <h6 className="footer-title">Tools</h6>
                    <a href="https://www.npmjs.com/package/bcrypt" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        Bcrypt
                    </a>
                    <a href="https://www.npmjs.com/package/jsonwebtoken" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        JWT
                    </a>
                    <a href="https://www.github.com" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        GitHub
                    </a>
                    <a href="https://www.postman.com" className="link link-hover" target="_blank" rel="noopener noreferrer">
                        Postman
                    </a>
                </nav>

                <nav>
                    <h6 className="footer-title">Contacts</h6>
                    <a className="link link-hover">artisanflix@gmail.com</a>
                </nav>

            </footer>
        </>
    );
}

export default Footer;
