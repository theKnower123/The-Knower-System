import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocaleStore } from "@/store/i18n";
import "@/i18n";

/** Bootstraps i18n language + <html dir/lang> to match persisted locale. */
export function I18nBootstrap({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    if (i18n.language !== locale) void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  }, [i18n, locale]);

  return <>{children}</>;
}
