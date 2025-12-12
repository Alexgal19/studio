
'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// In a real application, this would be a database.
const users = [
    { phone: '+48123456789', password: 'password' }
];


export async function login(
  prevState: { message: string } | null,
  formData: FormData
) {
  const session = await getSession();
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;

  const user = users.find(u => u.phone === phone && u.password === password);

  if (!user) {
    return { success: false, message: 'Nieprawidłowy numer telefonu lub hasło.' };
  }

  session.isLoggedIn = true;
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
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const verificationCode = formData.get('verificationCode') as string;

    if (password !== confirmPassword) {
        return { success: false, message: 'Hasła nie są zgodne.' };
    }

    // In a real app, this would involve sending an SMS and verifying the code.
    // For this prototype, we'll use a hardcoded value.
    if (verificationCode !== '123456') {
        return { success: false, message: 'Nieprawidłowy kod weryfikacyjny.' };
    }
    
    if (users.find(u => u.phone === phone)) {
        return { success: false, message: 'Użytkownik o tym numerze telefonu już istnieje.' };
    }

    // In a real app, you would save the new user to the database here.
    // For this prototype, we just add it to our in-memory array.
    users.push({ phone, password });

    return { success: true, message: 'Rejestracja pomyślna. Możesz się teraz zalogować.' };
}
