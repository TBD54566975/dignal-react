export type IChatMessage = {
  message: string;
  timestamp: string;
  isAuthor: boolean;
  delivered: boolean;
  seen: boolean;
  id: string;
};

export type IChat = IChatMessage & {
  name: string;
  picture: string;
};

export type IProfile = {
  name: string;
  picture: Blob;
};

export type IProfileRecord = {
  name: string;
  picture: string;
};
