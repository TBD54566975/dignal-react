import { useEffect, useState } from 'react';
import { Outlet } from 'react-router';
import { setInitialTheme } from '../theme';
import Loading from '@/components/Loading';
import {
  ProfileContext,
  ProfileContextValue,
  setProfileList,
  setUpWeb5User,
} from '@/util/profile';
import { useNavigate } from 'react-router-dom';
import { RoutePaths } from '@/util/routes';
import Sidebar from '@/components/Sidebar';
import {
  ChatContext,
  ChatContextValue,
  parseChatInviteUrl,
  setChatList,
} from '@/util/chat';
import RequestModal from '@/components/RequestModal';

setInitialTheme();

const requestParams = parseChatInviteUrl(location.search);

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatContextValue | undefined>();
  const [profiles, setProfiles] = useState<ProfileContextValue | undefined>();

  useEffect(() => {
    let pollForNewChats: NodeJS.Timeout;
    async function setupWeb5AndChatList() {
      try {
        await setUpWeb5User();

        setProfiles(await setProfileList());
        setChats(await setChatList());

        pollForNewChats = setInterval(async () => {
          setChats(await setChatList());
        }, 5000);
        setIsLoading(false);

        if (location.pathname === RoutePaths.ROOT) {
          navigate({
            pathname: RoutePaths.CHAT,
            search: location.search,
            hash: location.hash,
          });
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
      {requestParams && (
        <RequestModal isLoading={isLoading} requestParams={requestParams} />
      )}

      <Sidebar />
      <Outlet
        context={{
          chats: [chats, setChats] satisfies ChatContext,
          profiles: [profiles, setProfiles] satisfies ProfileContext,
        }}
      />
    </div>
  );
}
