'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { Button } from '@/components/ui/button_component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail, Send } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';

const formSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      await AuthService.forgotPassword(values.email);
      setIsEmailSent(true);
      toast.success('Si votre compte existe, vous recevrez un email de réinitialisation.');
    } catch (error: any) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      // Même message pour des raisons de sécurité
      setIsEmailSent(true);
      toast.success('Si votre compte existe, vous recevrez un email de réinitialisation.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isEmailSent) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Email envoyé</CardTitle>
              <CardDescription>
                Si un compte existe avec l'adresse <strong>{getValues('email')}</strong>, 
                vous recevrez un email avec un lien pour réinitialiser votre mot de passe.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Vérifiez votre boîte de réception et vos spams.
                  Le lien sera valide pendant 2 heures.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <Link href="/dashboard/login" className="w-full">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour à la connexion
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => setIsEmailSent(false)}
                className="w-full text-sm"
              >
                Renvoyer un email
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
              <Mail className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Mot de passe oublié</h1>
          <p className="text-slate-400">
            Entrez votre adresse email pour recevoir un lien de réinitialisation
          </p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Nous vous enverrons un email avec les instructions pour réinitialiser votre mot de passe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="email">
                  Adresse email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="votre@email.com"
                    {...register("email")}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/dashboard/login" className="text-sm text-blue-600 hover:underline flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}