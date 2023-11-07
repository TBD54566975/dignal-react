import { ChatsProtocol } from './protocols/chats.protocol';
import {
  QueryDateSort,
  queryRecords,
  readRecord,
  userDid,
  writeRecord,
} from './web5';
import { Record } from '@web5/api';
import {
  getFullUserProfileWithFallbacks,
  getProfileNameIconAndIconAltForDisplay,
  getUserProfileNameWithFallback,
} from './profile';
import { useOutletContext } from 'react-router-dom';
import SingleUser from '@assets/users/single-user.svg';

export async function createPrivateOrGroupChat(type: 'private' | 'group') {
  try {
    const chatContextParticipants = [userDid];
    const { record, status } = await createNewChat();
    if (record) {
      await addChatMetadata({
        type,
        participants: chatContextParticipants,
        parent: record,
      });
      await createNewChatInviteContextId({ parent: record });
      const { record: thread } = await createNewChatThread({
        parent: record,
      });
      if (thread) {
        await createNewChatThreadLog({
          parent: thread,
          log:
            (await getUserProfileNameWithFallback()) +
            ' joined this chat (this is you)',
        });
      }
      return record;
    } else {
      console.error(status);
    }
  } catch (e) {
    console.error(e);
  }
}

export async function createNewChat() {
  return await writeRecord({
    data: {},
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat',
      schema: 'chat',
    },
  });
}

export async function addChatMetadata({
  participants,
  type,
  parent,
}: {
  participants: string[];
  type: 'private' | 'group';
  parent: Pick<Record, 'id' | 'contextId'>;
}) {
  return await writeRecord({
    data: {
      participants,
      type,
    },
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/metadata',
      schema: 'metadata',
      parentId: parent.id,
      contextId: parent.contextId,
    },
  });
}

export async function createNewChatInviteContextId({
  parent,
}: {
  parent: Pick<Record, 'id' | 'contextId'>;
}) {
  return await writeRecord({
    data: {},
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/invite',
      schema: 'invite',
      parentId: parent.id,
      contextId: parent.contextId,
    },
  });
}

export async function createNewChatThread({
  parent,
}: {
  parent: Pick<Record, 'id' | 'contextId'>;
}) {
  return await writeRecord({
    data: {},
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/thread',
      schema: 'thread',
      parentId: parent.id,
      contextId: parent.contextId,
    },
  });
}

export async function createNewChatThreadLog({
  parent,
  log,
}: {
  parent: Pick<Record, 'id' | 'contextId'>;
  log: string;
}) {
  return await writeRecord({
    data: log,
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/thread/log',
      schema: 'log',
      parentId: parent.id,
      contextId: parent.contextId,
      recipient: userDid,
    },
  });
}

export async function createNewChatThreadMessage({
  parent,
  message,
}: {
  parent: Pick<Record, 'id' | 'contextId'>;
  message: string;
}) {
  return await writeRecord({
    data: message,
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/thread/message',
      schema: 'message',
      parentId: parent.id,
      contextId: parent.contextId,
      recipient: userDid,
    },
  });
}

export async function createNewRequestToEnterChat(inviteRecordId: string) {
  return await writeRecord({
    data: inviteRecordId,
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'request',
      schema: 'request',
      recipient: userDid,
    },
  });
}

export async function getAllChatContexts() {
  return await queryRecords({
    message: {
      filter: {
        protocol: ChatsProtocol.protocol,
        protocolPath: 'chat',
      },
      dateSort: 'createdDescending' as QueryDateSort,
    },
  });
}

export async function getChatContext(contextId: string) {
  return await readRecord({
    filter: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat',
      contextId,
    },
  });
}

export async function getChatMetadata(contextId: string) {
  return await readRecord({
    filter: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/metadata',
      contextId,
    },
  });
}

export async function getChatInviteByRecordId({
  recordId,
  from,
}: {
  recordId?: string;
  from?: string;
}) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/invite',
      recordId,
    },
  });
}

export async function getChatInviteByContextId({
  contextId,
  from,
}: {
  contextId?: string;
  from?: string;
}) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/invite',
      contextId,
    },
  });
}

export async function getAllRequestsToEnterChats(recipient?: string) {
  return await queryRecords({
    message: {
      filter: {
        protocol: ChatsProtocol.protocol,
        protocolPath: 'request',
        schema: 'request',
        ...(recipient && { recipient }),
      },
    },
  });
}

