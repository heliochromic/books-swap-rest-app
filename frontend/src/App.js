import './App.css';
import Header from './Header/Header'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
        <Header />
        <ToastContainer />
    </div>
  );
}

export default App;
