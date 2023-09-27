import { useState, KeyboardEvent, useEffect } from 'react';
import { IProfileRecord } from '../../types';
import { getChatProfile, writeMessageToDwn } from '../../utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatHeader from './ChatHeader';
import { RoutePaths } from '@/routes';
import {
  queryFromDwnMessageReplies,
  queryFromDwnMessagesWithParticipant,
  queryFromDwnParticipantMessages,
  writeToDwnMessage,
} from '../../dwn';
import QrCode from './QrCode';
import { userDid } from '@/util/web5';

function NewChat() {
  const [recipientProfile, setRecipientProfile] = useState<
    IProfileRecord & { did: string; duplicateChatId?: string }
  >();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const recipientDid = searchParams.get('did');
    async function setRecipientFromInvite() {
      if (recipientDid) {
        const duplicateChatId = await checkForDuplicateChats(recipientDid);
        if (duplicateChatId && (await hasExistingMessages(duplicateChatId))) {
          return navigate(`${RoutePaths.CHAT}/${duplicateChatId}`, {
            replace: true,
          });
        }
        setRecipientProfile({
          ...(await getChatProfile([recipientDid])),
          did: recipientDid,
          duplicateChatId,
        });
      }
    }
    void setRecipientFromInvite();
  }, [searchParams, navigate]);

  async function addRecipients(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value) {
      setSearchParams({ did: e.currentTarget.value });
    }
  }

  async function startChatAndSendMessage(
    e: KeyboardEvent<HTMLInputElement> & HTMLInputElement,
  ) {
    e.preventDefault();
    if (e.key === 'Enter' && e.currentTarget.value && recipientProfile) {
      const messageToSend = e.currentTarget.value;
      const chatId =
        recipientProfile.duplicateChatId ||
        (await getNewChatId(recipientProfile.did));
      if (chatId) {
        await writeMessageToDwn(messageToSend, chatId, [recipientProfile.did]);
        navigate(`${RoutePaths.CHAT}/${chatId}`);
      }
    }
  }

  return (
    <div className="container text-center">
      <ChatHeader profile={recipientProfile} />
      {recipientProfile ? (
        <>
          <div className="history-window visually-hide-scrollbar"></div>
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
        </>
      ) : (
        <div className="history-window visually-hide-scrollbar">
          <div className="profile-column">
            <label htmlFor="recipientDid" className="sr-only">
              To:{' '}
            </label>
            <input
              autoFocus
              autoComplete="off"
              id="recipientDid"
              type="text"
              onKeyUp={addRecipients}
              placeholder="To:"
            />
            <p>or</p>
            <div className="m-auto">
              <h2>Share your QR</h2>
              <p>Scan this code from another account to start chatting</p>
              <QrCode id={userDid} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewChat;

async function checkForDuplicateChats(recipient: string) {
  // Check if chat exists already where user had initiated the chat
  let duplicateRecords = await queryFromDwnParticipantMessages(recipient);
  if (!duplicateRecords || duplicateRecords.length === 0) {
    // Else check if chat exists already where recipient had initiated chat
    duplicateRecords = await queryFromDwnMessagesWithParticipant(recipient);
  }
  if (duplicateRecords && duplicateRecords.length > 0) {
    if (duplicateRecords.length > 1) {
      // TODO: catch this with tests
      console.warn('More than 1 record found for protocolPath `message`');
    }
    console.log(duplicateRecords);
    return duplicateRecords[0].contextId;
  }
  // Else, no existing duplicate chats were found
  return;
}

async function hasExistingMessages(contextId: string) {
  const savedRecords = await queryFromDwnMessageReplies(contextId);
  if (savedRecords && savedRecords.length > 0) {
    return true;
  }
  return false;
}

async function getNewChatId(recipient: string) {
  const record = await writeToDwnMessage(recipient);
  if (record) {
    await record.send(recipient);
    return record.id;
  }
}
