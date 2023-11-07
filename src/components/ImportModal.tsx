import {
  ChangeEvent,
  FormEvent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import QrCode from './QrCode';
import styles from './ImportModal.module.css';

export default function ImportModal({
  importModalRef,
}: {
  importModalRef: RefObject<HTMLDialogElement>;
}) {
  const initialState = {
    pin: '',
  };
  const [qrVisible, setQrVisible] = useState(true);
  const [formData, setFormData] = useState(initialState);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleOpenIdAgent() {
    setQrVisible(false);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, maxLength } = e.target;
    if (value.length > maxLength) {
      e.preventDefault();
      return;
    }
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const currentTarget = e.currentTarget;
    try {
      importModalRef.current?.close(currentTarget.value);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  function handleClose() {
    setQrVisible(true);
    setFormData(initialState);
  }

  return (
    <dialog
      onClose={handleClose}
      ref={importModalRef}
      onClick={e => {
        if (e.target === importModalRef.current) {
          importModalRef.current.close();
        }
      }}
    >
      {qrVisible ? (
        <>
          <h2>Scan the QR code or go to your ID Agent</h2>
          <QrCode dataToEmbed="#" />
          <div className="btn-row btn-row-expanded">
            <button className="btn" onClick={handleOpenIdAgent}>
              Open ID Agent
            </button>
            <button
              className="btn secondary"
              onClick={() => importModalRef.current?.close()}
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <h2>Enter the pin from your ID agent</h2>
          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <label htmlFor="pin" className="sr-only">
              PIN
            </label>
            <input
              ref={inputRef}
              type="number"
              id="pin"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              autoComplete="off"
              maxLength={4}
              required
            />
            <button className="btn expanded" onClick={handleOpenIdAgent}>
              Next
            </button>
          </form>
        </>
      )}
    </dialog>
  );
}
