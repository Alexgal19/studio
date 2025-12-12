
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
  const [info, setInfo] = useState<string | null>(null);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const formRef = useRef<HTMLFormElement>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state?.success) {
      router.push('/login?registered=true');
    }
    if(state && !state.success) {
      setError(state.message);
      setStep(1);
      setIsSubmitting(false);
    }
  }, [state, router]);

  useEffect(() => {
    if (recaptchaContainerRef.current && !window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
            'size': 'invisible',
        });
    }
  }, []);
  
  const handleGetCode = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      setError(null);
      setInfo(null);
      
      const formData = new FormData(formRef.current!);
      const phone = formData.get('phone') as string;
      const password = formData.get('password') as string;
      const confirmPassword = formData.get('confirmPassword') as string;
      
      if (password !== confirmPassword) {
          setError(t('passwordsDoNotMatch'));
          return;
      }
      
      if (!phone || !password) {
          setError(t('phoneAndPasswordRequired'));
          return;
      }
      
      setIsSubmitting(true);

      try {
        const verifier = window.recaptchaVerifier;
        if (!verifier) {
            throw new Error("Recaptcha verifier not initialized.");
        }
        const confirmation = await signInWithPhoneNumber(auth, phone, verifier);
        setConfirmationResult(confirmation);
        setStep(2);
        setInfo(t('codeSent'));
      } catch (err: any) {
        console.error(err);
        let friendlyMessage = t('failedToSendCode');
        if (err.code === 'auth/invalid-phone-number') {
            friendlyMessage = t('invalidPhoneNumber');
        } else if (err.code === 'auth/too-many-requests') {
            friendlyMessage = t('tooManyRequests');
        }
        setError(friendlyMessage);
      } finally {
        setIsSubmitting(false);
      }
  };
  
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
      setInfo(null);
      setIsSubmitting(true);
      
      const formData = new FormData(e.currentTarget);
      const code = formData.get('verificationCode') as string;

      if (!confirmationResult) {
          setError(t('verificationError'));
          setIsSubmitting(false);
          return;
      }
      
      try {
          const result = await confirmationResult.confirm(code);
          const user = result.user;

          const finalFormData = new FormData(formRef.current!);
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
        <div id="recaptcha-container" ref={recaptchaContainerRef}></div>
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
              <Button onClick={handleGetCode} disabled={isSubmitting} className="w-full">
                  {isSubmitting ? t('sendingCode') : t('getVerificationCode')}
              </Button>
            </form>
        )}

        {step === 2 && (
             <form onSubmit={handleRegister} className="space-y-4">
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
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? t('registering') : t('register')}
                </Button>
             </form>
        )}

        {info && !error && (
            <Alert variant="default" className="mt-4">
              <AlertDescription>{info}</AlertDescription>
            </Alert>
        )}
        {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

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

    