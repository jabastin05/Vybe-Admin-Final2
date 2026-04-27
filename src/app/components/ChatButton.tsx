import { useState } from 'react';
import { MessageCircle, X, Sparkles } from 'lucide-react';
import { ExpertAdvisorChat } from './ExpertAdvisorChat';

interface ChatButtonProps {
  propertyContext?: {
    id: string;
    caseId: string;
    location: string;
  };
}

export function ChatButton({ propertyContext }: ChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 shadow-[0_8px_32px_rgba(168,85,247,0.4)] hover:shadow-[0_12px_48px_rgba(168,85,247,0.6)] flex items-center justify-center z-40 transition-all hover:scale-110 group"
        aria-label="Open Expert Advisor Chat"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-neutral-0 transition-transform group-hover:rotate-90" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-7 h-7 text-neutral-0" />
            {/* Pulsing indicator */}
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary-700 border-2 border-white animate-pulse"></div>
            {/* Sparkle effect */}
            <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
          </div>
        )}
      </button>

      {/* Chat Interface */}
      {isOpen && (
        <ExpertAdvisorChat 
          onClose={() => setIsOpen(false)} 
          propertyContext={propertyContext}
        />
      )}
    </>
  );
}
