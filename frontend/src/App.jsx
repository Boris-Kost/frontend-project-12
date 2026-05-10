import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';

import ChatPage from './pages/ChatPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';

import { useDispatch, useSelector } from 'react-redux';
import { Button, Navbar, Container } from 'react-bootstrap';
import { logOut } from './slices/authSlice';

const App = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <Router>
      <div className="d-flex flex-column h-100">
        <Navbar bg="white" expand="lg" className="shadow-sm">
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            {token && <Button onClick={() => dispatch(logOut())}>Выйти</Button>}
          </Container>
        </Navbar>
        <Routes>
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            )}
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
