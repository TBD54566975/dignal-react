import { ChatsProtocol } from '@/util/protocols/chats.protocol';
import { ProfilesProtocol } from '@/util/protocols/profiles.protocol';
import {
  connectWeb5,
  queryForAndSetProtocol,
  readRecord,
  userDid,
  writeRecord,
} from '@/util/web5';
import { sampleProfile } from './sampleProfiles';
import { IProfile } from './types';
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
    checkForAndSetProfile(),
  ]);
}

export async function checkForAndSetProfile() {
  const { record: profileRecord, status } = await getUserProfileContext();
  if (profileRecord) {
    return { profileRecord, status };
  } else {
    return await setWeb5UserStarterProfile();
  }
}

export async function setWeb5UserStarterProfile() {
  return await createFullUserProfile({
    label: 'My first profile',
    ...sampleProfile,
  });
}

export async function createFullUserProfile({
  label,
  name,
  icon,
  icon_alt,
}: IProfile) {
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
    (await addProfileIconAltText(icon_alt, {
      contextId: profileIconResponse.record.contextId,
      parentId: profileIconResponse.record.id,
    }));
  return {
    profile: profileResponse,
    label: profileLabelResponse,
    name: profileNameResponse,
    icon: profileIconResponse,
    icon_alt: profileIconAltTextResponse,
  };
}

export async function createUserProfileContext() {
  const { record, status } = await writeRecord({
    data: {},
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile',
      schema: 'profile',
      published: true,
    },
  });
  if (record) {
    await record.send(userDid);
  }
  return { record, status };
}

export async function addProfileLabel(
  label: string,
  { contextId, parentId }: RelatedRecord,
) {
  const { record, status } = await writeRecord({
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
  if (record) {
    await record.send(userDid);
  }
  return { record, status };
}

export async function addProfileName(
  name: string,
  { contextId, parentId }: RelatedRecord,
) {
  const { record, status } = await writeRecord({
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
  if (record) {
    await record.send(userDid);
  }
  return { record, status };
}

export async function addProfileIcon(
  icon: Blob,
  { contextId, parentId }: RelatedRecord,
) {
  const { record, status } = await writeRecord({
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
  if (record) {
    await record.send(userDid);
  }
  return { record, status };
}

export async function addProfileIconAltText(
  altText: string,
  { contextId, parentId }: RelatedRecord,
) {
  const { record, status } = await writeRecord({
    data: altText,
    message: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile/icon/icon_alt',
      schema: 'icon_alt',
      contextId,
      parentId,
      published: true,
    },
  });
  if (record) {
    await record.send(userDid);
  }
  return { record, status };
}

// We only want to return the text value of the label associated with the profile
export async function getFullUserProfile(from?: string) {
  return {
    label: await getUserProfileLabelWithFallback(from),
    name: await getUserProfileNameWithFallback(from),
    icon: await getUserProfileIconAltWithFallback(from),
    icon_alt: await getUserProfileIconAltWithFallback(from),
  };
}

export async function getUserProfileContext(from?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocol: ProfilesProtocol.protocol,
      protocolPath: 'profile',
    },
  });
}

export async function getUserProfileLabel(from?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocolPath: 'profile/label',
    },
  });
}

export async function getUserProfileName(from?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocolPath: 'profile/name',
    },
  });
}

export async function getUserProfileIcon(from?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocolPath: 'profile/icon',
    },
  });
}

export async function getUserProfileIconAlt(from?: string) {
  return await readRecord({
    ...(from && { from }),
    filter: {
      protocolPath: 'profile/icon/icon_alt',
    },
  });
}

export async function getProfileNameIconAndIconAltForDisplay({
  type,
  participant,
}: {
  type: 'private' | 'group';
  participant?: string;
}) {
  return type === 'group'
    ? ['New group chat', GroupUsers, 'Group of user avatars']
    : participant
    ? [
        await getUserProfileNameWithFallback(participant),
        await getUserProfileIconWithFallback(participant),
        await getUserProfileIconAltWithFallback(participant),
      ]
    : ['New 1:1 chat', SingleUser, 'Single user avatar'];
}

export async function getUserProfileLabelWithFallback(participant?: string) {
  const { record } = await getUserProfileLabel(participant);
  if (record) {
    return record.data.text();
  }
  return;
}

export async function getUserProfileNameWithFallback(participant?: string) {
  const { record } = await getUserProfileName(participant);
  if (record) {
    return record.data.text();
  }
  return 'Unknown';
}

export async function getUserProfileIconWithFallback(participant?: string) {
  const { record } = await getUserProfileIcon(participant);
  if (record) {
    return convertBlobToUrl(await record.data.blob());
  }
  return SingleUser;
}

export async function getUserProfileIconAltWithFallback(participant?: string) {
  const { record } = await getUserProfileIconAlt(participant);
  if (record) {
    return record.data.text();
  }
  return 'Single user avatar';
}
