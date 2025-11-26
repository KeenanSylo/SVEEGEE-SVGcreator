import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import SveegeeBlobGenerator from './SveegeeBlobGenerator'
import Home from './Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blob-generator" element={<SveegeeBlobGenerator />} />
      </Routes>
    </Router>
  )
}

export default App
