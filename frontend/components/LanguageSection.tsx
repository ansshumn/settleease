import { useState } from 'react';
import { ChevronDown, ChevronUp, Volume2 } from 'lucide-react';
import { PhraseCategory, Language, languages } from '@/data/languages';

interface LanguageSectionProps {
  category: PhraseCategory;
  selectedLanguage: Language;
}

export function LanguageSection({ category, selectedLanguage }: LanguageSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getLanguageKey = (lang: Language): keyof (typeof category.phrases)[0] => {
    const langMap: Record<Language, keyof (typeof category.phrases)[0]> = {
      Hindi: 'hindi',
      Tamil: 'tamil',
      Kannada: 'kannada',
      Bengali: 'bengali',
      Marathi: 'marathi',
    };
    return langMap[lang];
  };

  return (
    <div className="language-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-2"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{getCategoryEmoji(category.id)}</span>
          <span className="font-medium text-foreground">{category.name}</span>
          <span className="text-sm text-muted-foreground">
            ({category.phrases.length} phrases)
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 animate-fade-in">
          {category.phrases.map((phrase, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">English</p>
                  <p className="font-medium text-foreground">{phrase.english}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-1">{selectedLanguage}</p>
                <div className="flex items-center justify-between">
                  <p className="font-medium text-primary text-lg">
                    {phrase[getLanguageKey(selectedLanguage)]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCategoryEmoji(id: string): string {
  const emojis: Record<string, string> = {
    greetings: '👋',
    shopping: '🛍️',
    emergency: '🚨',
    daily: '☀️',
    food: '🍽️',
  };
  return emojis[id] || '💬';
}
