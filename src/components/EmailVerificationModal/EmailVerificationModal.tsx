import { useState } from 'react';
import { sendVerificationCode, verifyEmail } from '../../services/api';
import Modal from '../Modal/Modal';
import Button from '../Button/Button';
import styles from './EmailVerificationModal.module.css';

type EmailVerificationModalProps = {
  email: string;
  onClose: () => void;
  onVerified: () => void;
};

const EmailVerificationModal = ({ email, onClose, onVerified }: EmailVerificationModalProps) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendCode = async () => {
    setLoading(true);
    setError('');
    try {
      await sendVerificationCode(email);
      setCodeSent(true);
      setCountdown(60);
      // Таймер обратного отсчёта
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!code || code.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyEmail(email, code);
      onVerified();
    } catch (err: any) {
      setError(err.message || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className={styles.container}>
        <h2>Подтверждение email</h2>
        <p>
          Мы отправили код подтверждения на <strong>{email}</strong>
        </p>

        {!codeSent ? (
          <button onClick={handleSendCode} disabled={loading} className={styles.sendBtn}>
            {loading ? 'Отправка...' : 'Отправить код'}
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Введите 6-значный код"
              value={code}
              onChange={e => setCode(e.target.value)}
              className={styles.codeInput}
              maxLength={6}
            />
            <div className={styles.actions}>
              <Button text="Подтвердить" onClick={handleVerify} disabled={loading} />
              <button
                onClick={handleSendCode}
                disabled={countdown > 0}
                className={styles.resendBtn}
              >
                {countdown > 0 ? `Отправить повторно через ${countdown}с` : 'Отправить повторно'}
              </button>
            </div>
          </>
        )}

        {error && <div className={styles.error}>{error}</div>}
      </div>
    </Modal>
  );
};

export default EmailVerificationModal;
