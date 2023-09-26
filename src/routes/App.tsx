import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { connectWeb5, getWeb5Route } from '@/util/web5';
import { setInitialTheme } from './theme';

setInitialTheme();

function App() {
  return <LoadingHandler />;
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
