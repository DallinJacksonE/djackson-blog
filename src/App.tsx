import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './views/Home/Home';

// Placeholder imports for the views you will stub out
import ContentGrid from './views/ContentGrid/ContentGrid';
import SlideViewer from './views/SlideViewer/SlideViewer';
import Article from './views/Article/Article';

function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/blogs" element={<ContentGrid type="blogs" />} />
          <Route path="/tutorials" element={<ContentGrid type="tutorials" />} />
          <Route path="/topics" element={<ContentGrid type="topics" />} />

          <Route path="/slides" element={<ContentGrid type="slides" />} />
          <Route path="/slides/:slug" element={<SlideViewer />} />

          <Route path="/:type/:slug" element={<Article />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
