'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button_component';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
  
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  resetErrorBoundary = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 min-h-[200px] bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-lg text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mb-4" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-red-700 dark:text-red-400 mb-2">
            An error has occurred
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4 max-w-md">
            {this.state.error?.message || "Quelque chose s'est mal passé lors du chargement de cette section."}
          </p>
          <div className="flex gap-4">
            <Button 
              onClick={this.resetErrorBoundary} 
              variant="outline" 
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Try again
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              variant="default"
            >
             Refresh page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
