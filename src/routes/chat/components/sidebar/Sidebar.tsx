import { useEffect, useState } from 'react';
import { ProfileProtocol } from '@util/protocols/profile.protocol';
import { userDid, queryRecords, readRecord, writeRecord } from '@util/web5';
import Fox from '@assets/sample-pictures/fox.png';
import ChatLink from './ChatLink';
import { ChatProtocol } from '@util/protocols/chat.protocol';
import { useNavigate } from 'react-router-dom';
import {
  convertTime,
  copyToClipboard,
  getProfilePictureSrc,
} from '@/util/helpers';
import { IChat, IProfile, IProfileRecord } from '@routes/chat/types';

function Sidebar() {
  const [profile, setProfile] = useState<IProfile>();
  const [chatList, setChatList] = useState<IChat[]>([]);

  useEffect(() => {
    async function getProfile() {
      const profile = await transformUserProfile(await getUserProfile());
      if (profile) {
        setProfile(profile);
      }
    }
    void getProfile();
  }, []);

  useEffect(() => {
    // We populate our list at first render
    async function getLatestChats() {
      const dwnChats = await populateChats();
      setChatList(dwnChats);
    }
    void getLatestChats();
    // Every 5s, we check for new chats
    const intervalId = setInterval(async () => {
      getLatestChats();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [chatList.length]);

  return (
    <div>
      <StartChatSection />
      {profile && (
        <div className="profile-row">
          <div className="avatar-container">
            <div className="avatar">
              <img src={getProfilePictureSrc(profile.picture)} alt="" />
            </div>
          </div>
          <h1>{profile.name}</h1>
        </div>
      )}
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

function StartChatSection() {
  const [recipientDid, setRecipientDid] = useState('');
  const navigate = useNavigate();

  async function startNewChat() {
    if (recipientDid) {
      const route = await startChat(recipientDid);
      route && navigate(String(route));
    }
  }

  return (
    <>
      <div className="profile-row">
        <button onClick={() => copyToClipboard(userDid)}>Copy my DID</button>
      </div>
      <div className="profile-row">
        <label htmlFor="recipientDid" className="sr-only">
          To:{' '}
        </label>
        <input
          autoComplete="off"
          id="recipientDid"
          type="text"
          onChange={e => setRecipientDid(e.currentTarget.value)}
          placeholder="To:"
        />
        <button disabled={!recipientDid} onClick={startNewChat}>
          + New Chat
        </button>
      </div>
      <div className="profile-row">
        <button
          disabled={!recipientDid}
          onClick={() => getParticipantProfile(recipientDid)}
        >
          Get profile
        </button>
        <button
          disabled={!recipientDid}
          onClick={() => getFriendChat(recipientDid)}
        >
          Get chat
        </button>
      </div>
    </>
  );
}

async function populateChats() {
  const dwnChats = [];
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
    for (const record of records) {
      let participant;
      const chatItem = await record.data.json();
      const participants = chatItem.recipients.filter(
        (recipientDid: string) => recipientDid !== userDid,
      );
      const profile = await getParticipantProfile(participants[0]);
      if (profile) {
        // transform the participant element into { did: did:ion:1234, name: "Alice", picture: blob }
        participant = {
          did: participants[0],
          name: profile.name,
          picture: URL.createObjectURL(profile.picture),
        };
      }
      const dwnChat = {
        name:
          participants.length > 1
            ? 'Group'
            : participant?.name || participants[0].slice(0, 24), //arbitrary slice
        picture: participants.length > 1 ? Fox : participant?.picture || Fox,
        message: 'Message',
        timestamp: convertTime(record.dateModified),
        isAuthor: chatItem[chatItem.length - 1] === userDid, // Since we create a chat by adding initiating DID as last item
        delivered: true,
        seen: true,
        id: record.id,
      };
      dwnChats.push(dwnChat);
    }
  }
  return dwnChats;
}

async function startChat(recipient: string) {
  // Check if chat exists already in DWN, where recipient initiated
  const { records: duplicateRecordsFrom } = await queryRecords({
    from: recipient,
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
      },
    },
  });
  if (duplicateRecordsFrom && duplicateRecordsFrom.length > 0) {
    if (duplicateRecordsFrom.length > 1) {
      console.warn('More than 1 record found for protocolPath `message`');
    }
    return duplicateRecordsFrom[0].id;
  }
  // Else check if chat exists already, where user had initiated chat
  const { records: duplicateRecordsTo } = await queryRecords({
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
        recipient,
      },
    },
  });
  if (duplicateRecordsTo && duplicateRecordsTo.length > 0) {
    if (duplicateRecordsTo.length > 1) {
      console.warn('More than 1 record found for protocolPath `message`');
    }
    return duplicateRecordsTo[0].id;
  }
  // Else write a new record to start the chat
  const { record } = await writeRecord({
    data: {
      recipients: [recipient, userDid],
    },
    message: {
      protocol: ChatProtocol.protocol,
      protocolPath: 'message',
      schema: ChatProtocol.types.message.schema,
      recipient: userDid,
    },
  });
  if (record) {
    const { status: sendStatus } = await record.send(recipient);
    console.log(sendStatus);
  }
  return record?.id;
}

async function getParticipantProfile(participant: string) {
  const { records: profileRecords } = await queryRecords({
    from: participant,
    message: {
      filter: {
        protocol: ProfileProtocol.protocol,
        protocolPath: 'profile',
      },
    },
  });
  if (profileRecords) {
    const profileData = await profileRecords[0].data.json();
    const { record: photoRecord } = await readRecord({
      from: participant,
      message: {
        recordId: profileData.picture,
      },
    });
    const photoData = await photoRecord.data.blob();
    return { name: profileData.name, picture: photoData };
  }
}

async function getFriendChat(recipient: string) {
  const { records: chatRecords, status: chatStatus } = await queryRecords({
    from: recipient,
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
      },
    },
  });
  console.log(chatStatus, chatRecords);
  for (const chatRecord of chatRecords!) {
    console.log(await chatRecord.data.json());
  }
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
