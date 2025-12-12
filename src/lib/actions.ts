
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

async function findUserByEmail(email: string) {
  const { auth: adminAuth } = await import('@/lib/firebase-admin');
  if (!adminAuth) return null;
  try {
    const userRecord = await adminAuth.getUserByEmail(email);
    return userRecord;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
}

export async function login(
  prevState: { message: string } | null,
  formData: FormData
) {
  const session = await getSession();
  const email = formData.get('email') as string;
  
  const { auth: adminAuth } = await import('@/lib/firebase-admin');
  if (!adminAuth) {
    return { message: 'Błąd konfiguracji serwera: usługa uwierzytelniania jest niedostępna. Skontaktuj się z administratorem.'}
  }

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return { message: 'Nieprawidłowy adres e-mail lub hasło.' };
    }
    
    // NOTE: This is a simplified login for demonstration. 
    // In a real app, you'd verify the password, likely on the client-side
    // with Firebase client SDK before calling a server action to create a session.
    session.isLoggedIn = true;
    session.uid = user.uid;
    await session.save();
    
    redirect('/');

  } catch (error) {
    console.error("Login error:", error);
    return { message: 'Wystąpił błąd podczas logowania.' };
  }
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}

export async function register(
    prevState: { message: string, success?: boolean } | null,
    formData: FormData
) {
    const { auth: adminAuth } = await import('@/lib/firebase-admin');
    if (!adminAuth) {
      return { success: false, message: 'Błąd konfiguracji serwera: usługa uwierzytelniania jest niedostępna. Skontaktuj się z administratorem.'}
    }

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!email || !password || !confirmPassword) {
        return { success: false, message: 'Wszystkie pola są wymagane.' };
    }
    
    if (password !== confirmPassword) {
        return { success: false, message: 'Hasła nie są takie same.' };
    }

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return { success: false, message: 'Użytkownik o tym adresie e-mail już istnieje.' };
        }

        await adminAuth.createUser({
            email,
            password,
            emailVerified: false,
        });
        
        return { success: true, message: 'Rejestracja pomyślna. Możesz się teraz zalogować.' };
    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.code === 'auth/email-already-exists') {
             return { success: false, message: 'Użytkownik o tym adresie e-mail już istnieje.' };
        }
        if (error.code === 'auth/invalid-password') {
            return { success: false, message: 'Hasło musi mieć co najmniej 6 znaków.' };
        }
        return { success: false, message: 'Wystąpił nieoczekiwany błąd podczas rejestracji.' };
    }
}

declare module 'iron-session' {
  interface IronSessionData {
    uid?: string;
  }
}
