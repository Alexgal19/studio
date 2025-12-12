'use client';

import { useTransition } from 'react';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const handleClick = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button variant="ghost" onClick={handleClick} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isPending ? t('loggingOut') : t('logout')}
    </Button>
  );
}
