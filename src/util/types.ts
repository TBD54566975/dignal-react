import { Record } from '@web5/api';

export type IChatMessage = {
  message: string;
  timestamp: string;
  isAuthor: boolean;
  delivered?: boolean;
  seen?: boolean;
  id: string;
};

export type IChat = Partial<IChatMessage> & {
  name: string;
  picture: string;
};

export type IChatRecord = {
  name: string;
  picture: string;
  record: Record;
  message?: string;
  timestamp?: string;
  isAuthor?: boolean;
};

export type IPublicProfile = {
  name: string;
  icon: string;
  icon_alt: string;
};

export type IProfile = IPublicProfile & {
  label: string;
};
