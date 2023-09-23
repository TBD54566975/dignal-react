import { ProfileProtocol } from '@/util/protocols/profile.protocol';
import { queryRecords, readRecord } from '@/util/web5';

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
