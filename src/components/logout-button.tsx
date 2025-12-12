'use client';

import { useTransition, useState, useEffect } from 'react';
import { logout } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();
  const { t, ready } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleClick = () => {
    startTransition(async () => {
      await logout();
    });
  };

  return (
    <Button variant="ghost" onClick={handleClick} disabled={isPending}>
      <LogOut className="mr-2 h-4 w-4" />
      {isClient && ready ? (isPending ? t('loggingOut') : t('logout')) : ''}
    </Button>
  );
}
