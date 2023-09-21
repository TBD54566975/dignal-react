import { convertTime } from '@/util/helpers';
import Bat from '@assets/sample-pictures/bat.png';
import Elephant from '@assets/sample-pictures/elephant.png';
import Fox from '@assets/sample-pictures/fox.png';

const mockChats = [
  {
    name: 'Dignal Welcome Chat',
    picture: Fox,
    message: 'Last message outbound',
    timestamp: '2023-08-09T01:13:54.402Z',
    isAuthor: true,
    delivered: true,
    seen: true,
    id: '123', //recordId of the thread
  },
  {
    name: 'Rando friend',
    picture: Elephant,
    message: 'Last message inbound continues onto second line',
    timestamp: '2023-08-07T01:13:54.402Z',
    isAuthor: false,
    delivered: true,
    seen: true,
    id: '456',
  },
  {
    name: 'Other rando friend',
    picture: Bat,
    message: 'Last message inbound continues onto second line and is unread',
    timestamp: '2023-08-07T01:13:54.402Z',
    isAuthor: false,
    delivered: true,
    seen: false,
    id: '789',
  },
];

for (const chat of mockChats) {
  chat.timestamp = convertTime(chat.timestamp);
}
