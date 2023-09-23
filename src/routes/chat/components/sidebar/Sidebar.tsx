import { useEffect, useState } from 'react';
import { ProfileProtocol } from '@util/protocols/profile.protocol';
import { userDid, queryRecords, readRecord } from '@util/web5';
import SingleUser from '@assets/sample-pictures/single-user.svg';
import GroupUser from '@assets/sample-pictures/group-user.svg';
import ChatLink from './ChatLink';
import { ChatProtocol } from '@util/protocols/chat.protocol';
import { convertTime, convertBlobToUrl } from '@/util/helpers';
import { IChat, IProfile, IProfileRecord } from '@routes/chat/types';
import { getParticipantProfile } from '../../utils';
import StartNewChat from './StartNewChat';
import { Record } from '@web5/api';

function Sidebar() {
  const [chatList, setChatList] = useState<IChat[]>([]);

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
    <div>
      <StartNewChat />
      <ProfileRow />
      <ul className="messages">
        {chatList.map((chat, index) => {
          return (
            <li key={index}>
              <ChatLink chat={chat} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;

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
          <h1>{profile.name}</h1>
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
    message: 'Preview hidden',
    timestamp: convertTime(record.dateModified),
    isAuthor: false,
    delivered: true,
    seen: true,
    id: record.id,
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
    console.log(records);
    return records[records.length - 1];
  }
}

async function getProfilePictureRecord(photoRecordId: string) {
  const { record: photoData } = await readRecord({
    message: {
      recordId: photoRecordId,
    },
  });
  console.log(photoData);
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
