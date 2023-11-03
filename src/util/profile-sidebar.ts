// import SingleUser from '@assets/sample-pictures/single-user.svg';
// import GroupUser from '@assets/sample-pictures/group-user.svg';
// import {
//   queryFromDwnParticipantProfile,
//   queryFromDwnProfile,
//   readFromDwnParticipantPicture,
//   readFromDwnPicture,
//   writeToDwnMessageReply,
// } from './dwn';
// import { Record } from '@web5/api';
// import { readRecord, userDid } from './web5';

// export async function getDwnProfile() {
//   const profileRecords = await queryFromDwnProfile();
//   if (profileRecords && profileRecords.length > 0) {
//     const profileData = await profileRecords[0].data.json();
//     const photoRecord = await readFromDwnPicture(profileData.picture);
//     const photoData = await photoRecord.data.blob();
//     return { name: profileData.name, picture: URL.createObjectURL(photoData) };
//   }
// }

// export async function getParticipantProfile(participant: string) {
//   const profileRecords = await queryFromDwnParticipantProfile(participant);
//   if (profileRecords && profileRecords.length > 0) {
//     const profileData = await profileRecords[0].data.json();
//     const photoRecord = await readFromDwnParticipantPicture(
//       participant,
//       profileData.picture,
//     );
//     const photoData = await photoRecord.data.blob();
//     return { name: profileData.name, picture: URL.createObjectURL(photoData) };
//   }
// }

// export async function getChatProfile(participants: string[]) {
//   if (participants.length > 1) {
//     return {
//       name: 'Group',
//       picture: GroupUser,
//     };
//   } else {
//     const profile = await getParticipantProfile(participants[0]);
//     return {
//       name: profile?.name || participants[0].slice(0, 24) || 'Unknown', //arbitrary slice
//       picture: profile?.picture || SingleUser,
//     };
//   }
// }

// export async function writeMessageToDwn(
//   text: string,
//   chatId: string,
//   recipients: string[],
// ) {
//   //TODO: remove author from data once issue resolved
//   const record = await writeToDwnMessageReply(text, chatId);
//   if (record) {
//     if (recipients && recipients.length > 0) {
//       for (const targetRecipient of recipients) {
//         await record.send(targetRecipient);
//       }
//     }
//   }
//   return record;
// }

// export async function deleteMessagesFromDwn(records: Record[]) {
//   for (const record of records) {
//     await record.delete();
//   }
// }

// export async function readMessageFromDwn(recordId: string) {
//   const { record } = await readRecord({ filter: { recordId } });
//   return record;
// }

// export function getAllOtherChatParticipants(recipients: string[]) {
//   return recipients.filter((recipientDid: string) => recipientDid !== userDid);
// }

// export function showSidebar() {
//   document.querySelector('.sidebar')?.classList.add('sidebar-expanded');
//   document.querySelector('.sidebar')?.classList.remove('sidebar-retracted');
// }

// export function hideSidebar() {
//   document.querySelector('.sidebar')?.classList.remove('sidebar-expanded');
//   document.querySelector('.sidebar')?.classList.add('sidebar-retracted');
// }
