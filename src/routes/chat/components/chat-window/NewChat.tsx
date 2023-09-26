import { ChatProtocol } from '@/util/protocols/chat.protocol';
import { queryRecords, userDid, writeRecord } from '@/util/web5';
import { useState, KeyboardEvent } from 'react';
import { IProfileRecord } from '../../types';
import { getChatProfile, writeMessageToDwn } from '../../utils';
import { useNavigate } from 'react-router-dom';
import ChatHeader from './ChatHeader';

function NewChat() {
  const [recipientProfile, setRecipientProfile] = useState<
    IProfileRecord & { did: string }
  >();

  const navigate = useNavigate();

  async function addRecipients(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value) {
      const recipientDid = e.currentTarget.value;
      const duplicateChatId = await checkForDuplicateRecords(recipientDid);
      if (duplicateChatId) {
        navigate(`/chat/${duplicateChatId}`);
      }
      setRecipientProfile({
        ...(await getChatProfile([recipientDid])),
        did: recipientDid,
      });
    }
  }

  async function startChatAndSendMessage(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value && recipientProfile) {
      const messageToSend = e.currentTarget.value;
      const chatId = await getNewChatId(recipientProfile.did);
      if (chatId) {
        await writeMessageToDwn(messageToSend, chatId, [recipientProfile.did]);
        navigate(`/chat/${chatId}`);
      }
    }
  }
  return (
    <div className="container text-center">
      <ChatHeader profile={recipientProfile} />
      {!recipientProfile && (
        <div className="profile-column">
          <label htmlFor="recipientDid" className="sr-only">
            To:{' '}
          </label>
          <input
            autoComplete="off"
            id="recipientDid"
            type="text"
            onKeyUp={addRecipients}
            placeholder="To:"
          />
          <p>or</p>
          <button>Share my QR</button>
        </div>
      )}
      <div className="history-window visually-hide-scrollbar">
        <div className="chat-window">
          {/* Empty window for presentation purposes only */}
        </div>
      </div>
      {recipientProfile && (
        <div className="message-input">
          <label htmlFor="messageInput" className="sr-only">
            Enter message
          </label>
          <input
            autoComplete="off"
            id="messageInput"
            name="message"
            type="text"
            className="chat-input"
            placeholder="Enter message"
            onKeyUp={startChatAndSendMessage}
          />
        </div>
      )}
    </div>
  );
}

export default NewChat;

async function checkForDuplicateRecords(recipient: string) {
  // Check if chat exists already where user had initiated the chat
  let duplicateRecords;
  const { records: duplicateRecordsFrom } = await queryRecords({
    from: recipient,
    message: {
      filter: {
        protocol: ChatProtocol.protocol,
        protocolPath: 'message',
      },
    },
  });
  duplicateRecords = duplicateRecordsFrom;
  if (!duplicateRecordsFrom || duplicateRecordsFrom.length === 0) {
    // Else check if chat exists already where recipient had initiated chat
    const { records: duplicateRecordsTo } = await queryRecords({
      message: {
        filter: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message',
          recipient,
        },
      },
    });
    duplicateRecords = duplicateRecordsTo;
  }
  if (duplicateRecords && duplicateRecords.length > 0) {
    if (duplicateRecords.length > 1) {
      // TODO: catch this with tests
      console.warn('More than 1 record found for protocolPath `message`');
    }
    // check to see if chats were previously wiped, which would be a new chat for our user
    const { records: savedRecords } = await queryRecords({
      message: {
        filter: {
          protocol: ChatProtocol.protocol,
          protocolPath: 'message/reply',
          contextId: duplicateRecords[0].contextId,
        },
      },
    });
    if (savedRecords && savedRecords.length > 0) {
      return duplicateRecords[0].id;
    }
  }
  // Else, no duplicates were found
  return null;
}

async function getNewChatId(recipient: string) {
  const { record } = await writeRecord({
    data: {
      recipients: [recipient, userDid],
    },
    message: {
      protocol: ChatProtocol.protocol,
      protocolPath: 'message',
      schema: ChatProtocol.types.message.schema,
      recipient: userDid, // make self the recipient just so we can check for dupes
      // since we dont want to publish all our chats so anyone can query
    },
  });
  if (record) {
    await record.send(recipient);
    return record.id;
  }
}
