'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { login } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';

function SubmitButton() {
  const { pending } = useFormStatus();
  const { t } = useTranslation();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? t('loggingIn') : t('login')}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useFormState(login, null);
  const { toast } = useToast();
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    if (state?.success) {
      toast({
        title: t('loginSuccessTitle'),
        description: t('loginSuccessDescription'),
      });
      router.push('/');
    }
  }, [state, toast, router, t]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/50">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('loginPageTitle')}</CardTitle>
          <CardDescription>{t('loginPageDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('username')}</Label>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="admin"
                required
                defaultValue="admin"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                required 
                defaultValue="password"
              />
            </div>

            {state && !state.success && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
