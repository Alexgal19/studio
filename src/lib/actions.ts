'use server';

import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function login(
  prevState: { message: string } | null,
  formData: FormData
) {
  const session = await getSession();
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  // For demo purposes, using hardcoded credentials
  if (username !== 'admin' || password !== 'password') {
    return { success: false, message: 'Nieprawidłowa nazwa użytkownika lub hasło.' };
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
