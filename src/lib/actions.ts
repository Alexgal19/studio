
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { getAuth } from 'firebase-admin/auth';


// W prawdziwej aplikacji to byłaby baza danych.
// Używamy obiektu do symulacji przechowywania użytkowników.
const users: { [key: string]: { phone: string; uid: string, password?: string } } = {
    // Ta struktura będzie wypełniana dynamicznie
};

async function findUserByPhone(phone: string) {
    for (const uid in users) {
        if (users[uid].phone === phone) {
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
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  const user = await findUserByPhone(phone);

  if (!user || user.password !== password) {
    return { success: false, message: 'Nieprawidłowy numer telefonu lub hasło.' };
  }

  session.isLoggedIn = true;
  session.uid = user.uid;
  await session.save();
  
  // Zamiast zwracać dane, przekierowujemy od razu po stronie serwera
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
    const phone = formData.get('phone') as string;
    const uid = formData.get('uid') as string;
    const password = formData.get('password') as string;

    if (!uid || !phone || !password) {
        return { success: false, message: 'Brakujące dane do rejestracji.' };
    }

    try {
        // Używamy admin SDK do ustawienia hasła
        // ponieważ po weryfikacji SMS użytkownik jest już utworzony, ale bez hasła
        await adminAuth.updateUser(uid, {
          password: password,
          phoneNumber: phone, // Upewniamy się, że numer telefonu jest poprawnie przypisany
          // Możemy tu również ustawić displayName, email etc.
        });

        // Zapisujemy użytkownika do naszej symulowanej "bazy danych"
        users[uid] = { phone, uid, password };

        return { success: true, message: 'Rejestracja pomyślna. Możesz się teraz zalogować.' };

    } catch (error: any) {
        console.error("Registration error:", error);
        // Mapowanie kodów błędów Firebase na bardziej przyjazne komunikaty
        let friendlyMessage = 'Wystąpił błąd podczas rejestracji.';
        if(error.code === 'auth/phone-number-already-exists') {
            friendlyMessage = 'Ten numer telefonu jest już zarejestrowany.';
        }
        return { success: false, message: friendlyMessage };
    }
}

declare module 'iron-session' {
  interface IronSessionData {
    uid?: string;
  }
}
