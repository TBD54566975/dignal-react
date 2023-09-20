import { useEffect, useRef, useState } from 'react';
import { ProfileProtocol } from '../../util/protocols/profile.protocol';
import {
  userDid,
  queryRecords,
  readRecord,
  writeRecord,
} from '../../util/web5';
import Bat from '../../assets/sample-pictures/bat.png';
import Elephant from '../../assets/sample-pictures/elephant.png';
import Fox from '../../assets/sample-pictures/fox.png';
import ChatLink from './components/ChatLink';
import { ChatProtocol } from '../../util/protocols/chat.protocol';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const [profile, setProfile] = useState<{ name: string; imgSrc: string }>();
  const navigate = useNavigate();

  const recipientDidRef = useRef<HTMLInputElement>(null);

  async function startChat() {
    if (recipientDidRef?.current?.value) {
      const { status, record } = await writeRecord({
        data: {
          recipients: [recipientDidRef.current.value, userDid],
        },
        message: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message',
          schema: ChatProtocol.types.message.schema,
        },
      });
      console.log(status, record);
      if (record && recipientDidRef && recipientDidRef.current) {
        const { status: sendStatus } = await record.send(
          recipientDidRef.current.value,
        );
        console.log(sendStatus);
      }
      navigate(String(record?.id));
    }
  }

  async function getFriendProfile() {
    const { records: profileRecords, status: profileStatus } =
      await queryRecords({
        from: recipientDidRef?.current?.value,
        message: {
          filter: {
            protocol: ProfileProtocol.protocol,
          },
        },
      });
    console.log(profileStatus, profileRecords);
    for (const profileRecord of profileRecords!) {
      if (
        ProfileProtocol.types.photo.dataFormats.includes(
          profileRecord.dataFormat,
        )
      ) {
        console.log(await profileRecord.data.blob());
      } else {
        console.log(await profileRecord.data.json());
      }
    }
  }

  async function getFriendChat() {
    const { records: chatRecords, status: chatStatus } = await queryRecords({
      from: recipientDidRef?.current?.value,
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

  useEffect(() => {
    async function getProfile() {
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
        const profiledata = await records[records.length - 1].data.json();

        const { record: photodata } = await readRecord({
          message: {
            recordId: profiledata.picture,
          },
        });
        const blob = await photodata.data.blob();
        setProfile({
          name: profiledata.name,
          imgSrc: URL.createObjectURL(blob),
        });
      }
    }
    void getProfile();
  }, []);

  const [chats, setChats] = useState<singleChat[]>([]);

  useEffect(() => {
    async function getChats() {
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
      console.log(records);
      if (records) {
        const dwnChats = [];
        for (const record of records) {
          const chatListItem = await record.data.json();
          console.log(record, chatListItem);
          const participants = chatListItem.recipients.filter(
            (recipientDid: string) => recipientDid !== userDid,
          );
          const dwnChat = {
            who: {
              name:
                participants.length > 1
                  ? 'Group'
                  : participants[0].slice(0, 24), //arbitrary slice
              picture: Fox,
            },
            what: {
              message: 'Message',
              timestamp: convertTime(record.dateModified),
              from:
                chatListItem[chatListItem.length - 1] === userDid
                  ? 'self'
                  : 'friend',
              delivered: true,
              seen: true,
            },
            id: record.id,
          };
          dwnChats.push(dwnChat);
        }
        setChats(dwnChats);
      }
    }
    void getChats();
  }, []);

  function copyDid() {
    navigator.clipboard.writeText(userDid);
  }

  return (
    <div>
      <div className="profile-row">
        <button onClick={copyDid}>Copy my DID</button>
      </div>
      <div className="profile-row">
        <label htmlFor="recipientDid" className="sr-only">
          To:{' '}
        </label>
        <input
          autoComplete="off"
          id="recipientDid"
          type="text"
          ref={recipientDidRef}
          placeholder="To:"
        />
        <button onClick={startChat}>+ New Chat</button>
      </div>
      <div className="profile-row">
        <button onClick={getFriendProfile}>Get profile</button>
        <button onClick={getFriendChat}>Get chat</button>
      </div>
      <div className="profile-row">
        <div className="avatar">
          <img src={profile?.imgSrc} alt="" />
        </div>
        <h1>{profile?.name}</h1>
      </div>
      <ul className="messages">
        {chats.map((chat, index) => {
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

const mockChats = [
  {
    who: {
      name: 'Dignal Welcome Chat',
      picture: Fox,
    },
    what: {
      message: 'Last message outbound',
      timestamp: '2023-08-09T01:13:54.402Z',
      from: 'self',
      delivered: true,
      seen: true,
    },
    id: '123', //recordId of the thread
  },
  {
    who: {
      name: 'Rando friend',
      picture: Elephant,
    },
    what: {
      message: 'Last message inbound continues onto second line',
      timestamp: '2023-08-07T01:13:54.402Z',
      from: 'friend',
      delivered: true,
      seen: true,
    },
    id: '456',
  },
  {
    who: {
      name: 'Other rando friend',
      picture: Bat,
    },
    what: {
      message: 'Last message inbound continues onto second line and is unread',
      timestamp: '2023-08-07T01:13:54.402Z',
      from: 'friend',
      delivered: true,
      seen: false,
    },
    id: '789',
  },
];

export type singleChat = (typeof mockChats)[0];

for (const chat of mockChats) {
  chat.what.timestamp = convertTime(chat.what.timestamp);
}

function convertTime(time: string) {
  const now = new Date();
  const inputTime = new Date(time);
  const timeDifference = now.getTime() - inputTime.getTime();
  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  if (timeDifference < oneDay && inputTime.getDate() === now.getDate()) {
    const formattedTime = `${inputTime.getHours()}:${String(
      inputTime.getMinutes(),
    ).padStart(2, '0')}`;
    const period = inputTime.getHours() >= 12 ? 'pm' : 'am';
    return `${formattedTime} ${period}`;
  } else if (timeDifference < 2 * oneDay) {
    return 'Yesterday';
  } else if (timeDifference < oneWeek) {
    const daysOfWeek = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    return daysOfWeek[inputTime.getDay()];
  } else {
    const formattedDate = `${inputTime.getFullYear()}-${String(
      inputTime.getMonth() + 1,
    ).padStart(2, '0')}-${String(inputTime.getDate()).padStart(2, '0')}`;
    return formattedDate;
  }
}
