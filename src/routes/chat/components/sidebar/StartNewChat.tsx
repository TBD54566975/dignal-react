// import { RoutePaths } from '@/routes';
import Plus from '@assets/icons/plus.svg';
import { useRef } from 'react';
import ChevronRight from '@assets/icons/chevron-right.svg';
import './StartNewChat.css';
import { writeRecord } from '@/util/web5';
import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/routes';

function StartNewChat() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const navigate = useNavigate();

  async function goToChat() {
    const chatId = await createNewChat('single');
    if (chatId) {
      console.log(chatId);
      navigate(`${RoutePaths.CHAT}/${chatId?.contextId}`);
      dialogRef?.current?.close();
    }
  }

  return (
    <>
      <button
        className="icon-button-primary"
        onClick={() => dialogRef.current?.showModal()}
      >
        <img width="16" src={Plus} alt="" /> New Chat
      </button>
      <dialog
        ref={dialogRef}
        onClick={e => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto"
      >
        <div>
          <h2>Start a new...</h2>
          {[
            ['1:1 chat', 'Chat with one other person', 'single'],
            ['Group chat', 'Chat with a group of people', 'group'],
            [
              'Channel',
              'Only you can post, anyone can join via a link',
              'channel',
            ],
          ].map((buttonSet, index) => {
            return (
              <button key={index} onClick={goToChat} className="link-row">
                <div>
                  <h3>{buttonSet[0]}</h3>
                  <p>{buttonSet[1]}</p>
                </div>
                <img width="16" src={ChevronRight} alt="" />
              </button>
            );
          })}
        </div>
      </dialog>
    </>
  );
}

export default StartNewChat;

async function createNewChat(type: 'single' | 'group' | 'channel') {
  console.time('write');
  const { record } = await writeRecord({
    data: {
      type,
    },
    message: {
      protocol: ChatProtocol.protocol,
      protocolPath: 'message',
      schema: ChatProtocol.types.message.schema,
      dataFormat: ChatProtocol.types.message.dataFormats[0],
    },
  });
  console.timeEnd('write');
  return record;
}
