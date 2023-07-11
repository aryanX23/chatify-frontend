import './App.css';
import Dashboard from './components/dashboard/dashboard';
import Register from './components/register/register';
import SignIn from './components/signIn/signin';
import { Route, Routes, Navigate } from 'react-router-dom';
import AppContext from './context/AppProvider';
import PrivateRoutes from './context/privateRoutes'
function App() {
  return (
      <AppContext>
          <div className="appBody">
              <Routes>
                  <Route exact path="/chatify-frontend/" element={<SignIn />} />
                  <Route
                      exact
                      path="/chatify-frontend/register/"
                      element={<Register />}
                  />
                  <Route
                      path="*"
                      element={<Navigate to="/chatify-frontend/" replace />}
                  />
                  <Route element={<PrivateRoutes />}>
                      <Route
                          exact
                          path="/chatify-frontend/dashboard/"
                          element={<Dashboard />}
                      />
                  </Route>
              </Routes>
          </div>
      </AppContext>
  );
}

export default App;
