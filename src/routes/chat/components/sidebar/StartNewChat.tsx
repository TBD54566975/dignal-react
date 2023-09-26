import { RoutePaths } from '@/routes';
import { useNavigate } from 'react-router-dom';
import Plus from '@assets/icons/plus.svg';
import { hideSidebar } from '../../utils';

function StartNewChat() {
  const navigate = useNavigate();

  function startNewChat() {
    navigate(RoutePaths.NEW_CHAT);
    hideSidebar();
  }

  return (
    <button onClick={startNewChat}>
      <img width="16" src={Plus} alt="" /> New Chat
    </button>
  );
}

export default StartNewChat;
