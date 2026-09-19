import { useEffect } from "react";
import { router } from "@inertiajs/react";

export default function ForgotPasswordPage() {
  useEffect(() => {
    router.replace("/login?view=forgot-password");
  }, []);

  return null;
}

ForgotPasswordPage.layout = (page: any) => page;
