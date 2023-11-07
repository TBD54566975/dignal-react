import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import Copy from '@assets/buttons/copy.svg';
import Share from '@assets/buttons/share.svg';
import { copyToClipboard } from '@/util/helpers';
import styles from './QrCode.module.css';

function QrCode({
  dataToEmbed,
  includeCopyButton,
}: {
  dataToEmbed: string;
  includeCopyButton?: boolean;
}) {
  const [img, setImg] = useState('');

  useEffect(() => {
    async function getQrCode() {
      const qrImage = await QRCode.toDataURL(dataToEmbed);
      setImg(qrImage);
    }
    void getQrCode();
  }, [dataToEmbed]);

  return (
    <div className={styles.qrCodeContainer}>
      <img className={styles.qrCode} src={img} />
      {navigator.share && navigator.canShare({ text: dataToEmbed }) && (
        <button
          onClick={() => {
            navigator.share({ text: dataToEmbed });
          }}
          className="btn"
        >
          <img width="16" src={Share} alt="" />
          Share
        </button>
      )}
      {includeCopyButton && (
        <button onClick={() => copyToClipboard(dataToEmbed)} className="btn">
          <img width="16" src={Copy} alt="" />
          Copy
        </button>
      )}
    </div>
  );
}

export default QrCode;
