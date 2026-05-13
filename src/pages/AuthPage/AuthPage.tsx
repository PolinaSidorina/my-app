import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmailVerificationModal from '../../components/EmailVerificationModal/EmailVerificationModal';
import { login, register } from '../../services/api';
import styles from './AuthPage.module.css';

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [showVerification, setShowVerification] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [pendingResponse, setPendingResponse] = useState<any>(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let response;

      if (isLogin) {
        response = await login(email, password);
        localStorage.setItem('userId', response.userId.toString());
        localStorage.setItem('username', response.username);
        navigate('/home', { replace: true });
      } else {
        response = await register(username, email, password);
        setRegisteredEmail(email);
        setPendingResponse(response);
        setShowVerification(true);
        return;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerificationSuccess = () => {
    if (pendingResponse) {
      localStorage.setItem('userId', pendingResponse.userId.toString());
      localStorage.setItem('username', pendingResponse.username);
      navigate('/home', { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Финиквест</h1>
        <h2 className={styles.subtitle}>{isLogin ? 'Вход' : 'Регистрация'}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
            required
          />

          {!isLogin && (
            <input
              type="text"
              placeholder="Ваше имя"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className={styles.input}
              required
            />
          )}

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
            required
          />

          {error && <div className={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>

        <button type="button" onClick={() => setIsLogin(!isLogin)} className={styles.switchButton}>
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
      {showVerification && (
        <EmailVerificationModal
          email={registeredEmail}
          onClose={() => {
            setShowVerification(false);
            setPendingResponse(null);
          }}
          onVerified={handleVerificationSuccess}
        />
      )}
    </div>
  );
};

export default AuthPage;
