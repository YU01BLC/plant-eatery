import { Routes, Route } from 'react-router-dom';
import Admin from './page/admin';
import Index from './page/index';

const App = () => {
  return (
    <Routes>
      <Route path='/admin' element={<Admin />} />
      <Route path='*' element={<Index />} />
    </Routes>
  );
};

export default App;
