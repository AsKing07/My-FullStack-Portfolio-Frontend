"use client";

import { useEducations } from "@/hooks/useEducations";
import { Badge } from "@/components/ui/badge_component";
import { GraduationCap, MapPin, Calendar, BookOpen, AlertTriangle } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
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
          An error has occurred
        </h2>
        <p className="text-sm text-red-600 dark:text-red-200 text-center">
          Error loading training course&nbsp;:<br />
          <span className="font-mono break-all">{error}</span>
        </p>
        <button
          onClick={() => globalThis.location.reload()}
          className="mt-2 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 dark:from-slate-900 dark:via-purple-950 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-pink-400/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-in slide-in-from-top duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-purple-100 dark:bg-purple-900 rounded-full mb-6">
              <GraduationCap className="w-12 h-12 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent leading-tight">
              Educational Journey
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
              My academic background and continuous learning path that shaped my knowledge and skills
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-20">
        {/* Timeline Section with enhanced design */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Academic Timeline
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A chronological journey through my educational milestones and achievements
            </p>
          </div>
        
          {/* Enhanced Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Timeline line - responsive positioning */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-rose-400 transform md:-translate-x-1/2"></div>
            
            <div className="space-y-12 md:space-y-16">
              {(Array.isArray(educations) ? educations : [])
                .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
                .map((edu, i) => (
                  <div key={edu.id} className={`relative flex items-center ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} flex-col md:gap-8 lg:gap-16`}>
                    {/* Timeline dot - responsive positioning */}
                    <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 top-8 md:top-1/2 z-10">
                      <div className="w-8 h-8 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 md:ring-4 ring-white dark:ring-slate-900 shadow-xl transition-transform hover:scale-110">
                        <GraduationCap className="w-3 h-3 md:w-7 md:h-7 text-white" />
                      </div>
                    </div>
                    
                    {/* Content Card - responsive layout */}
                    <div className={`w-full md:w-5/12 pl-12 md:pl-0 pr-4 md:pr-0 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="group">
                        <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-white/50 dark:border-slate-700/50 overflow-hidden">
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Header - responsive layout */}
                          <div className={`relative flex flex-col ${i % 2 === 0 ? 'md:items-end' : 'md:items-start'} gap-3 mb-4 md:mb-6`}>
                            <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                              <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {edu.degree}
                              </h3>
                              {edu.grade && (
                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs md:text-sm px-2 md:px-3 py-1 shadow-lg self-start">
                                  {edu.grade}
                                </Badge>
                              )}
                            </div>
                            
                            <div className={`flex flex-col md:flex-row items-start md:items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold text-base md:text-lg ${i % 2 === 0 ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
                              <BookOpen className="w-4 h-4 md:w-5 md:h-5" />
                              <span>{edu.school}</span>
                              {edu.field && (
                                <span className="ml-2 text-xs md:text-sm text-gray-500 dark:text-gray-400">
                                  ({edu.field})
                                </span>
                              )}
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 text-gray-500 dark:text-gray-400 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span className="font-mono text-xs md:text-sm">
                                  {formatDateShort(edu.startDate)} - {edu.current || !edu.endDate ? "Present" : formatDateShort(edu.endDate)}
                                </span>
                              </div>
                              {edu.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-xs md:text-sm">{edu.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          {/* Description - responsive text */}
                          {edu.description && (
                            <div className="relative text-gray-700 dark:text-gray-300 leading-relaxed text-sm md:text-base">
                              {edu.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Spacer for the other side - only visible on desktop */}
                    <div className="hidden md:block w-5/12"></div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Academic Achievements Section */}
        <section className="mb-24">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-2 bg-rose-100 dark:bg-rose-900 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">
              Academic Highlights
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Key achievements and milestones throughout my educational journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Education Stats Cards */}
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {(Array.isArray(educations) ? educations : []).length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Degrees & Certifications
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {(Array.isArray(educations) ? educations : []).filter(edu => edu.grade).length}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Graded Achievements
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-orange-100 dark:from-rose-900/30 dark:to-orange-900/30 rounded-3xl transform group-hover:scale-105 transition-transform duration-300"></div>
              <div className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-3xl p-8 border border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl transition-all duration-300">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {(() => {
                      const years = (Array.isArray(educations) ? educations : []).reduce((total, edu) => {
                        if (edu.startDate && edu.endDate) {
                          return total + Math.abs(new Date(edu.endDate).getFullYear() - new Date(edu.startDate).getFullYear());
                        }
                        return total;
                      }, 0);
                      return years;
                    })()}+
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">
                    Years of Learning
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}