export async function getRequestToEnterChat() {
  return await queryRecords({
    message: {
      filter: {
        protocol: ChatsProtocol.protocol,
        protocolPath: 'request',
      },
      dateSort: 'createdAscending' as QueryDateSort,
    },
  });
}

export async function mapRequestToChatListContextItemId(records: Record[]) {
  const requestMap = new Map();
  for (const requestRecord of records) {
    const inviteId = await requestRecord.data.text();
    const participantDetailsToAdd = {
      name: await getUserProfileNameWithFallback(requestRecord.recipient),
      request: requestRecord,
    };
    const { record: inviteRecord } = await getChatInviteByRecordId(inviteId);
    if (inviteRecord) {
      const chatId = inviteRecord.contextId;
      if (requestMap.has(chatId)) {
        requestMap.get(chatId).push(participantDetailsToAdd);
      } else {
        requestMap.set(chatId, [participantDetailsToAdd]);
      }
    }
  }
  return requestMap;
}

export async function getChatContextThread(contextId: string) {
  return await readRecord({
    filter: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat/thread',
      contextId,
    },
  });
}

export async function getChatContextThreadRecords(parentId: string) {
  return await queryRecords({
    message: {
      filter: {
        parentId,
      },
      dateSort: 'createdAscending' as QueryDateSort,
    },
  });
}

export async function transformChatContextToChatListEntry(
  record: Pick<Record, 'id' | 'contextId' | 'data' | 'dateModified'>,
  requestList?: { request: Record; name: string }[],
) {
  const metadata = await getChatMetadata(record.contextId);
  const data = await metadata.record.data.json();

  const externalParticipants = data.participants.filter(
    (did: string) => did !== userDid,
  );
  const [name, icon, iconAlt] = await getProfileNameIconAndIconAltForDisplay({
    type: data.type,
    ...(externalParticipants === 1 && {
      participant: externalParticipants[0],
    }),
  });

  const invite = await getChatInviteByContextId({
    contextId: record.contextId,
  });
  const thread = await getChatContextThread(record.contextId);
  const { records } = await getChatContextThreadRecords(thread.record.id);
  const mostRecentChatContextThreadRecord = records?.[records.length - 1];

  const profiles = new Map();
  for (const participant of data.participants) {
    profiles.set(
      participant,
      await getFullUserProfileWithFallbacks(
        matchUserDidToTargetDid(participant) ? undefined : participant,
      ),
    );
  }
  return {
    participants: data.participants,
    type: data.type,
    contextId: record.contextId,
    icon,
    iconAlt,
    name,
    latest:
      (await mostRecentChatContextThreadRecord?.data.text()) ?? 'No messages',
    timestamp:
      mostRecentChatContextThreadRecord?.dateModified ?? record.dateModified,
    thread: thread.record,
    records,
    profiles,
    ...(invite.record && { inviteRecordId: invite.record.id }),
    ...(requestList && { requestList }),
  };
}

export async function hydrateChatList() {
  const { records } = await getAllChatContexts();
  if (records) {
    const { records: requests } = await getAllRequestsToEnterChats();
    const mappedRequests =
      requests && (await mapRequestToChatListContextItemId(requests));
    const data = Promise.all(
      records.map(async record => {
        if (mappedRequests?.get(record.contextId)?.recipient === userDid) {
          await mappedRequests?.get(record.contextId).delete();
        }
        return await transformChatContextToChatListEntry(
          record,
          mappedRequests?.get(record.contextId),
        );
      }),
    );
    return await data;
  }
}

export type ChatListContextItem = {
  type: 'private' | 'group';
  participants: string[];
  contextId: string;
  icon: string;
  iconAlt: string;
  name: string;
  latest: string;
  timestamp: string;
  thread: Record;
  records?: Record[];
  profiles: Map<
    string,
    Promise<{ label: string; name: string; icon: string; iconAlt: string }>
  >;
  inviteRecordId?: string;
  requestList?: { request: Record; name: string }[];
};
export type ChatContextValue = { [contextId: string]: ChatListContextItem };
export type ChatContext = [
  ChatContextValue | undefined,
  React.Dispatch<React.SetStateAction<ChatContextValue | undefined>>,
];

export async function setChatList() {
  const chatList = await hydrateChatList();
  return (
    chatList && Object.fromEntries(chatList.map(chat => [chat.contextId, chat]))
  );
}

export function useChatContext() {
  const { chats } = useOutletContext<{ chats: ChatContext }>();
  return chats;
}

export function matchRecordSchema(recordSchema: string, targetSchema: string) {
  return (
    recordSchema === targetSchema || recordSchema === `http://${targetSchema}`
  );
}

