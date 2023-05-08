// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import LoginPage from './pages/LoginPage.jsx'
import HomePage from './pages/HomePage.jsx';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Navbar from './components/navbar.jsx';   
import ProfilePage from './pages/profilePage.jsx';
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <div className = "min-h-screen bg-bg-main-custom pt-12">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/Home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
        </div>

      </div>
    </BrowserRouter>
  );
}
  // const [count, setCount] = useState(0)
  // const [count, setCount] = useState(0)

  // return (
  //   <>
  //     <div>
  //       <a href="https://vitejs.dev" target="_blank">
  //         <img src={viteLogo} className="logo" alt="Vite logo" />
  //       </a>
  //       <a href="https://react.dev" target="_blank">
  //         <img src={reactLogo} className="logo react" alt="React logo" />
  //       </a>
  //     </div>
  //     <h1>Vite + React</h1>
  //     <div className="card">
  //       <button onClick={() => setCount((count) => count + 1)}>
  //         count is {count}
  //       </button>
  //       <p>
  //         Edit <code>src/App.jsx</code> and save to test HMR
  //       </p>
  //     </div>
  //     <p className="read-the-docs">
  //       Click on the Vite and React logos to learn more
  //     </p>
  //   </>
  // )


export default App
