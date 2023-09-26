import { RoutePaths } from '@/routes';
import { Outlet as ChatOutlet, useLocation, useParams } from 'react-router-dom';
import { showSidebar } from '../../utils';
import HamburgerMenu from '@assets/icons/hamburger-menu.svg';

function ChatWindow() {
  const params = useParams();
  const location = useLocation();

  return (
    <>
      {params.chatId || location.pathname === RoutePaths.NEW_CHAT ? (
        <>
          <div className="profile-row mobile-only">
            <button className="icon-button" onClick={showSidebar}>
              <img width="16" src={HamburgerMenu} alt="" />
            </button>
          </div>
          <ChatOutlet context={params.chatId} />
        </>
      ) : (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            No chat selected
          </div>
        </div>
      )}
    </>
  );
}

export default ChatWindow;
