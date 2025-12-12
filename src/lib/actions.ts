
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/firebase-admin'; // We will create this admin SDK file

// In a real application, this would be a proper database.
const users: { [key: string]: { phone: string; uid: string } } = {
    'placeholder_uid_admin': { phone: '+48123456789', uid: 'placeholder_uid_admin' }
};

export async function login(
  prevState: { message: string } | null,
  formData: FormData
) {
  const session = await getSession();
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  // This is a simplified login for the prototype.
  // A real app would verify the password against a hash stored with the user record.
  // For now, we just check if the user exists in our "database"
  const userExists = Object.values(users).some(u => u.phone === phone);

  if (!userExists) {
    return { success: false, message: 'Nieprawidłowy numer telefonu lub hasło.' };
  }
  
  // In a real app you'd verify password here. For now we assume it's correct if user exists.

  session.isLoggedIn = true;
  // In a real app, you would store the user's UID in the session
  // const user = await auth.getUserByPhoneNumber(phone);
  // session.uid = user.uid;
  await session.save();
  return { success: true, message: 'Zalogowano pomyślnie' };
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect('/login');
}

export async function register(
    prevState: { message: string } | null,
    formData: FormData
) {
    const phone = formData.get('phone') as string;
    const uid = formData.get('uid') as string;
    const password = formData.get('password') as string;

    if (!uid || !phone || !password) {
        return { success: false, message: 'Brakujące dane do rejestracji.' };
    }

    try {
        // Create user in Firebase Auth
        await auth.updateUser(uid, {
          password: password,
          phoneNumber: phone,
        });

        // Save user to our "database"
        users[uid] = { phone, uid };

        return { success: true, message: 'Rejestracja pomyślna. Możesz się teraz zalogować.' };

    } catch (error: any) {
        console.error("Registration error:", error);
        return { success: false, message: error.message || 'Wystąpił błąd podczas rejestracji.' };
    }
}
