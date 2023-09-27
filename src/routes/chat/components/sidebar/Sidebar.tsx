import { useEffect, useState } from 'react';
import { userDid } from '@util/web5';
import ChatLink from './ChatLink';
import { copyToClipboard, resetIndexedDb } from '@/util/helpers';
import { IChatRecord, IProfileRecord } from '@routes/chat/types';
import {
  getAllOtherChatParticipants,
  getChatProfile,
  getDwnProfile,
  hideSidebar,
} from '../../utils';
import StartNewChat from './StartNewChat';
import { Record } from '@web5/api';
import { getLocalTheme, updateLocalTheme } from '@/routes/theme';
import Copy from '@assets/icons/copy.svg';
import Sun from '@assets/icons/sun.svg';
import Moon from '@assets/icons/moon.svg';
import Trash from '@assets/icons/trash.svg';
import Close from '@assets/icons/x-close.svg';
import { queryFromDwnMessageReplies, queryFromDwnMessages } from '../../dwn';

function Sidebar() {
  return (
    <div className="sidebar" onClick={hideSidebar}>
      <div className="sidebar-inner" onClick={e => e.stopPropagation()}>
        <ChatHeader />
        <ChatList />
        <Profile />
        <ChatFooter />
      </div>
    </div>
  );
}

export default Sidebar;

function ChatHeader() {
  return (
    <div className="profile-row">
      <StartNewChat />
      <HideSidebarButton />
    </div>
  );
}

function ChatList() {
  const [chatList, setChatList] = useState<IChatRecord[]>([]);

  useEffect(() => {
    // We populate our list at first render
    async function getLatestChats() {
      const dwnChatList = await populateChats();
      setChatList(dwnChatList);
    }
    void getLatestChats();

    // Every 5s, we check for new chats
    // TODO: change once subs come in
    const intervalId = setInterval(async () => {
      getLatestChats();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ul className="messages">
      {chatList.map((chat, index) => {
        return (
          <li key={index} className="message-item">
            <ChatLink chat={chat} />
          </li>
        );
      })}
    </ul>
  );
}

function HideSidebarButton() {
  return (
    <button
      title="Close"
      className="icon-button icon-button-border mobile-only"
      onClick={hideSidebar}
    >
      <img width="16" src={Close} alt="" />
    </button>
  );
}

function ChatFooter() {
  const [themeOptions, setThemeOptions] = useState(getLocalTheme());

  function updateTheme() {
    const theme = updateLocalTheme();
    setThemeOptions(theme);
  }

  return (
    <>
      <div className="profile-row">
        <button className="icon-button" onClick={updateTheme}>
          <img
            width="16"
            src={themeOptions.altTheme === 'light' ? Sun : Moon}
            alt=""
          />
          Turn on {themeOptions.altTheme} mode
        </button>
      </div>
      <div className="profile-row">
        <button className="icon-button danger-button" onClick={resetIndexedDb}>
          <img width="16" src={Trash} alt="" />
          Destroy connection
        </button>
      </div>
    </>
  );
}

function Profile() {
  const [profile, setProfile] = useState<IProfileRecord>();
  useEffect(() => {
    async function getProfile() {
      const profile = await getDwnProfile();
      if (profile) {
        setProfile(profile);
      }
    }
    void getProfile();
  }, []);

  return (
    <>
      {profile && (
        <div className="profile-row">
          <div className="avatar-container">
            <div className="avatar">
              <img src={profile.picture} alt="" />
            </div>
          </div>
          <p>{profile.name}</p>
          <button
            className="icon-button m-l-auto nowrap"
            onClick={() => copyToClipboard(userDid)}
          >
            <img width="16" src={Copy} alt="" />
            Copy DID
          </button>
        </div>
      )}
    </>
  );
}

async function getDwnChatList() {
  const records = await queryFromDwnMessages();
  let chatsWithMessages;
  if (records && records.length > 0) {
    // check for root contexts that have chats saved locally
    // in case user previously deleted a chat, which would have nuked all messages but not root context
    chatsWithMessages = [];
    for (const record of records) {
      const replyRecords = await queryFromDwnMessageReplies(record.contextId);
      if (replyRecords && replyRecords.length > 0) {
        chatsWithMessages.push(record);
      }
    }
  }
  return chatsWithMessages;
}

async function populateChats() {
  const dwnChats = [];
  const dwnChatList = await getDwnChatList();
  if (dwnChatList && dwnChatList.length > 0) {
    for (const dwnChatListRecord of dwnChatList) {
      dwnChats.push(await transformRecordToChat(dwnChatListRecord));
    }
  }
  return dwnChats;
}

async function transformRecordToChat(record: Record) {
  const { recipients } = await record.data.json();
  const participants = getAllOtherChatParticipants(recipients);
  const chatProfile = await getChatProfile(participants);
  return {
    ...chatProfile,
    record,
  };
}
