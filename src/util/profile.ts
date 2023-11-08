import { ChatsProtocol } from '@/util/protocols/chats.protocol';
import { ProfilesProtocol } from '@/util/protocols/profiles.protocol';
import {
  connectWeb5,
  queryForAndSetProtocol,
  queryRecords,
  readRecord,
  userDid,
  writeRecord,
} from '@/util/web5';
import { sampleProfile } from './sampleProfiles';
import { convertUrlToBlob, convertBlobToUrl } from './helpers';
import SingleUser from '@assets/users/single-user.svg';
import GroupUsers from '@assets/users/group-users.svg';

interface RelatedRecord {
  parentId: string;
  contextId: string;
}

export async function setUpWeb5User() {
  await connectWeb5();
  return Promise.all([
    queryForAndSetProtocol(ChatsProtocol),
    queryForAndSetProtocol(ProfilesProtocol),
  ]);
}

export async function checkForAndSetProfiles() {
  const { records, status } = await getAllUserProfileContexts();
  if (records && records.length) {
    return { records, status };
  } else {
    return { records: [(await setWeb5UserStarterProfile()).record], status };
  }
}

export async function setWeb5UserStarterProfile() {
  const responses = await createFullUserProfile({
    label: 'My first profile',
    ...sampleProfile,
  });
  for (const response of Object.values(responses)) {
    await response?.record?.send(userDid);
  }
  return responses.profile;
}

export async function createFullUserProfile({
  label,
  name,
  icon,
  iconAlt,
}: Omit<ProfileListContextItem, 'contextId' | 'did' | 'dateCreated'>) {
  const profileResponse = await createUserProfileContext();
  const profileLabelResponse =
    profileResponse.record &&
    (await addProfileLabel(label, {
      contextId: profileResponse.record.contextId,
      parentId: profileResponse.record.id,
    }));
  const profileNameResponse =
    profileResponse.record &&
    (await addProfileName(name, {
      contextId: profileResponse.record.contextId,
      parentId: profileResponse.record.id,
    }));
  const profileIconResponse =
    profileResponse.record &&
    (await addProfileIcon(await convertUrlToBlob(icon), {
      contextId: profileResponse.record.contextId,
      parentId: profileResponse.record.id,
    }));
  const profileIconAltTextResponse =
    profileIconResponse &&
    profileIconResponse.record &&
    (await addProfileIconAltText(iconAlt, {
      contextId: profileIconResponse.record.contextId,
      parentId: profileIconResponse.record.id,
    }));
  return {
    profile: profileResponse,
    label: profileLabelResponse,
    name: profileNameResponse,
    icon: profileIconResponse,
    iconAlt: profileIconAltTextResponse,
  };
}

export async function createUserProfileContext() {
  return await writeRecord({
    data: {},
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile',
      schema: 'profile',
      published: true,
    },
  });
}

export async function addProfileLabel(
  label: string,
  { contextId, parentId }: RelatedRecord,
) {
  return await writeRecord({
    data: label,
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/label',
      schema: 'label',
      contextId,
      parentId,
      published: true,
    },
  });
}

export async function addProfileName(
  name: string,
  { contextId, parentId }: RelatedRecord,
) {
  return await writeRecord({
    data: name,
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/name',
      schema: 'name',
      contextId,
      parentId,
      published: true,
    },
  });
}

export async function addProfileIcon(
  icon: Blob,
  { contextId, parentId }: RelatedRecord,
) {
  return await writeRecord({
    data: icon,
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/icon',
      schema: 'icon',
      contextId,
      parentId,
      published: true,
    },
  });
}

export async function addProfileIconAltText(
  altText: string,
  { contextId, parentId }: RelatedRecord,
) {
  return await writeRecord({
    data: altText,
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/icon/iconAlt',
      schema: 'iconAlt',
      contextId,
      parentId,
      published: true,
    },
  });
}

export async function getFullUserProfileWithFallbacks(
  from?: string,
  contextId?: string,
) {
  return {
    label: await getUserProfileLabelWithFallback(from, contextId),
    name: await getUserProfileNameWithFallback(from, contextId),
    icon: await getUserProfileIconWithFallback(from, contextId),
    iconAlt: await getUserProfileIconAltWithFallback(from, contextId),
  };
}

export async function getAllUserProfileContexts(from?: string) {
  return await queryRecords({
    ...(from && { from }),
    message: {
      filter: {
        protocol: ProfilesProtocol.protocol,
        protocolPath: 'profile',
      },
    },
  });
}

export async function getUserProfileContext(from?: string, contextId?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile',
      ...(contextId && { contextId }),
    },
  });
}

export async function getUserProfileLabel(from?: string, contextId?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/label',
      ...(contextId && { contextId }),
    },
  });
}

export async function getUserProfileName(from?: string, contextId?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/name',
      ...(contextId && { contextId }),
    },
  });
}

export async function getUserProfileIcon(from?: string, contextId?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/icon',
      ...(contextId && { contextId }),
    },
  });
}

export async function getUserProfileIconAlt(from?: string, contextId?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/icon/iconAlt',
      ...(contextId && { contextId }),
    },
  });
}

export async function getProfileNameIconAndIconAltForDisplay({
  type,
  participant,
  contextId,
}: {
  type: 'private' | 'group';
  participant?: string;
  contextId?: string;
}) {
  return type === 'group'
    ? ['New group chat', GroupUsers, 'Group of user avatars']
    : participant
    ? [
        await getUserProfileNameWithFallback(participant, contextId),
        await getUserProfileIconWithFallback(participant, contextId),
        await getUserProfileIconAltWithFallback(participant, contextId),
      ]
    : ['New 1:1 chat', SingleUser, 'Single user avatar'];
}

export async function getUserProfileLabelWithFallback(
  participant?: string,
  contextId?: string,
): Promise<string> {
  const { record } = await getUserProfileLabel(participant, contextId);
  if (record) {
    return record.data.text();
  }
  return '';
}

export async function getUserProfileNameWithFallback(
  participant?: string,
  contextId?: string,
): Promise<string> {
  const { record } = await getUserProfileName(participant, contextId);
  if (record) {
    return record.data.text();
  }
  return 'Unknown';
}

export async function getUserProfileIconWithFallback(
  participant?: string,
  contextId?: string,
): Promise<string> {
  const { record } = await getUserProfileIcon(participant, contextId);
  if (record) {
    return convertBlobToUrl(await record.data.blob());
  }
  return SingleUser;
}

export async function getUserProfileIconAltWithFallback(
  participant?: string,
  contextId?: string,
): Promise<string> {
  const { record } = await getUserProfileIconAlt(participant, contextId);
  if (record) {
    return record.data.text();
  }
  return 'Single user avatar';
}

export type ProfileListContextItem = {
  label: string;
  name: string;
  icon: string;
  iconAlt: string;
  contextId: string;
  did: string;
  dateCreated: string;
};

export async function setProfileList() {
  const profiles = await checkForAndSetProfiles();
  const profileList = [];
  if (profiles.records.length) {
    for (const profile of profiles.records) {
      if (profile) {
        profileList.push({
          contextId: profile.contextId,
          ...(await getFullUserProfileWithFallbacks(
            undefined,
            profile.contextId,
          )),
          did: profile.author,
          dateCreated: profile.dateCreated,
        });
      }
    }
  }
  return Object.fromEntries(
    profileList.map(profile => [profile && profile.contextId, profile]),
  );
}
