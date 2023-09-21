import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { connectWeb5, getWeb5Route } from '@/util/web5';
import { RoutePaths } from '@/routes';
import { setInitialTheme, updateLocalTheme } from '@routes/theme';
import { resetIndexedDb } from '@util/helpers';

function App() {
  return (
    <div className="site-container">
      <Header />
      <LoadingHandler />
    </div>
  );
}

export default App;

function LoadingHandler() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function activateWeb5AndRouteUser() {
      await connectWeb5();
      const route = await getWeb5Route();
      setIsLoading(false);
      route && navigate(route);
    }
    void activateWeb5AndRouteUser();
  }, [navigate]);

  return <>{isLoading ? <LoadingSpinner /> : <Outlet />}</>;
}

function LoadingSpinner() {
  return (
    <div className="layout">
      <div className="row text-center justify-center m-auto row-px">
        loading...
      </div>
    </div>
  );
}

function Header() {
  const [themeOptions, setThemeOptions] = useState(setInitialTheme());
  const navigate = useNavigate();

  function updateTheme() {
    const theme = updateLocalTheme();
    setThemeOptions(theme);
  }

  async function resetDb() {
    await resetIndexedDb();
    navigate(RoutePaths.ONBOARDING);
  }

  return (
    <div className="button-row">
      <button onClick={updateTheme}>
        Switch to {themeOptions.altTheme} theme
      </button>
      <button onClick={resetDb}>Reset datastore</button>
    </div>
  );
}
