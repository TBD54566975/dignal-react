import { ChangeEvent, useRef, useState } from 'react';
import Camera from '@assets/icons/camera.svg';
import { useNavigate } from 'react-router';
import { RoutePaths } from '@/routes';
import { configureProtocol, userDid, writeRecord } from '@util/web5';
import { ProfileProtocol } from '@util/protocols/profile.protocol';
import { ChatProtocol } from '@util/protocols/chat.protocol';
import { sampleProfile } from './sampleProfiles';
import { convertBlobToUrl } from '@/util/helpers';
import { useLocation } from 'react-router-dom';

function Create() {
  return (
    <div className="layout">
      <div className="row text-center row-px">
        <h1>Your profile</h1>
        <p>This is how others find you on Dignal.</p>
        <ProfilePicture />
        <ProfileName />
        <SaveButton />
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

let { name: profileName, picture: profilePicture } = sampleProfile;

function ProfilePicture() {
  const profilePictureInputRef = useRef<HTMLInputElement>(null);
  const [previewPhoto, setPreviewPhoto] = useState<Blob>(profilePicture);

  function triggerProfilePictureFilePicker() {
    profilePictureInputRef?.current?.click();
  }

  const [uploadError, setUploadError] = useState('');

  function setAndPreviewProfilePicture(e: ChangeEvent<HTMLInputElement>) {
    if (e.currentTarget.files && e.currentTarget.files[0].size > 1000) {
      setUploadError(
        'Image size is too large. Please select one that is > 1MB',
      );
      return;
    }
    const preview = getPreviewProfilePicture(e);
    if (preview) {
      profilePicture = preview;
      setPreviewPhoto(profilePicture);
    }
  }

  return (
    <div className="profile">
      <button
        id="buttonForWhatever"
        type="button"
        className="profile-picture"
        onClick={triggerProfilePictureFilePicker}
        aria-label="Choose profile picture"
      >
        <img
          id="profilePicturePreview"
          src={convertBlobToUrl(previewPhoto)}
          alt=""
        />
        <div className="profile-picture-icon">
          <img src={Camera} alt="" />
        </div>
      </button>
      {uploadError && <p>{uploadError}</p>}
      <input
        ref={profilePictureInputRef}
        className="sr-only"
        id="profilePictureInput"
        name="profilePicture"
        onChange={setAndPreviewProfilePicture}
        type="file"
        accept="image/png, image/jpeg"
        aria-hidden
        tabIndex={-1}
      />
    </div>
  );
}

function ProfileName() {
  const [previewName, setPreviewName] = useState<string>(profileName);

  function setProfileName(e: ChangeEvent<HTMLInputElement>) {
    profileName = e.currentTarget.value;
    setPreviewName(profileName);
  }

  return (
    <>
      <label id="displayNameInput" aria-hidden className="sr-only">
        Display name
      </label>
      <input
        autoComplete="off"
        name="displayName"
        type="text"
        placeholder="Display name"
        value={previewName}
        onChange={setProfileName}
        aria-labelledby="displayNameInput"
      />
    </>
  );
}

function SaveButton() {
  const navigate = useNavigate();
  const { search } = useLocation();

  async function saveProfileAndNavigate() {
    await setProtocols();
    await createProfile();
    navigate(search ? RoutePaths.NEW_CHAT + search : RoutePaths.CHAT);
  }

  return <button onClick={saveProfileAndNavigate}>Continue</button>;
}

async function setProtocols() {
  //TODO: check if network online
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
  const { record: photoRecord } = await writeRecord({
    data: profilePicture,
    message: {
      protocol: ProfileProtocol.protocol,
      protocolPath: 'photo',
      schema: ProfileProtocol.types.photo.schema,
      published: true,
    },
  });

  const { record: profileRecord } = await writeRecord({
    data: {
      name: profileName,
      picture: photoRecord?.id,
    },
    message: {
      protocol: ProfileProtocol.protocol,
      protocolPath: 'profile',
      schema: ProfileProtocol.types.profile.schema,
      published: true,
    },
  });
  await photoRecord?.send(userDid);
  await profileRecord?.send(userDid);
}

function getPreviewProfilePicture(e: ChangeEvent<HTMLInputElement>) {
  // Typecast FileList to BlobPart[]
  if (e.currentTarget?.files && e.currentTarget?.files.length > 0) {
    const selectedPhoto = e.currentTarget.files[0] as unknown as BlobPart;
    const blob = new Blob([selectedPhoto], { type: 'image/png' });
    return blob;
  }
}
