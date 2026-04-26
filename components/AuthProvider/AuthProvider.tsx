"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkSession, getMe, logout } from "@/lib/api/clientApi";
import { useAuthStore } from "@/lib/store/authStore";
import css from "./AuthProvider.module.css";

const privateRoutePrefix = ["/profile", "/notes"];
const authRoutePrefix = ["/sign-in", "/sign-up"];

const isPrivateRoute = (pathname: string) =>
  privateRoutePrefix.some((prefix) => pathname.startsWith(prefix));

const isAuthRoute = (pathname: string) =>
  authRoutePrefix.some((prefix) => pathname.startsWith(prefix));

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [sessionVerified, setSessionVerified] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const verifySession = async () => {
      setIsChecking(true);
      try {
        const hasSession = await checkSession();

        if (hasSession) {
          const user = await getMe();
          setUser(user);

          if (isAuthRoute(pathname)) {
            router.replace("/profile");
          }
        } else {
          clearIsAuthenticated();

          if (isPrivateRoute(pathname)) {
            await logout().catch(() => undefined);
            router.replace("/sign-in");
          }
        }
      } catch (error) {
        clearIsAuthenticated();
        if (isPrivateRoute(pathname)) {
          router.replace("/sign-in");
        }
      } finally {
        setIsChecking(false);
        setSessionVerified(true);
      }
    };

    verifySession();
  }, [pathname, router, setUser, clearIsAuthenticated]);

  if (isChecking) {
    return (
      <div className={css.loaderWrapper}>
        <div className={css.loader}></div>
      </div>
    );
  }

  if (!isAuthenticated && sessionVerified && isPrivateRoute(pathname)) {
    return null;
  }

  return <>{children}</>;
};

export default AuthProvider;
