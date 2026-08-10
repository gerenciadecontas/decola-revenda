import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRole } from '../context/RoleContext';

export function useRoleRedirect(adminPath: string, gestorPath: string) {
  const router = useRouter();
  const { role } = useRole();

  useEffect(() => {
    const targetPath = role === 'admin' ? adminPath : gestorPath;
    router.push(targetPath);
  }, [role, router, adminPath, gestorPath]);
}
