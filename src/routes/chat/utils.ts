import { ProfileProtocol } from '@/util/protocols/profile.protocol';
import { queryRecords, readRecord, userDid, writeRecord } from '@/util/web5';
import SingleUser from '@assets/sample-pictures/single-user.svg';
import GroupUser from '@assets/sample-pictures/group-user.svg';
import { IProfileRecord } from './types';
import { ChatProtocol } from '@/util/protocols/chat.protocol';

export async function getParticipantProfile(participant: string) {
  const { records: profileRecords } = await queryRecords({
    from: participant,
    message: {
      filter: {
        protocol: ProfileProtocol.protocol,
        protocolPath: 'profile',
      },
    },
  });
  if (profileRecords && profileRecords.length > 0) {
    const profileData = await profileRecords[0].data.json();
    const { record: photoRecord } = await readRecord({
      from: participant,
      message: {
        recordId: profileData.picture,
      },
    });
    const photoData = await photoRecord.data.blob();
    return { name: profileData.name, picture: photoData };
  }
}

export async function getChatProfile(
  participants: string[],
): Promise<IProfileRecord> {
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

export async function writeMessageToDwn(
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
}
