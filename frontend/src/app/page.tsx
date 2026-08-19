import { redirect } from 'next/navigation';
import { Routes } from '@/config/routes';

export default function RootPage() {
  redirect(Routes.login);
}
