import { Outlet as ChatOutlet, useParams } from 'react-router-dom';

function ChatWindow() {
  const params = useParams();

  return (
    <>
      {params.chatId ? (
        <ChatOutlet context={params.chatId} />
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
