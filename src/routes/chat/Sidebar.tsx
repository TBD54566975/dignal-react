import { useEffect, useState } from 'react';
import { ProfileProtocol } from '../../util/protocols/profile.protocol';
import { queryRecords, readRecord } from '../../util/web5';
import Bat from '../../assets/sample-pictures/bat.png';
import Elephant from '../../assets/sample-pictures/elephant.png';
import Fox from '../../assets/sample-pictures/fox.png';
import ChatLink from './components/ChatLink';

function Sidebar() {
  const [profilePicture, setProfilePicture] = useState('');
  const [profileName, setProfileName] = useState('');

  useEffect(() => {
    async function getProfile() {
      const { records } = await queryRecords({
        message: {
          filter: {
            protocol: ProfileProtocol.protocol,
            schema: ProfileProtocol.types.profile.schema,
            dataFormat: 'application/json',
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
        setProfileName(profiledata.name);
        setProfilePicture(URL.createObjectURL(blob));
      }
    }
    void getProfile();
  }, []);

  console.log('render - sidebar');

  return (
    <div>
      <div className="profile-row">
        <div className="avatar">
          <img src={profilePicture} alt="" />
        </div>
        <h1>{profileName}</h1>
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
