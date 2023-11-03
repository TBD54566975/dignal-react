// import { ChatsProtocol } from '@/util/protocols/chats.protocol';
// import { ProfilesProtocol } from '@/util/protocols/profiles.protocol';
// import {
//   QueryDateSort,
//   queryRecords,
//   readRecord,
//   userDid,
//   writeRecord,
// } from '@/util/web5';

// // Profiles
// export async function queryFromDwnParticipantProfile(participant: string) {
//   const { records } = await queryRecords({
//     from: participant,
//     message: {
//       filter: {
//         protocol: ProfilesProtocol.protocol,
//         protocolPath: 'profile',
//         schema: ProfilesProtocol.types.profile.schema,
//         dataFormat: ProfilesProtocol.types.profile.dataFormats[0],
//       },
//     },
//   });
//   return records;
// }

// export async function readFromDwnParticipantPicture(
//   participant: string,
//   recordId: string,
// ) {
//   const { record } = await readRecord({
//     from: participant,
//     message: {
//       recordId,
//     },
//   });
//   return record;
// }

// export async function queryFromDwnProfile() {
//   const { records } = await queryRecords({
//     message: {
//       filter: {
//         protocol: ProfilesProtocol.protocol,
//         protocolPath: 'profile',
//         schema: ProfilesProtocol.types.profile.schema,
//         dataFormat: ProfilesProtocol.types.profile.dataFormats[0],
//       },
//     },
//   });
//   return records;
// }

// export async function readFromDwnPicture(recordId: string) {
//   const { record } = await readRecord({
//     message: {
//       recordId,
//     },
//   });
//   return record;
// }

// // Messages
// export async function queryFromDwnParticipantMessages(recipient: string) {
//   const { records } = await queryRecords({
//     from: recipient,
//     message: {
//       filter: {
//         protocol: ChatsProtocol.protocol,
//         protocolPath: 'message',
//         schema: ChatsProtocol.types.message.schema,
//         dataFormat: ChatsProtocol.types.message.dataFormats[0],
//       },
//     },
//   });
//   return records;
// }

// export async function queryFromDwnMessages() {
//   const { records } = await queryRecords({
//     message: {
//       filter: {
//         protocol: ChatsProtocol.protocol,
//         protocolPath: 'message',
//         schema: ChatsProtocol.types.message.schema,
//         dataFormat: ChatsProtocol.types.message.dataFormats[0],
//       },
//       dateSort: 'createdDescending' as QueryDateSort,
//     },
//   });
//   return records;
// }

// export async function queryFromDwnMessagesWithParticipant(recipient: string) {
//   const { records } = await queryRecords({
//     message: {
//       filter: {
//         protocol: ChatsProtocol.protocol,
//         protocolPath: 'message',
//         schema: ChatsProtocol.types.message.schema,
//         dataFormat: ChatsProtocol.types.message.dataFormats[0],
//         recipient,
//       },
//     },
//   });
//   return records;
// }

// export async function writeToDwnMessage(recipient: string) {
//   const { record } = await writeRecord({
//     data: {
//       recipients: [recipient, userDid],
//     },
//     message: {
//       protocol: ChatsProtocol.protocol,
//       protocolPath: 'message',
//       schema: ChatsProtocol.types.message.schema,
//       dataFormat: ChatsProtocol.types.message.dataFormats[0],
//       recipient: userDid, // make self the recipient just so we can check for dupes
//       // since we dont want to publish all our chats so anyone can query
//     },
//   });
//   return record;
// }

// //Replies
// export async function queryFromDwnMessageReplies(contextId: string) {
//   const { records } = await queryRecords({
//     message: {
//       filter: {
//         protocol: ChatsProtocol.protocol,
//         protocolPath: 'message/reply',
//         schema: ChatsProtocol.types.reply.schema,
//         dataFormat: ChatsProtocol.types.reply.dataFormats[0],
//         contextId,
//       },
//     },
//   });
//   return records;
// }

// export async function writeToDwnMessageReply(text: string, chatId: string) {
//   const { record } = await writeRecord({
//     data: {
//       text,
//       author: userDid,
//     },
//     message: {
//       protocol: ChatsProtocol.protocol,
//       protocolPath: 'message/reply',
//       schema: ChatsProtocol.types.reply.schema,
//       dataFormat: ChatsProtocol.types.reply.dataFormats[0],
//       contextId: chatId,
//       parentId: chatId,
//     },
//   });
//   return record;
// }
