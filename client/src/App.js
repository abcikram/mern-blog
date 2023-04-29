import Header from './components/Header';
import { Route, Routes } from 'react-router-dom';
import Blog from './pages/Blog';
import Registation from './pages/Registation';
import Login from './pages/Login';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path='/' element={<Blog />} />
        <Route path='/blogs' element={<Blog />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Registation />} />
      </Routes>
    </>
  );
}

export default App;
