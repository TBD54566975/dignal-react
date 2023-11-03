import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { setInitialTheme } from '../theme';
import Loading from '@/components/Loading';
import { setUpWeb5User } from '@/util/profile';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/util/routes';
import Sidebar from '@/components/Sidebar';
import { ChatContext, ChatContextValue, hydrateChatList } from '@/util/chat';

setInitialTheme();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatContextValue | undefined>();

  useEffect(() => {
    let pollForNewChats: NodeJS.Timeout;

    async function setChatList() {
      const chatList = await hydrateChatList();
      chatList &&
        setChats(
          Object.fromEntries(chatList.map(chat => [chat.contextId, chat])),
        );
    }

    async function setupWeb5AndChatList() {
      try {
        // const { records } = await getChatContextThreadRecords(thread.record.id)
        await setUpWeb5User();
        await setChatList();

        setIsLoading(false);
        pollForNewChats = setInterval(async () => {
          await setChatList();
        }, 5000);
        if (location.pathname === RoutePaths.ROOT) {
          navigate(RoutePaths.CHAT);
        }
      } catch (e) {
        console.error(e);
        setIsError(true);
      }
    }
    void setupWeb5AndChatList();

    return () => clearInterval(pollForNewChats);
  }, [navigate]);

  if (isError) {
    throw new Error(
      'There was a problem setting up your chat profile. Please try again later.',
    );
  }
  return isLoading ? (
    <Loading />
  ) : (
    <div className="sidebar-layout">
      <Sidebar />
      <Outlet
        context={{
          chats: [chats, setChats] satisfies ChatContext,
        }}
      />
    </div>
  );
}
