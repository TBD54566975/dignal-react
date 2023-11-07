import { ChatListContextItem } from './chat';
import { ProfileListContextItem } from './profile';
import { useOutletContext } from 'react-router-dom';

export type ChatContextValue = {
  [contextId: string]: ChatListContextItem | undefined;
};
export type ChatContextState = [
  ChatContextValue,
  React.Dispatch<React.SetStateAction<ChatContextValue>>,
];

export function useChatContext() {
  const { chats } = useOutletContext<{ chats: ChatContextState }>();
  return chats;
}

export type ProfileContextValue = {
  [contextId: string]: ProfileListContextItem | undefined;
};
export type ProfileContextState = [
  ProfileContextValue,
  React.Dispatch<React.SetStateAction<ProfileContextValue>>,
];

export function useProfileContext() {
  const { profiles } = useOutletContext<{ profiles: ProfileContextState }>();
  return profiles;
}
