interface LoginLayoutProps {
  children: React.ReactNode;
}

/**
 * Dedicated layout for Admin Login Page
 * Clean, minimal layout without dashboard navigation
 */
export default function LoginLayout({ children }: LoginLayoutProps) {
  return <>{children}</>;
}
