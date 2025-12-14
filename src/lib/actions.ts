
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import type { UserRecord } from 'firebase-admin/auth';

async function findUserById(uid: string): Promise<UserRecord | null> {
  const { auth: adminAuth } = await import('@/lib/firebase-admin');
  if (!adminAuth) return null;
  try {
    const userRecord = await adminAuth.getUser(uid);
    return userRecord;
  } catch (error: any) {
    if (error.code === 'auth/user-not-found') {
      return null;
    }
    throw error;
  }
}

export async function login(uid: string) {
  const session = await getSession();
  const user = await findUserById(uid);

  if (!user) {
    // This case should ideally not happen if uid comes from a successful client-side login.
    // However, it's a good safeguard.
    // We can't redirect here as it might be called in a transition.
    // The client-side should handle the UI for this failure.
    console.error(`Login failed: User with UID ${uid} not found in Firebase.`);
    return { success: false, message: 'Logowanie nie powiodło się: nie znaleziono użytkownika.' };
  }

  session.isLoggedIn = true;
  session.uid = user.uid;
  await session.save();
  
  redirect('/');
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
        const existingUser = await adminAuth.getUserByEmail(email).catch(error => {
            if (error.code === 'auth/user-not-found') return null;
            throw error;
        });
        
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

