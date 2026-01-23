// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, fetchSignInMethodsForEmail } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc, updateDoc, deleteDoc, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAorI27ceVKZ5IqOtpjM7I3GjQ_zfVwzZM",
  authDomain: "signin-49076.firebaseapp.com",
  databaseURL: "https://signin-49076-default-rtdb.firebaseio.com",
  projectId: "signin-49076",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Authentication functions
export const firebaseAuth = {
  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'Password reset email sent!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      console.log('Attempting to sign in with:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Sign in successful:', userCredential.user.email);
      
      return { 
        success: true, 
        user: userCredential.user,
        message: 'Login successful!'
      };
    } catch (error) {
      console.error('Sign in error:', error.code, error.message);
      
      // Handle specific error codes
      if (error.code === 'auth/user-not-found') {
        return { success: false, message: 'No account found with this email.' };
      } else if (error.code === 'auth/wrong-password') {
        return { success: false, message: 'Incorrect password.' };
      } else if (error.code === 'auth/invalid-credential') {
        return { success: false, message: 'Invalid email or password.' };
      } else if (error.code === 'auth/network-request-failed') {
        return { success: false, message: 'Network error. Please check your connection and try again.' };
      } else if (error.code === 'auth/too-many-requests') {
        return { success: false, message: 'Too many failed attempts. Please try again later.' };
      } else {
        return { success: false, message: 'Login failed. Please try again.' };
      }
    }
  },

  // Create new user with email and password
  createUser: async (email, password, name) => {
    try {
      console.log('Creating user account...');
      console.log('Email:', email);
      console.log('Name:', name);
      console.log('Password length:', password?.length);
      
      // Check if email already exists by trying to sign in first
      // This is a way to validate email uniqueness before creating account
      try {
        const signInMethods = await fetchSignInMethodsForEmail(auth, email);
        if (signInMethods.length > 0) {
          console.log('Email already exists:', signInMethods);
          return { 
            success: false, 
            message: 'Email already registered. Please use a different email or try logging in.' 
          };
        }
      } catch (checkError) {
        // If fetchSignInMethodsForEmail fails, proceed with user creation
        // This might happen if email format is invalid, which will be caught below
        console.log('Email uniqueness check failed, proceeding with creation:', checkError.message);
      }
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential.user.email);
      
      // Update user profile in Firestore
      try {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          name: name,
          createdAt: new Date(),
          lastLogin: new Date()
        });
        console.log('User profile saved to Firestore');
      } catch (firestoreError) {
        console.warn('Could not save user profile to Firestore:', firestoreError);
        // Don't fail the registration if Firestore fails
      }
      
      return { 
        success: true, 
        user: userCredential.user,
        message: 'Account created successfully!'
      };
    } catch (error) {
      console.error('User creation error:', error.code, error.message);
      
      // Handle specific error codes
      if (error.code === 'auth/email-already-in-use') {
        return { success: false, message: 'Email already in use.' };
      } else if (error.code === 'auth/weak-password') {
        return { success: false, message: 'Password should be at least 6 characters.' };
      } else if (error.code === 'auth/invalid-email') {
        return { success: false, message: 'Invalid email address.' };
      } else if (error.code === 'auth/network-request-failed') {
        return { success: false, message: 'Network error. Please check your connection and try again.' };
      } else {
        return { success: false, message: 'Account creation failed. Please try again.' };
      }
    }
  },

  // Send OTP to email (simulate - in production use email service)
  sendEmailOTP: async (email, name) => {
    try {
      console.log('sendEmailOTP called with:', email, name);
      
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log('Generated OTP:', otp);
      
      // Store OTP with 30-second expiry
      const otpData = {
        email: email,
        name: name,
        otp: otp,
        createdAt: new Date().getTime(),
        expiresAt: new Date().getTime() + (30 * 1000) // 30 seconds
      };
      
      // Store in sessionStorage for demo
      sessionStorage.setItem('otpData', JSON.stringify(otpData));
      
      // In production, send email via service like SendGrid, AWS SES, etc.
      // For demo, we'll just return the OTP
      console.log('OTP FOR DEMO - USE THIS CODE:');
      console.log('Email:', email);
      console.log('OTP Code:', otp);
      console.log('Expires in 30 seconds');
      console.log('END OTP DEMO - COPY THE CODE ABOVE');
      
      const result = { 
        success: true, 
        message: 'Verification code sent to your email!',
        otp: otp // For demo purposes
      };
      
      console.log('Returning result:', result);
      return result;
    } catch (error) {
      console.error('Email OTP error:', error);
      return { success: false, message: 'Error sending verification code' };
    }
  },

  // Verify email OTP and create user
  verifyEmailOTP: async (email, otp, password, name) => {
    try {
      console.log('verifyEmailOTP called with:', email, otp);
      console.log('verifyEmailOTP - password length:', password?.length);
      
      // Get OTP data from sessionStorage
      const otpDataStr = sessionStorage.getItem('otpData');
      if (!otpDataStr) {
        return { success: false, message: 'OTP expired. Please request a new one.' };
      }
      
      const otpData = JSON.parse(otpDataStr);
      const currentTime = new Date().getTime();
      
      // Check if OTP is expired
      if (currentTime > otpData.expiresAt) {
        console.log('OTP expired');
        sessionStorage.removeItem('otpData');
        return { success: false, message: 'OTP expired. Please request a new one.' };
      }
      
      // Validate OTP format
      if (otp.length !== 6) {
        console.log('Invalid OTP format');
        return { success: false, message: 'Please enter a 6-digit code' };
      }
      
      // Check if OTP matches
      if (otp !== otpData.otp) {
        console.log('OTP does not match');
        return { success: false, message: 'Invalid OTP. Please enter valid OTP.' };
      }
      
      console.log('OTP verified successfully');
      
      // Validate password
      if (!password || password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      console.log('Creating user account...');
      console.log('Calling firebaseAuth.createUser with:', email, password, name);
      
      // Create user account
      const userResult = await firebaseAuth.createUser(email, password, name);
      
      console.log('firebaseAuth.createUser returned:', userResult);
      
      if (userResult.success) {
        console.log('User created successfully');
        // Sign out the user immediately after creation to force them to login
        await signOut(auth);
        console.log('User signed out after registration');
        // Clear OTP data
        sessionStorage.removeItem('otpData');
        return { success: true, user: userResult.user };
      } else {
        // Check if error is "email already exists" - treat as success
        if (userResult.message.includes('email-already-in-use')) {
          console.log('Email already exists - treating as success');
          // Clear OTP data
          sessionStorage.removeItem('otpData');
          return { 
            success: true, 
            message: 'Account already exists! Please login with your credentials.',
            userExists: true 
          };
        }
        console.log('User creation failed:', userResult.message);
        return userResult;
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      console.error('Error details:', error.message, error.code);
      return { success: false, message: 'Error verifying code' };
    }
  },

  // Send password reset email
  sendPasswordResetEmail: async (email) => {
    try {
      console.log('Sending password reset email to:', email);
      
      // Send password reset email using Firebase
      await sendPasswordResetEmail(auth, email);
      
      console.log('Password reset email sent successfully to:', email);
      
      const result = { 
        success: true, 
        message: 'Password reset email sent successfully!'
      };
      
      console.log('Returning result:', result);
      return result;
    } catch (error) {
      console.error('Password reset email error:', error);
      let errorMessage = 'Error sending password reset email';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later';
      }
      
      return { success: false, message: errorMessage };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

// Firestore functions
export const firebaseDB = {
  // Add document
  addDocument: async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp()
      });
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get document
  getDocument: async (collectionName, docId) => {
    try {
      const docSnap = await getDoc(doc(db, collectionName, docId));
      if (docSnap.exists()) {
        return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { success: false, message: 'Document not found' };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Update document
  updateDocument: async (collectionName, docId, data) => {
    try {
      await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  // Get all documents from collection
  getCollection: async (collectionName) => {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      return { success: true, data: documents };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
};

export default app;
