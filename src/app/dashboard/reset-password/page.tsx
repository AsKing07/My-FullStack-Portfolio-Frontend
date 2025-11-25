'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Input } from '@/components/ui/form/input_component';
import { Button } from '@/components/ui/button_component';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Lock, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import { AuthService } from '@/services/auth.service';
import Link from 'next/link';

const formSchema = z.object({
  password: z.string()
    .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, { 
      message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre' 
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      toast.error('Token manquant. Veuillez utiliser le lien reçu par email.');
      router.push('/dashboard/login');
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router, toast]);

  async function onSubmit(values: FormValues) {
    if (!token) {
      toast.error('Token manquant. Veuillez utiliser le lien reçu par email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await AuthService.resetPassword(token, values.password);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success('Votre mot de passe a été réinitialisé avec succès.');
      } else {
        toast.error(response.message || 'Une erreur est survenue lors de la réinitialisation.');
      }
    } catch (error: any) {
      console.error('Erreur lors de la réinitialisation:', error);
      if (error.response?.status === 400) {
        toast.error('Token invalide ou expiré. Veuillez demander un nouveau lien.');
      } else if (error.response?.status === 404) {
        toast.error('Token introuvable. Veuillez demander un nouveau lien.');
      } else {
        toast.error('Une erreur est survenue. Veuillez réessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Validation du mot de passe en temps réel
  const getPasswordValidation = () => {
    const checks = [
      { label: 'Au moins 8 caractères', valid: password && password.length >= 8 },
      { label: 'Une majuscule', valid: password && /[A-Z]/.test(password) },
      { label: 'Une minuscule', valid: password && /[a-z]/.test(password) },
      { label: 'Un chiffre', valid: password && /\d/.test(password) },
    ];
    return checks;
  };

  if (!token) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="border-0 shadow-lg max-w-md w-full">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <CardTitle>Lien invalide</CardTitle>
            <CardDescription>
              Ce lien de réinitialisation n'est pas valide.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/dashboard/forgot-password" className="w-full">
              <Button className="w-full">Demander un nouveau lien</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
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
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl">Mot de passe réinitialisé</CardTitle>
              <CardDescription>
                Votre mot de passe a été modifié avec succès.
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Link href="/dashboard/login" className="w-full">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Se connecter
                </Button>
              </Link>
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
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Nouveau mot de passe</h1>
          <p className="text-slate-400">Définissez votre nouveau mot de passe</p>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Réinitialiser le mot de passe</CardTitle>
            <CardDescription>
              Choisissez un mot de passe sécurisé pour votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="password">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nouveau mot de passe"
                    {...register("password")}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                
                {/* Password requirements */}
                {password && (
                  <div className="mt-2 space-y-1">
                    {getPasswordValidation().map((check, index) => (
                      <div key={index} className="flex items-center text-xs">
                        {check.valid ? (
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-3 h-3 text-red-500 mr-2" />
                        )}
                        <span className={check.valid ? 'text-green-600' : 'text-red-600'}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirmer le mot de passe"
                    {...register("confirmPassword")}
                    className="pl-10"
                    disabled={isSubmitting}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Réinitialisation en cours...' : 'Réinitialiser le mot de passe'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/dashboard/login" className="text-sm text-blue-600 hover:underline">
              Retour à la connexion
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}