import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();
  const showProfileAndLogout = location.pathname !== "/";

  return (
    <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <svg
          className="fill-current h-8 w-8 mr-2"
          width="54"
          height="54"
          viewBox="0 0 54 54"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" />
        </svg>
        <span className="font-semibold text-xl tracking-tight">OrganizeMe</span>
      </div>
      <div className="flex items-center flex-shrink-0 text-white mr-6">
        <Link to="/home">
          <img src="./src/assets/logo.png" alt="Logo" className="w-16" />
        </Link>
      </div>
      <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
        <div className="text-sm lg:flex-grow">
          {/* Add any navigation links here */}
        </div>
        {showProfileAndLogout && (
          <div>
            <Link
              to="/profile"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-navy hover:bg-white mt-4 lg:mt-0"
            >
              Profile
            </Link>
          </div>
        )}
        {showProfileAndLogout && (
          <div>
            <Link
              to="/"
              className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-navy hover:bg-white mt-4 lg:mt-0"
            >
              Log out
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar