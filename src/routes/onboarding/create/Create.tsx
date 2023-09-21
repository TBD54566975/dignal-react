import { ChangeEvent, useEffect, useRef, useState } from 'react';
import Bat from '@assets/sample-pictures/bat.png';
import Cow from '@assets/sample-pictures/cow.png';
import Dolphin from '@assets/sample-pictures/dolphin.png';
import Elephant from '@assets/sample-pictures/elephant.png';
import Fox from '@assets/sample-pictures/fox.png';
import Camera from '@assets/icons/camera.svg';
import { useNavigate } from 'react-router';
import { RoutePaths } from '@/routes';
import { configureProtocol, userDid, writeRecord } from '@util/web5';
import { ProfileProtocol } from '@util/protocols/profile.protocol';
import { ChatProtocol } from '@util/protocols/chat.protocol';

function Create() {
  const [profilePicture, setProfilePicture] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState<Blob>();
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const displayNameInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const sampleProfile = sampleDisplayProfiles[randomIndex];

  useEffect(() => {
    async function setInitialSampleProfile() {
      if (displayNameInputRef.current) {
        displayNameInputRef.current.value = sampleProfile.name;
      }
      const samplePhoto = await sampleProfile.picture();
      setUploadedPhoto(samplePhoto);
      presentProfilePicture(samplePhoto);
    }
    void setInitialSampleProfile();
  }, [sampleProfile]);

  async function presentProfilePicture(uploadedPhoto: Blob) {
    const uploadedPhotoUrl = URL.createObjectURL(uploadedPhoto);
    setProfilePicture(uploadedPhotoUrl);
  }

  function addProfilePicture() {
    profilePictureInputRef?.current?.click();
  }

  function previewProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const blob = new Blob(e.currentTarget?.files, { type: 'image/png' });
    setUploadedPhoto(blob);
    presentProfilePicture(blob);
  }

  async function setProtocols() {
    const { protocol: profileProtocolResponse } = await configureProtocol({
      message: {
        definition: ProfileProtocol,
      },
    });

    const { protocol: chatProtocolResponse } = await configureProtocol({
      message: {
        definition: ChatProtocol,
      },
    });

    await profileProtocolResponse?.send(userDid);
    await chatProtocolResponse?.send(userDid);
  }

  async function createProfile() {
    const { record: photoRecord, status: photoStatus } = await writeRecord({
      data: uploadedPhoto,
      message: {
        protocol: ProfileProtocol.protocol,
        protocolPath: 'photo',
        schema: ProfileProtocol.types.photo.schema,
      },
    });

    const { record: profileRecord, status: profileStatus } = await writeRecord({
      data: {
        name: displayNameInputRef?.current?.value,
        picture: photoRecord?.id,
      },
      message: {
        protocol: ProfileProtocol.protocol,
        protocolPath: 'profile',
        schema: ProfileProtocol.types.profile.schema,
      },
    });
    await photoRecord?.send(userDid);
    await profileRecord?.send(userDid);
    console.log(photoStatus, photoRecord);
    console.log(profileStatus, profileRecord);
  }

  async function saveProfileAndNavigate() {
    await setProtocols();
    await createProfile();
    navigate(RoutePaths.CHAT);
  }

  return (
    <div className="layout">
      <div className="row text-center row-px">
        <h1>Your profile</h1>
        <p>This is how others find you on Dignal.</p>
        <div className="profile">
          <button
            type="button"
            className="profile-picture"
            onClick={addProfilePicture}
          >
            <img
              id="profilePicturePreview"
              src={profilePicture}
              alt={`Profile picture for ${displayNameInputRef?.current?.value}`}
            />
            <div className="profile-picture-icon">
              <img src={Camera} alt="" />
            </div>
          </button>
        </div>
        <div>
          <label htmlFor="profilePictureInput" className="sr-only">
            Profile picture
          </label>
          <input
            ref={profilePictureInputRef}
            className="sr-only"
            id="profilePictureInput"
            name="profilePicture"
            onChange={previewProfilePicture}
            type="file"
            accept="image/*"
          />
          <label htmlFor="displayNameInput" className="sr-only">
            Display name
          </label>
          <input
            id="displayNameInput"
            name="displayName"
            type="text"
            placeholder="Display name"
            ref={displayNameInputRef}
          />
        </div>
        <button onClick={saveProfileAndNavigate}>Continue</button>
        <p>
          Your profile has a unique identifier called a DID that you'll share
          with others so they can find you on Dignal.
        </p>
        <p>You can use this profile in other Web5 apps.</p>
      </div>
    </div>
  );
}

export default Create;

const sampleDisplayProfiles = [
  {
    name: 'Bella Bat',
    picture: async () =>
      new Blob([await (await fetch(Bat)).blob()], { type: 'image/png' }),
  },
  {
    name: 'Cory Cow',
    picture: async () =>
      new Blob([await (await fetch(Cow)).blob()], { type: 'image/png' }),
  },
  {
    name: 'Daisy Dolphin',
    picture: async () =>
      new Blob([await (await fetch(Dolphin)).blob()], { type: 'image/png' }),
  },
  {
    name: 'Eli Elephant',
    picture: async () =>
      new Blob([await (await fetch(Elephant)).blob()], { type: 'image/png' }),
  },
  {
    name: 'Fiona Fox',
    picture: async () =>
      new Blob([await (await fetch(Fox)).blob()], { type: 'image/png' }),
  },
];

const randomIndex = Math.floor(Math.random() * sampleDisplayProfiles.length);
