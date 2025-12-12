
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// W prawdziwej aplikacji to byłaby baza danych.
// Używamy obiektu do symulacji przechowywania użytkowników.
const users: { [key: string]: { email: string; uid: string, password?: string } } = {
    'initial-admin-user': { email: 'admin@example.com', uid: 'initial-admin-user', password: 'password' }
};

async function findUserByEmail(email: string) {
    for (const uid in users) {
        if (users[uid].email === email) {
            return { uid, ...users[uid] };
        }
    }
    return null;
}

export async function login(
  prevState: { message: string, success?: boolean } | null,
  formData: FormData
) {
  const session = await getSession();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const user = await findUserByEmail(email);

  if (!user || user.password !== password) {
    return { success: false, message: 'Nieprawidłowy adres e-mail lub hasło.' };
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
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (!email || !password || !confirmPassword) {
        return { success: false, message: 'Wszystkie pola są wymagane.' };
    }
    
    if (password !== confirmPassword) {
        return { success: false, message: 'Hasła nie są takie same.' };
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        return { success: false, message: 'Ten adres e-mail jest już zarejestrowany.' };
    }
    
    // Generowanie prostego, unikalnego ID dla nowego użytkownika
    const uid = `user_${Date.now()}`;

    // Zapisujemy użytkownika do naszej symulowanej "bazy danych"
    users[uid] = { email, uid, password };

    // Wylogowanie aktywnej sesji, jeśli istnieje
    const session = await getSession();
    session.destroy();

    return { success: true, message: 'Rejestracja pomyślna. Możesz się teraz zalogować.' };
}

declare module 'iron-session' {
  interface IronSessionData {
    uid?: string;
  }
}
