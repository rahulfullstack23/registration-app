import { useState, useRef, useContext } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../../firebase';
import classes from './AuthForm.module.css';

import { AuthContext } from '../../store/auth-context.js';

const AuthForm = () => {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  const authCtx = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const switchAuthModeHandler = () => {
    setErrorMessage('');
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = async (event) => {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    setErrorMessage('');
    setIsLoading(true);

    try {
      const userCredential = isLogin
        ? await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
        : await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword);

      const idToken = await userCredential.user.getIdToken();
      authCtx.login(idToken);

      console.log('✅ Authentication successful:', {
        email: userCredential.user.email,
        localId: userCredential.user.uid,
        displayName: userCredential.user.displayName,
      });
    } catch (error) {
      const messages = {
        'auth/invalid-credential':
          'Invalid email or password. Check your details or create an account.',
        'auth/user-not-found':
          'No account was found for this email. Create an account first.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use':
          'An account already exists for this email. Log in instead.',
        'auth/weak-password': 'Choose a stronger password (at least 6 characters).',
        'auth/invalid-email': 'Enter a valid email address.',
        'auth/operation-not-allowed':
          'Email/password sign-in is disabled. Enable it in Firebase Authentication settings.',
        'auth/too-many-requests':
          'Too many attempts. Wait a little while and try again.',
        'auth/network-request-failed':
          'Unable to reach Firebase. Check your internet connection and try again.',
      };

      setErrorMessage(messages[error.code] || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input
            type='email'
            id='email'
            autoComplete='email'
            required
            ref={emailInputRef}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            required
            ref={passwordInputRef}
          />
        </div>
        {errorMessage && (
          <p className={classes.errorMessage} role='alert'>
            {errorMessage}
          </p>
        )}
        <div className={classes.actions}>
          {!isLoading && (
            <button type='submit'>
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          )}
          {isLoading && <p>Sending request...</p>}
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
            disabled={isLoading}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
