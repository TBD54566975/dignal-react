import { KeyboardEvent, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { userDid, queryRecords, readRecord, writeRecord } from '@util/web5';
import { ChatProtocol } from '@util/protocols/chat.protocol';
import { getParticipantProfile } from '../../utils';
import { IChatMessage, IProfileRecord } from '../../types';
import SingleUser from '@assets/sample-pictures/single-user.svg';
import GroupUser from '@assets/sample-pictures/group-user.svg';

function ChatDetail() {
  const chatId = useOutletContext<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentChatProfile, setCurrentChatProfile] =
    useState<IProfileRecord>();
  const [recipients, setRecipients] = useState<string[]>();
  const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);

  useEffect(() => {
    const intervalId = setInterval(async () => {
      const messages = await populateMessages(chatId);
      setCurrentMessages(messages);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [chatId]);

  useEffect(() => {
    setIsLoading(true);
    async function getChatItem() {
      const messages = await populateMessages(chatId);
      setCurrentMessages(messages);
      const { record } = await readRecord({
        message: { recordId: chatId },
      });
      if (!record) {
        setIsError(true);
      }
      const chatItem = await record.data.json();
      const participants = chatItem.recipients.filter(
        (recipientDid: string) => recipientDid !== userDid,
      );
      const chatProfile = await getChatProfile(participants);
      setRecipients(participants);
      setCurrentChatProfile(chatProfile);
      setIsLoading(false);
    }
    void getChatItem();
  }, [chatId]);

  async function sendMessage(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value) {
      if (recipients) {
        const messages = await writeMessageToDwn(
          e.currentTarget.value,
          chatId,
          recipients,
        );
        setCurrentMessages(messages);
      }
      e.currentTarget.value = '';
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            loading...
          </div>
        </div>
      ) : isError ? (
        <div className="layout">
          <div className="row text-center justify-center m-auto row-px">
            Error loading message
          </div>
        </div>
      ) : (
        <div className="container text-center">
          <div className="row-px chat-header">
            <div className="avatar">
              <img src={currentChatProfile?.picture} alt="" />
            </div>
            <div className="chat-name">
              <h2>{currentChatProfile?.name}</h2>
            </div>
          </div>
          <div className="history-window visually-hide-scrollbar">
            <div className="chat-window">
              {currentMessages.map((chat, index) => {
                return (
                  <p
                    key={index}
                    data-record-id={chat.id}
                    className={`${chat.isAuthor ? 'sent' : 'received'}`}
                  >
                    {chat.message}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="row-px message-input">
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
              onKeyUp={sendMessage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatDetail;

async function getChatProfile(participants: string[]) {
  if (participants.length > 1) {
    return {
      name: 'Group',
      picture: GroupUser,
    };
  } else {
    const profile = await getParticipantProfile(participants[0]);
    return {
      name: (profile && profile.name) || participants[0].slice(0, 24), //arbitrary slice
      picture: (profile && URL.createObjectURL(profile.picture)) || SingleUser,
    };
  }
}

async function writeMessageToDwn(
  text: string,
  chatId: string,
  recipients: string[],
) {
  //TODO: remove author from data once issue resolved
  const { record } = await writeRecord({
    data: {
      text,
      author: userDid,
    },
    message: {
      protocol: ChatProtocol.protocol,
      protocolPath: 'message/reply',
      schema: ChatProtocol.types.message.schema,
      contextId: chatId,
      parentId: chatId,
    },
  });
  if (record) {
    if (recipients && recipients.length > 0) {
      for (const targetRecipient of recipients) {
        await record.send(targetRecipient);
      }
    }
  }
  return await populateMessages(chatId);
}

async function populateMessages(contextId: string) {
  const { records } = await queryRecords({
    message: {
      filter: { contextId, protocolPath: 'message/reply' },
    },
  });
  const messages = [];
  if (records) {
    for (const record of records) {
      const data = await record.data.json();
      messages.push({
        message: data.text,
        timestamp: record.dateModified,
        //TODO: change to `record.author`
        isAuthor: userDid === data.author,
        delivered: true,
        seen: true,
        id: record.id,
      });
    }
  }
  return messages;
}
