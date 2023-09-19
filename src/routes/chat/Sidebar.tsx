import { useEffect, useRef, useState } from 'react';
import { ProfileProtocol } from '../../util/protocols/profile.protocol';
import { did, queryRecords, readRecord, writeRecord } from '../../util/web5';
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
    const profile = {
      name: 'Dignal Welcome',
      did: recipientDidRef?.current?.value ?? '123',
      image: 'test.png',
    };
    const { status, record } = await writeRecord({
      data: {
        recipients: [profile],
      },
      message: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
        schema: ChatProtocol.types.message.schema,
        recipient: recipientDidRef?.current?.value,
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

  useEffect(() => {
    async function getProfile() {
      const { records } = await queryRecords({
        message: {
          filter: {
            protocol: ProfileProtocol.protocol,
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

  useEffect(() => {
    async function getChats() {
      const { records } = await queryRecords({
        message: {
          filter: {
            protocol: ChatProtocol.protocol,
            schema: ChatProtocol.types.message.schema,
            dataFormat: ChatProtocol.types.message.dataFormats[0],
          },
        },
      });
      if (records) {
        for (const record of records) {
          const chatListItem = await record.data.json();
          console.log(record, chatListItem);
        }
      }
    }
    void getChats();
  }, []);

  return (
    <div>
      <div className="did-row">
        <p>My DID:</p>
        <p>{did}</p>
      </div>
      <div className="profile-row">
        <label htmlFor="recipientDid" className="sr-only">
          To:{' '}
        </label>
        <input
          id="recipientDid"
          type="text"
          ref={recipientDidRef}
          placeholder="To:"
        />
        <button onClick={startChat}>+ New Chat</button>
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

const chats = [
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

export type singleChat = (typeof chats)[0];

for (const chat of chats) {
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
