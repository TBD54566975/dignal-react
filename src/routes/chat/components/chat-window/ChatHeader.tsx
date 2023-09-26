import HamburgerMenu from '@assets/icons/hamburger-menu.svg';
import { showSidebar } from '../../utils';
import { IProfileRecord } from '../../types';

function ChatHeader({ profile }: { profile: IProfileRecord | undefined }) {
  return (
    <div className="chat-header">
      <div className="profile-row">
        <button className="icon-button mobile-only" onClick={showSidebar}>
          <img width="16" src={HamburgerMenu} alt="" />
        </button>
        {profile && (
          <div className="profile-details">
            <div className="avatar">
              <img src={profile.picture} alt="" />
            </div>
            <div className="chat-name">
              <h1>{profile.name}</h1>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatHeader;
