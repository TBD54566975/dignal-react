import { RoutePaths } from '@/routes';
import { useNavigate } from 'react-router-dom';

function StartNewChat() {
  const navigate = useNavigate();

  function startNewChat() {
    navigate(RoutePaths.NEW_CHAT);
  }

  return (
    <>
      <div className="profile-row">
        <button onClick={startNewChat}>+ New Chat</button>
      </div>
    </>
  );
}

export default StartNewChat;
