import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routes';
import { IChatRecord } from '@routes/chat/types';
import Close from '@assets/icons/x-close.svg';
import { queryRecords } from '@/util/web5';
import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { MouseEvent } from 'react';
import { hideSidebar } from '../../utils';

function ChatLink({ chat }: { chat: IChatRecord }) {
  const navigate = useNavigate();
  const location = useLocation();
  async function deleteChat(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    // delete all chats in a context, but preserve the root context
    // so other participant can reignite chat context if needed
    const { records } = await queryRecords({
      message: {
        filter: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message/reply',
          contextId: chat.record.contextId,
        },
      },
    });
    if (records) {
      for (const record of records) {
        await record.delete();
      }
    }
    if (location.pathname.includes(chat.record.contextId)) {
      navigate(RoutePaths.CHAT);
    }
  }

  return (
    <>
      <NavLink
        to={RoutePaths.CHAT + '/' + chat.record.id}
        onClick={hideSidebar}
        end
        className="message-row"
      >
        <div className="avatar-container">
          <div className="avatar">
            <img src={chat.picture} alt="" />
          </div>
        </div>
        <div className="contents">
          <div className="message">
            <h2>{chat.name}</h2>
          </div>
        </div>
      </NavLink>
      <button className="icon-button highlight-button" onClick={deleteChat}>
        <img width="16" src={Close} alt="" /> Delete
      </button>
    </>
  );
}

export default ChatLink;
