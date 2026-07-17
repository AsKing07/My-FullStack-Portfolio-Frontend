"use client"

import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Github, Linkedin, Mail, Heart, Globe, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button_component"
import { useUser } from "@/hooks/useUser"

export function Footer() {
  const t = useTranslations('Footer')
  const { user, loading, error } = useUser()

  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-4 md:order-2">
          {user?.github && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={user.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                <span className="sr-only">{t('github')}</span>
              </Link>
            </Button>
          )}
          {user?.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={user.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">{t('linkedin')}</span>
              </Link>
            </Button>
          )}
          {user?.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={user.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">{t('twitter')}</span>
              </Link>
            </Button>
          )}
          {user?.website && (
            <Button variant="ghost" size="icon" asChild>
              <Link href={user.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-5 w-5" />
                <span className="sr-only">{t('website')}</span>
              </Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" asChild>
            <Link href="/contact">
              <Mail className="h-5 w-5" />
              <span className="sr-only">{t('contact')}</span>
            </Link>
          </Button>
        </div>

        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-sm leading-5 text-muted-foreground flex items-center justify-center gap-1">
            &copy; {new Date().getFullYear()} {t('madeWithPrefix')}{" "}
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            {t('madeWithSuffix')} {user?.name || "Charbel SONON"}.
          </p>
        </div>
      </div>
    </footer>
  )
}