import { BrowserRouter, Routes, Route} from 'react-router-dom';
import MapIndex from './map/train';



const App = () => {
  return (
    <BrowserRouter>
     <Routes>
        <Route path="/" element={<MapIndex />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

