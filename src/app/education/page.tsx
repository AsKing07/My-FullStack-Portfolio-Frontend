"use client";

import { useEducations } from "@/hooks/useEducations";
import { Badge } from "@/components/ui/badge_component";
import { Loader2, GraduationCap, MapPin, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "@/components/ui/loading_spinner";

export default function EducationPage() {
  const { educations, loading, error } = useEducations();

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
          Une erreur est survenue
        </h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          Erreur lors du chargement du parcours de formation&nbsp;:<br />
          <span className="font-mono break-all">{error}</span>
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-12 drop-shadow flex items-center justify-center gap-3">
          <GraduationCap className="w-10 h-10 text-primary" />
          Parcours scolaire & formations
        </h1>

        
          <ol className="relative border-l-4 border-blue-200 dark:border-blue-800 ml-8">
            {(Array.isArray(educations) ? educations : [])
              .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
              .map((edu, i) => (
                <li key={edu.id} className="mb-12 pl-8 relative group">
                  {/* Timeline dot */}
                  <span
                    className="absolute left-0 top-0 -translate-x-1/2 flex items-center justify-center w-10 h-10 rounded-full ring-4 ring-white dark:ring-slate-900 shadow-lg bg-blue-600"
                    style={{ marginTop: "-8px" }}
                  >
                    <GraduationCap className="w-5 h-5 text-white" />
                  </span>
                  {/* Card */}
                  <div className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-xl p-8 transition group-hover:shadow-2xl border border-blue-100 dark:border-blue-900">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">{edu.degree}</h3>
                        {edu.grade && (
                          <Badge className="ml-2 bg-purple-600 text-white">{edu.grade}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(edu.startDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                        {" - "}
                        {edu.current || !edu.endDate
                          ? "Aujourd'hui"
                          : new Date(edu.endDate).toLocaleDateString("fr-FR", { year: "numeric", month: "short" })}
                        {edu.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="w-4 h-4" />
                            {edu.location}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-blue-600 dark:text-blue-400 font-medium mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {edu.school}
                      {edu.field && (
                        <span className="ml-2 text-sm text-muted-foreground">({edu.field})</span>
                      )}
                    </div>
                    {edu.description && (
                      <div className="text-muted-foreground mb-2">{edu.description}</div>
                    )}
                  </div>
                </li>
              ))}
          </ol>
        
      </div>
    </div>
  );
}