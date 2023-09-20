import { NavLink } from 'react-router-dom';
import { RoutePaths } from '../../../../routes';
import { singleChat } from './Sidebar';

function ChatLink({ chat }: { chat: singleChat }) {
  return (
    <NavLink to={RoutePaths.CHAT + '/' + chat.id} end className="message-row">
      <div
        className={`notification ${
          !chat.what.seen ? 'notification-active' : ''
        }`}
      >
        <span className="sr-only" aria-live="assertive">
          {chat.what.seen ? 'Read' : 'Unread'}
        </span>
      </div>
      <div className="avatar">
        <img src={chat.who.picture} alt="" />
      </div>
      <div className="contents">
        <div className="message">
          <h2>{chat.who.name}</h2>
          <p>{chat.what.message}</p>
        </div>
        <div className="meta">
          <p className={!chat.what.seen ? 'text-highlight' : ''}>
            {chat.what.timestamp}
          </p>
          {chat.what.from === 'self' && <p className="text-xxs">Sent</p>}
        </div>
      </div>
    </NavLink>
  );
}

export default ChatLink;
