
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
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
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? t('loggingIn') : t('login')}
    </Button>
  );
}

function LoginForm() {
  const [state, formAction] = useFormState(login, null);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Przekierowanie jest teraz obsługiwane w akcji serwera
    if (state?.success) {
       toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/');
    }
  }, [state, toast, router, t]);
  
  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast({
        title: t('registrationSuccessTitle'),
        description: t('registrationSuccessDescription'),
      });
    }
  }, [searchParams, toast, t]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{t('loginPageTitle')}</CardTitle>
        <CardDescription>{t('loginPageDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('emailAddress')}</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="jan.kowalski@example.com"
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
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {state && !state.success && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <SubmitButton />
        </form>
      </CardContent>
       <CardFooter className="flex-col items-center gap-4">
          <div className="text-sm text-muted-foreground">
              {t('noAccountPrompt')}{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                  {t('registerHere')}
              </Link>
          </div>
       </CardFooter>
    </Card>
  );
}


export default function LoginPage() {
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
      <LoginForm />
    </main>
  );
}
