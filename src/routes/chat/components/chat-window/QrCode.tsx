import { RoutePaths } from '@/routes';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Copy from '@assets/icons/copy.svg';
import { copyToClipboard } from '@/util/helpers';

function QrCode({ id }: { id: string }) {
  const [img, setImg] = useState('');
  const dataToEmbed = `${location.origin}${RoutePaths.NEW_CHAT}?did=${id}`;

  useEffect(() => {
    async function getQrCode() {
      const qrImage = await QRCode.toDataURL(dataToEmbed);
      setImg(qrImage);
    }
    void getQrCode();
  }, [dataToEmbed]);

  return (
    <div className="qr-code-container">
      <img src={img} />
      <button
        className="icon-button m-auto nowrap"
        onClick={() => copyToClipboard(dataToEmbed)}
      >
        <img width="16" src={Copy} alt="" />
        Copy your Invite URL
      </button>
    </div>
  );
}

export default QrCode;
