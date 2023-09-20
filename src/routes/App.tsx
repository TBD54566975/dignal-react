import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { connectWeb5, getWeb5Route } from '../util/web5';

function App() {
  const [themeOptions, setThemeOptions] = useState(setInitialTheme());
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

  function updateTheme() {
    const theme = updateLocalTheme();
    setThemeOptions(theme);
  }

  async function clearDb() {
    const databases = await indexedDB.databases();
    for (const database of databases) {
      if (database.name) {
        indexedDB.deleteDatabase(database.name);
      }
    }
    console.log('Cleared databases');
    navigate('/onboarding');
  }

  return (
    <>
      <div className="button-row">
        <button onClick={updateTheme}>
          Switch to {themeOptions.altTheme} theme
        </button>
        <button onClick={clearDb}>Reset datastore</button>
      </div>
      {isLoading ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            loading...
          </div>
        </div>
      ) : (
        <Outlet />
      )}
    </>
  );
}

export default App;

function setInitialTheme() {
  const currentTheme =
    localStorage.getItem('themePreference') ??
    (window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light');
  document.body.classList.add(currentTheme ?? '');
  const altTheme = currentTheme === 'light' ? 'dark' : 'light';
  return { currentTheme, altTheme };
}

function updateLocalTheme() {
  const isDark = document.body.classList.toggle('dark');
  const currentTheme = isDark ? 'dark' : 'light';
  const altTheme = isDark ? 'light' : 'dark';
  localStorage.setItem('themePreference', currentTheme);
  return { currentTheme, altTheme };
}
