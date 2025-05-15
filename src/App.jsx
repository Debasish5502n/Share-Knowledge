import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AddSubject from './components/addSubject/AddSubject.jsx'
import SideContent from './components/content/SideContent'
import Course from './components/course/course.jsx'
import Nav from './components/Navbar/Nav'

function App() {

  return (
    <>
      <Router>
        <div>
          <Nav />
          <Routes>
            <Route path="/addSubject" element={<AddSubject />} />
            <Route path="/" element={<Course />} />
            <Route path="/sideContent" element={<SideContent />} />
          </Routes>
        </div>
      </Router>

    </>
  )
}

export default App
