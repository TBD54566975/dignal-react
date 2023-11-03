import ChatRecord from '@/components/ChatRecord';
import { HeaderWithBackButton } from '@/components/HeaderWithBackButton';
import QrCode from '@/components/QrCode';
import {
  ChatRecordDisplayProps,
  constructChatInviteUrl,
  matchRecordSchema,
  transformDwnRecordToChatRecord,
  useChatContext,
} from '@/util/chat';
import { RoutePaths } from '@/util/routes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from './ChatId.module.css';
import ChatInputBar from '@/components/ChatInputBar';

export default function ChatId() {
  const params = useParams();
  const [chats] = useChatContext();
  const [messageList, setMessageList] = useState<ChatRecordDisplayProps>([]);
  const [messageCount, setMessageCount] = useState(0);

  const chatParentContext =
    params.contextId && chats && chats[params.contextId];

  const messageLengthAtPar = useMemo(
    () =>
      chatParentContext && chatParentContext.records?.length === messageCount,
    [chatParentContext, messageCount],
  );

  const anchorRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (anchorRef) {
      anchorRef.current?.scrollIntoView();
    }
  }, [messageLengthAtPar]);

  useEffect(() => {
    async function hydrateChatEntries() {
      if (
        chatParentContext &&
        chatParentContext.thread &&
        chatParentContext.records
      ) {
        if (!messageLengthAtPar) {
          const data = Promise.all(
            chatParentContext.records.map(async record => {
              const senderProfile = await chatParentContext.profiles.get(
                record.recipient,
              );
              return transformDwnRecordToChatRecord(
                record,
                senderProfile?.icon,
                senderProfile?.icon_alt,
              );
            }),
          );
          setMessageList(await data);
          setMessageCount(chatParentContext.records.length);
        }
      }
    }

    void hydrateChatEntries();
  }, [chatParentContext, messageLengthAtPar]);

  return (
    chatParentContext && (
      <div className="content">
        <HeaderWithBackButton
          title={chatParentContext.name}
          icon={chatParentContext.icon}
          icon_alt={chatParentContext.icon_alt}
        />
        <main>
          <div className="scroll-area">
            <div className="scroll-content visually-hide-scrollbar">
              <div className={styles.qrContainer}>
                <h2>
                  Invite
                  {chatParentContext.type === 'private'
                    ? ' a friend '
                    : ' friends '}
                  to join with this link:
                </h2>
                <QrCode
                  dataToEmbed={
                    location.origin +
                    RoutePaths.INVITE +
                    '/' +
                    constructChatInviteUrl(chatParentContext.contextId)
                  }
                />
              </div>
              <ul className={styles.messageList}>
                {messageList.map((messageListItem, index) => (
                  <li key={'chat-' + index}>
                    <div
                      className={
                        styles.chatRecordIconGroup +
                        ' ' +
                        (messageListItem.messageIsSentFromUser
                          ? styles.chatRecordIconGroupSent
                          : styles.chatRecordIconReceived)
                      }
                    >
                      <ChatRecord
                        recordData={messageListItem.recordData}
                        recordId={messageListItem.recordId}
                        recordSchema={messageListItem.recordSchema}
                        isSentFromUser={messageListItem.messageIsSentFromUser}
                      />
                      {!matchRecordSchema(
                        messageListItem.recordSchema,
                        'log',
                      ) && (
                        <div className={styles.chatRecordIcon}>
                          <img
                            width={48}
                            src={messageListItem.messageIcon}
                            alt={messageListItem.messageIconAlt}
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <div ref={anchorRef}></div>
            </div>
          </div>
          <ChatInputBar
            parentThreadId={chatParentContext.thread.id}
            contextId={chatParentContext.contextId}
          />
        </main>
      </div>
    )
  );
}
