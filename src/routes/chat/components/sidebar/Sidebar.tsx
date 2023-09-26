import { useEffect, useState } from 'react';
import { ProfileProtocol } from '@util/protocols/profile.protocol';
import { userDid, queryRecords, readRecord } from '@util/web5';
import SingleUser from '@assets/sample-pictures/single-user.svg';
import GroupUser from '@assets/sample-pictures/group-user.svg';
import ChatLink from './ChatLink';
import { ChatProtocol } from '@util/protocols/chat.protocol';
import {
  convertBlobToUrl,
  copyToClipboard,
  resetIndexedDb,
} from '@/util/helpers';
import { IChatRecord, IProfile, IProfileRecord } from '@routes/chat/types';
import { getParticipantProfile, hideSidebar } from '../../utils';
import StartNewChat from './StartNewChat';
import { Record } from '@web5/api';
import { getLocalTheme, updateLocalTheme } from '@/routes/theme';
import Close from '@assets/icons/x-close.svg';
import Copy from '@assets/icons/copy.svg';
import Sun from '@assets/icons/sun.svg';
import Moon from '@assets/icons/moon.svg';
import Trash from '@assets/icons/trash.svg';

function Sidebar() {
  const [chatList, setChatList] = useState<IChatRecord[]>([]);

  useEffect(() => {
    // We populate our list at first render
    async function getLatestChats() {
      const dwnChats = await populateChats();
      setChatList(dwnChats);
    }
    void getLatestChats();
    // Every 5s, we check for new chats
    // TODO: change once subs come in
    const intervalId = setInterval(async () => {
      getLatestChats();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [chatList.length]);

  return (
    <>
      <div className="sidebar-inner">
        <StartNewChat />
        <ul className="messages">
          {chatList.map((chat, index) => {
            return (
              <li key={index} className="message-item">
                <ChatLink chat={chat} />
              </li>
            );
          })}
        </ul>
        <ProfileRow />
        <Footer />
      </div>
      <div className="mobile-only mobile-sidebar-backdrop">
        <button
          title="Close"
          className="icon-button icon-button-border"
          onClick={hideSidebar}
        >
          <img width="16" src={Close} alt="" />
        </button>
      </div>
    </>
  );
}

export default Sidebar;

function Footer() {
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

function ProfileRow() {
  const [profile, setProfile] = useState<IProfile>();
  useEffect(() => {
    async function getProfile() {
      const profile = await transformUserProfile(await getUserProfile());
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
              <img src={convertBlobToUrl(profile.picture)} alt="" />
            </div>
          </div>
          <p>{profile.name}</p>
          <button
            className="icon-button m-l-auto nowrap"
            onClick={() => copyToClipboard(userDid)}
          >
            <img width="16" src={Copy} alt="" />
            Copy my DID
          </button>
        </div>
      )}
    </>
  );
}

async function getDwnChatList() {
  const { records } = await queryRecords({
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
        schema: ChatProtocol.types.message.schema,
        dataFormat: ChatProtocol.types.message.dataFormats[0],
      },
    },
  });
  if (records) {
    // check for root contexts that have chats saved locally
    // in case user previously deleted a chat, which would have nuked all messages but not root context
    const listedRecords = [];
    for (const record of records) {
      const { records: replyRecords } = await queryRecords({
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            protocolPath: 'message/reply',
            contextId: record.contextId,
          },
        },
      });
      if (replyRecords && replyRecords.length > 0) {
        listedRecords.push(record);
      }
    }
    return listedRecords;
  }
  return records;
}

async function transformDwnChatRecord(record: Record) {
  const chatItem = await record.data.json();
  const participants = chatItem.recipients.filter(
    (recipientDid: string) => recipientDid !== userDid,
  );
  const participantsProfiles = [];
  for (const participant of participants) {
    const profile = await getParticipantProfile(participant);
    participantsProfiles.push({
      name: (profile && profile.name) || participant.slice(0, 24), //arbitrary slice
      picture: (profile && URL.createObjectURL(profile.picture)) || SingleUser,
    });
  }
  return {
    name: participants.length > 1 ? 'Group' : participantsProfiles[0].name,
    picture:
      participants.length > 1 ? GroupUser : participantsProfiles[0].picture,
    // TODO : once subs come in populate with latest message
    record,
  };
}

async function populateChats() {
  const dwnChats = [];
  const records = await getDwnChatList();
  if (records) {
    for (const record of records) {
      dwnChats.push(await transformDwnChatRecord(record));
    }
  }
  return dwnChats;
}

async function getLatestProfileRecord() {
  const { records } = await queryRecords({
    message: {
      filter: {
        protocol: ProfileProtocol.protocol,
        protocolPath: 'profile',
        schema: ProfileProtocol.types.profile.schema,
        dataFormat: ProfileProtocol.types.profile.dataFormats[0],
      },
    },
  });
  if (records) {
    return records[records.length - 1];
  }
}

async function getProfilePictureRecord(photoRecordId: string) {
  const { record: photoData } = await readRecord({
    message: {
      recordId: photoRecordId,
    },
  });
  return photoData;
}

async function getUserProfile() {
  const latestProfileRecord = await getLatestProfileRecord();
  if (latestProfileRecord) {
    const profileData = await latestProfileRecord.data.json();
    return profileData;
  }
}

async function getUserPicture(profileData: IProfileRecord) {
  const photoData = await getProfilePictureRecord(profileData.picture);
  if (photoData) {
    const blob = await photoData.data.blob();
    return blob;
  }
}

async function transformUserProfile(profileData: IProfileRecord) {
  const blob = await getUserPicture(profileData);
  if (blob) {
    return {
      name: profileData.name,
      picture: blob,
    };
  }
}
