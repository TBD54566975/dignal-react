import { RoutePaths } from '@/routes';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';

function QrCode({ id }: { id: string }) {
  const [img, setImg] = useState('');

  useEffect(() => {
    async function getQrCode() {
      const qrImage = await QRCode.toDataURL(
        `${location.origin}${RoutePaths.NEW_CHAT}?did=${id}`,
      );
      setImg(qrImage);
    }
    void getQrCode();
  }, [id]);
  return (
    <div className="qr-code-container">
      <img src={img} />
    </div>
  );
}

export default QrCode;
