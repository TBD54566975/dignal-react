import { KeyboardEvent, useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { userDid, queryRecords, readRecord } from '@util/web5';
import { getChatProfile, writeMessageToDwn } from '../../utils';
import { IChatMessage, IProfileRecord } from '../../types';
import { convertTime } from '../../../../util/helpers';
import { Record } from '@web5/api';
import ChatHeader from './ChatHeader';
import { VcJwt, VerifiableCredential } from '@web5/credentials';

function ChatDetail() {
  const chatId = useOutletContext<string>();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentChatProfile, setCurrentChatProfile] =
    useState<IProfileRecord>();
  const [recipients, setRecipients] = useState<string[]>();
  const [currentMessages, setCurrentMessages] = useState<IChatMessage[]>([]);
  const [currentRootRecord, setCurrentRootRecord] = useState<Record>();

  function resetChatContext() {
    setIsError(false);
    setCurrentChatProfile(undefined);
    setRecipients(undefined);
    setCurrentMessages([]);
  }

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    setIsLoading(true);
    async function fetchChatMessages() {
      const messages = await populateMessages(chatId);
      setCurrentMessages(messages);
    }
    async function getChatItem() {
      const { record, participants } = await getChatParticipants(chatId);
      setCurrentRootRecord(record);
      if (!record) {
        setIsError(true);
      } else {
        // populate messages the first time
        void fetchChatMessages();
        // query every 5 seconds for more
        intervalId = setInterval(async () => {
          void fetchChatMessages();
        }, 5000);
        // get the chat participants
        const chatProfile = await getChatProfile(participants);
        setRecipients(participants);
        setCurrentChatProfile(chatProfile);
      }
      setIsLoading(false);
    }
    void getChatItem();
    return () => {
      clearInterval(intervalId);
      resetChatContext();
    };
  }, [chatId]);

  async function sendMessage(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value) {
      const messageToSend = e.currentTarget.value;
      e.currentTarget.value = '';
      if (recipients && currentRootRecord) {
        await writeMessageToDwn(messageToSend, chatId, recipients);
        const messages = await populateMessages(chatId);
        setCurrentMessages(messages);
      }
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
          <ChatHeader profile={currentChatProfile} />
          <div className="history-window visually-hide-scrollbar">
            <div className="chat-window-inner">
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
              onKeyUp={sendMessage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ChatDetail;

async function getChatParticipants(chatId: string) {
  const { record } = await readRecord({
    message: { recordId: chatId },
  });
  if (!record) return { record };
  const chatItem = await record.data.json();
  const participants = chatItem.recipients.filter(
    (recipientDid: string) => recipientDid !== userDid,
  );
  return { record, participants };
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
        timestamp: convertTime(record.dateModified),
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