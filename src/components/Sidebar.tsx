import { RoutePaths } from '@/util/routes';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import ChatsIcon from '@assets/tabs/chats.svg';
import ProfilesIcon from '@assets/tabs/profiles.svg';

export default function Sidebar() {
  return (
    <aside>
      <nav>
        <NavLink to={RoutePaths.CHAT}>
          <img src={ChatsIcon} alt="" />
          Chats
        </NavLink>
        <NavLink to={RoutePaths.PROFILES}>
          <img src={ProfilesIcon} alt="" />
          Profiles
        </NavLink>
      </nav>
    </aside>
  );
}
