'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card_component';
import { Badge } from '@/components/ui/badge_component';
import { Calendar, MapPin, Code, Music, Link as LinkIcon, Gamepad, Book, Info, AlertTriangle,  } from 'lucide-react';
import { soccerBall } from '@lucide/lab';

import { createLucideIcon, icons } from 'lucide-react';

import { useUser } from '@/hooks/useUser';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/ui/loading_spinner';


const Football = createLucideIcon('Football', soccerBall);

const interests = [
  { icon: Football , name: 'Football', color: 'bg-green-600' },
  { icon: Music, name: 'Music', color: 'bg-purple-500' },
  { icon: Gamepad, name: 'Video Games', color: 'bg-blue-500' },
  { icon: Book, name: 'Reading', color: 'bg-amber-600' }
];

export default function AboutPage() {
  const { user, loading, error } = useUser();

    if (loading) {
    return (
<div className="flex-1 flex flex-col justify-center items-center min-h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">        
  <div className="container mx-auto">
    
     <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
  <LoadingSpinner />
</div>
        </div>
      </div>
    );
  }

if (error) {
  return (
    <div className="flex-1 w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="flex flex-col items-center gap-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 px-8 py-8 rounded-xl shadow-lg max-w-md">
        <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">
        An error has occurred
        </h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          Error loading information&nbsp;:<br />
          <span className="font-mono break-all">{error}</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
         Try again
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
        <h1 className="text-4xl md:text-5xl font-bold bg-primary bg-clip-text text-transparent mb-12 drop-shadow flex items-center justify-center gap-3">
          <Info className="w-10 h-10 text-primary" />
         About Me
        </h1>
       
        </motion.div>

<div className="flex justify-center mb-16">
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="w-full max-w-xl mx-auto"
  >
            <Card className="h-full">
              <CardHeader>
              <CardTitle className="flex justify-center text-center items-center gap-2">
                <Code className="w-5 h-5" />
                My Story
              </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
              <div className="flex items-center justify-center">
                {user?.avatarUrl ? (
                <Image
                  src={user.avatarUrl}
                  alt={user.name || "Avatar"}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-blue-200 dark:border-blue-800 shadow mb-4"
                />
                ) : (
                <div className="w-28 h-28 rounded-full bg-blue-100 flex items-center justify-center text-5xl mb-4">
                  👤
                </div>
                )}
              </div>
              <h2 className="text-2xl font-bold text-center">{user?.name || "Charbel SONON"}</h2>
              {user?.title && (
                <p className="text-center text-blue-600 dark:text-blue-400 font-medium">{user.title}</p>
              )}
              <p className="text-muted-foreground text-center">{user?.subtitle}</p>
              <p className="text-muted-foreground text-center">
                {user?.bio ||
                "Développeur fullstack passionné par la création d'applications web modernes, performantes et accessibles."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                {user?.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {user.location}
                </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                Available for projects
                </div>
              
              </div>
              
              </CardContent>
            </Card>
            </motion.div>
        </div>

        {/* Centres d'intérêt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center mb-12">Centers of Interest</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              >
                <Card className="text-center hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className={`w-12 h-12 ${interest.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <interest.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium">{interest.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
           </motion.div>
      </div>
    </div>
  );
}