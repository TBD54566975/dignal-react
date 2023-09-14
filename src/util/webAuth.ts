export async function load() {
  const userA = {
    id: new Uint8Array(16),
    name: 'ks',
    displayName: 'KS',
  };
  const userB = {
    id: new Uint8Array(64),
    name: 'sk',
    displayName: 'SK',
  };
  async function getCred() {
    const publicKey: PublicKeyCredentialRequestOptions = {
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
      rpId: 'localhost',
      allowCredentials: [],
      userVerification: 'required',
    };

    return typeof navigator !== 'undefined'
      ? await navigator.credentials.get({ publicKey })
      : null;
  }

  async function createCred() {
    const publicKey: PublicKeyCredentialCreationOptions = {
      challenge: new Uint8Array([117, 61, 252, 231, 191, 241]),
      rp: { id: 'localhost', name: 'dignal.com' },
      user: userA,
      pubKeyCredParams: [
        { type: 'public-key', alg: -8 },
        { type: 'public-key', alg: -7 },
        { type: 'public-key', alg: -257 },
      ],
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
        requireResidentKey: true,
      },
    };

    return typeof navigator !== 'undefined'
      ? await navigator.credentials.create({ publicKey })
      : null;
  }

  try {
    const credential = await getCred();
    return {
      credential,
    };
  } catch (getCredentialError) {
    console.error(getCredentialError);
    try {
      const created = await createCred();
      return {
        created,
      };
    } catch (createCredentialError) {
      console.error(createCredentialError);
      throw Error('Unauthorized');
    }
  }
}
