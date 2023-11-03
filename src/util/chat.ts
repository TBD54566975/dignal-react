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
  getUserProfileName,
} from './profile';
import { useOutletContext } from 'react-router-dom';
import SingleUser from '@assets/users/single-user.svg';

export async function createPrivateOrGroupChat(type: 'private' | 'group') {
  try {
    const chatContextParticipants = [userDid];
    const { record, status } = await createNewChat({
      type,
      participants: chatContextParticipants,
    });
    if (record) {
      const { record: thread } = await createNewChatThread({
        parent: record,
      });
      if (thread) {
        await createNewChatThreadLog({
          parent: thread,
          log:
            (await (await getUserProfileName()).record.data.text()) +
            ' joined this chat',
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

export async function createNewChat({
  participants,
  type,
}: {
  participants: string[];
  type: 'private' | 'group';
}) {
  return await writeRecord({
    data: {
      participants,
      type,
    },
    message: {
      protocol: ChatsProtocol.protocol,
      protocolPath: 'chat',
      schema: 'chat',
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

export async function getAllChatContexts() {
  return await queryRecords({
    message: {
      filter: {
        protocolPath: 'chat',
      },
      dateSort: 'createdDescending' as QueryDateSort,
    },
  });
}

export async function getAllChatsLatestEntries() {
  return await queryRecords({
    message: {
      filter: {
        protocolPath: 'chat/latest',
      },
      dateSort: 'createdDescending' as QueryDateSort,
    },
  });
}

export async function getChatContext(contextId: string) {
  return await readRecord({
    filter: {
      protocolPath: 'chat',
      contextId,
    },
  });
}

export async function getChatContextLatestEntry(contextId: string) {
  return await readRecord({
    filter: {
      protocolPath: 'chat/latest',
      contextId,
    },
  });
}

export async function getChatContextThread(contextId: string) {
  return await readRecord({
    filter: {
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
) {
  const latest = await getChatContextLatestEntry(record.contextId);
  const data = await record.data.json();
  const externalParticipants = data.participants.filter(
    (did: string) => did !== userDid,
  );
  const [name, icon, icon_alt] = await getProfileNameIconAndIconAltForDisplay({
    type: data.type,
    ...(externalParticipants === 1 && {
      participant: externalParticipants[0],
    }),
  });

  const thread = await getChatContextThread(record.contextId);
  const { records } = await getChatContextThreadRecords(thread.record.id);

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
    icon_alt,
    name,
    latest: (await latest.record?.data.text()) ?? 'No messages',
    timestamp: latest.record?.dateModified ?? record.dateModified,
    thread: thread.record,
    records,
    profiles,
  };
}

export async function hydrateChatList() {
  const { records } = await getAllChatContexts();
  if (records) {
    const data = Promise.all(
      records.map(async record => {
        return await transformChatContextToChatListEntry(record);
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
  icon_alt: string;
  name: string;
  latest: string;
  timestamp: string;
  records: Record[] | undefined;
  thread: Record;
  profiles: Map<
    string,
    Promise<{ label: string; name: string; icon: string; icon_alt: string }>
  >;
};
export type ChatContextValue = { [contextId: string]: ChatListContextItem };
export type ChatContext = [
  ChatContextValue | undefined,
  React.Dispatch<React.SetStateAction<ChatContextValue | undefined>>,
];

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

export function constructChatInviteUrl(contextId: string) {
  return '?c=' + contextId + '&d=' + userDid;
}

export function parseChatInviteUrl(inviteUrlSearchQuery: string) {
  const params = new URLSearchParams(inviteUrlSearchQuery);
  const contextId = params.get('c');
  const did = params.get('d');
  return { contextId, did };
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
