import './App.css';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get('authToken');
    if (authToken) {
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      document.cookie = `authToken=${authToken}; expires=${date.toUTCString()}; path=/`;
    }
  }, [location]);

  return (
    <div className="App">
      <div className="AppBar">
        <div className="AppBar-content">
          <img src="/logo192.png" alt="logo" className="AppBar-logo" />
          <h1 className="AppBar-title">Raspberry control</h1>
        </div>
      </div>
      <header className="App-header" />
    </div>
  );
}

export default App;
