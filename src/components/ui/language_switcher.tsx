"use client"

import { useLocale, useTranslations } from "next-intl"
import { useParams } from "next/navigation"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { Button } from "@/components/ui/button_component"

const localeLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
}

export function LanguageSwitcher() {
  const t = useTranslations("Nav")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()

  const switchLocale = (nextLocale: string) => {
    router.replace(
      // @ts-expect-error -- pathname comes from next-intl's typed navigation, params are passed through as-is
      { pathname, params },
      { locale: nextLocale }
    )
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={t("languageSwitcherAriaLabel")}>
      {routing.locales.map((loc) => (
        <Button
          key={loc}
          variant={loc === locale ? "default" : "ghost"}
          size="sm"
          className="px-2 h-8 text-xs font-semibold"
          onClick={() => switchLocale(loc)}
          aria-current={loc === locale ? "true" : undefined}
        >
          {localeLabels[loc]}
        </Button>
      ))}
    </div>
  )
}