// For now, we will store the user's DID in the recipient field
// until other means of determining original authorship in the record wrapper
export function matchUserDidToTargetDid(targetDid: string) {
  return targetDid === userDid;
}

export function constructChatInviteUrl(recordId: string) {
  return '?i=' + recordId + '&d=' + userDid;
}

export function parseChatInviteUrl(inviteUrlSearchQuery: string) {
  const params = new URLSearchParams(inviteUrlSearchQuery);
  const inviteId = params.get('i');
  const did = params.get('d');
  return inviteId && did && { inviteId, did };
}

export type ChatRecordDisplayProps = {
  messageIsSentFromUser: boolean;
  messageIcon: string;
  messageIconAlt: string;
  recordData: string | Blob;
  recordId: string;
  recordSchema: string;
}[];

// TODO: Pull profile icons from external participants DWN once dwn-server picks up latest
export async function transformDwnRecordToChatRecord(
  record: Record,
  messageIcon: string = SingleUser,
  messageIconAlt: string = 'Single user avatar',
) {
  const messageIsSentFromUser = matchUserDidToTargetDid(record.recipient);

  const recordData =
    record.dataFormat === 'text/plain'
      ? await record.data.text()
      : await record.data.blob();
  const recordId = record.id;
  const recordSchema = record.schema;

  return {
    messageIsSentFromUser,
    messageIcon,
    messageIconAlt,
    recordData,
    recordId,
    recordSchema,
  };
}

export async function sendRecordToParticipants(
  record: Record,
  participants: string[],
) {
  for (const participant of participants) {
    await record.send(participant);
  }
}

export async function getNewRequestToEnterChatError({
  inviteId,
  from,
}: {
  inviteId: string;
  from: string;
}) {
  if (matchUserDidToTargetDid(from)) {
    return new Error("You can't request access from yourself.");
  }
  const { records: requests } = await getAllRequestsToEnterChats(userDid);
  if (requests) {
    for (const request of requests) {
      if ((await request.data.text()) === inviteId) {
        return new Error('You have already sent a request');
      }
    }
  }
  const { record: inviteRecord } = await getChatInviteByRecordId({
    recordId: inviteId,
    from,
  });
  if (inviteRecord) {
    const { record: chatContextRecord } = await getChatContext(
      inviteRecord.contextId,
    );
    if (chatContextRecord) {
      return new Error('You already have this chat.');
    }
    return;
  }
  return new Error('This invite no longer exists.');
}

export async function approveRequestToEnterChat({
  request,
  inviteId,
}: {
  request: Record;
  inviteId?: string;
}) {
  // get the chat context record, then send to the new participant
  const { record: invite } = await getChatInviteByRecordId({
    recordId: inviteId,
  });
  const { record: chatContext } = await getChatContext(invite.contextId);
  await chatContext.send(request.recipient);
  // update the participant list in the metadata , then send that to the new participant
  const { record: metadata } = await getChatMetadata(invite.contextId);
  const metadataBody = await metadata.data.json();
  await metadata.update({
    data: {
      participants: [...metadataBody.participants, request.recipient],
      ...metadataBody,
    },
  });
  await metadata.send(request.recipient);
  // get the chat thread, then send that to the new participant
  const { record: thread } = await getChatContextThread(invite.contextId);
  await thread.send(request.recipient);
  // get all chat thread records, then send those to the new participant
  const { records: messages } = await getChatContextThreadRecords(thread.id);

  messages &&
    Promise.all(
      messages.map((message: Record) => {
        return message.send(request.recipient);
      }),
    );
  if (metadataBody.type === 'private') {
    Promise.all([
      await invite.delete(),
      await createNewChatThreadLog({
        parent: thread,
        log: 'No one else can join this 1:1 chat',
      }),
    ]);
  }

  return await request.delete();
}

export async function declineRequestToEnterChat(request: Record) {
  return await request.delete();
}

export function updateChatParentContextAfterHandlingRequest(
  chatParentContext: ChatListContextItem,
  requestingParticipant: { request: Record; name: string },
) {
  if (
    chatParentContext.requestList &&
    chatParentContext.requestList.length < 2
  ) {
    delete chatParentContext.inviteRecordId;
    delete chatParentContext.requestList;
  } else {
    chatParentContext.requestList =
      chatParentContext.requestList &&
      chatParentContext.requestList.filter(
        requestItem =>
          requestItem.request.id !== requestingParticipant.request.id,
      );
  }
  return chatParentContext;
}
