// Renders a page indicating that the requested page could not be found. 
// It displays a heading, a message explaining the situation, and a link to the login page.

import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-self-auto h-screen text-purple-500"
         style={{ backgroundImage: `url('../../src/assets/404pic.jpg')`, backgroundSize: 'cover' }}>
      <h1 className="text-4xl font-bold text-center mt-20">Page Not Found</h1>
      <p className="text-lg mt-4 text-center ">The page you are looking for could not be found.</p>
      <p className="text-lg mt-2 text-center">Please check the URL or navigate back to the <Link to="/" className="underline">login page</Link>.</p>
    </div>
  );
}


export default NotFoundPage;
