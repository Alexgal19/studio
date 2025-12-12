
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { register } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

function RegisterForm() {
  const [state, formAction] = useFormState(register, null);
  const router = useRouter();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [step, setStep] = useState(1); // 1: enter details, 2: enter code
  const [error, setError] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const registerFormRef = useRef<HTMLFormElement>(null);


  useEffect(() => {
    if (state?.success) {
      router.push('/login?registered=true');
    }
    if(state && !state.success) {
      setError(state.message);
      // Jeśli błąd serwera (np. duplikat), cofnij do kroku 1
      setStep(1);
      setIsSubmitting(false);
    }
  }, [state, router]);
  
  const handleGetCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setError(null);
      
      const formData = new FormData(formRef.current!);
      const phone = formData.get('phone') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      if (password !== confirmPassword) {
          setError('Hasła nie są zgodne.');
          return;
      }
      
      if (!phone || !password) {
          setError('Numer telefonu i hasło są wymagane.');
          return;
      }
      
      setIsSubmitting(true);

      try {
        if (typeof window !== 'undefined') {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                'size': 'invisible',
            });
        
            const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            setConfirmationResult(confirmation);
            setStep(2);
            setError(t('codeSent'));
        }
      } catch (err: any) {
        console.error(err);
        let friendlyMessage = 'Nie udało się wysłać kodu. Spróbuj ponownie.';
        if (err.code === 'auth/invalid-phone-number') {
            friendlyMessage = 'Nieprawidłowy format numeru telefonu.';
        } else if (err.code === 'auth/too-many-requests') {
            friendlyMessage = 'Zbyt wiele prób. Spróbuj ponownie później.';
        }
        setError(friendlyMessage);
      } finally {
        setIsSubmitting(false);
      }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const code = formData.get('verificationCode') as string;

      if (!confirmationResult) {
          setError("Błąd weryfikacji, spróbuj ponownie od początku.");
          setIsSubmitting(false);
          return;
      }
      
      try {
          const result = await confirmationResult.confirm(code);
          const user = result.user;

          // Po pomyślnej weryfikacji kodu, tworzymy nowe FormData
          // zawierające wszystkie potrzebne dane i wysyłamy je do naszej akcji serwerowej
          const finalFormData = new FormData();
          const initialFormData = new FormData(formRef.current!);
          finalFormData.append('phone', initialFormData.get('phone') as string);
          finalFormData.append('password', initialFormData.get('password') as string);
          finalFormData.append('uid', user.uid);
          
          formAction(finalFormData);

      } catch (err: any) {
          console.error(err);
          setError(t('invalidCode'));
          setIsSubmitting(false);
      }
  }


  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('registrationPageTitle')}</CardTitle>
        <CardDescription>{t('registrationPageDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 && (
            <form ref={formRef} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('phoneNumber')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+48 123 456 789"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 right-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? t('hidePassword') : t('showPassword')}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </form>
        )}

        {step === 2 && (
             <form ref={registerFormRef} onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">{t('verificationCode')}</Label>
                  <Input
                    id="verificationCode"
                    name="verificationCode"
                    type="text"
                    placeholder="123456"
                    required
                    autoFocus
                  />
                   <p className="text-xs text-muted-foreground">{t('verificationCodeHintFirebase')}</p>
                </div>
             </form>
        )}

        {error && (
            <Alert variant={state?.success === false || (step === 1 && error !== null) ? "destructive" : "default"} className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        <div className="mt-4">
          {step === 1 ? (
              <Button onClick={handleGetCode} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? t('sendingCode') : t('getVerificationCode')}
              </Button>
            ) : (
              <Button type="submit" form={registerFormRef.current?.id} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? t('registering') : t('register')}
              </Button>
            )}
        </div>
         <div id="recaptcha-container" className="my-4"></div>
      </CardContent>
       <CardFooter className="flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link href="/login" className="font-medium text-primary hover:underline">
                  {t('loginHere')}
              </Link>
          </div>
       </CardFooter>
    </Card>
  );
}

export default function RegisterPage() {
  const [isClient, setIsClient] = useState(false);
  const { ready } = useTranslation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!ready || !isClient) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/50">
        <Card className="w-full max-w-sm">
          <CardHeader className="text-center space-y-4">
            <Skeleton className="h-8 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full mx-auto" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
             <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
          </CardContent>
          <CardFooter className="flex-col items-center gap-4">
            <Skeleton className="h-4 w-3/4" />
          </CardFooter>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50">
      <RegisterForm />
    </main>
  );
}

declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
    }
}
