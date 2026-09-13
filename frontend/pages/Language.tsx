import { useState } from 'react';
import { Header } from '@/components/Header';
import { Translator } from '@/components/Translator';
import { LanguageSection } from '@/components/LanguageSection';
import { languageCategories, languages, Language } from '@/data/languages';
import { Languages, Globe } from 'lucide-react';

const LanguageHelper = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('Kannada');

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary mx-auto mb-4 flex items-center justify-center">
              <Languages className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              <span className="text-gradient">Language Helper</span>
            </h1>
            <p className="text-muted-foreground">
              Learn essential phrases in local languages 🗣️
            </p>
          </div>

          {/* AI Translator */}
          <Translator />

          {/* Language Selector */}
          <div className="glass-card p-4 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <span className="font-medium">Select Target Language:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedLanguage === lang
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80'
                    }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="glass-card p-4 mb-6 bg-primary/5 border-primary/20">
            <p className="text-sm text-center">
              <span className="font-medium">Pro Tip:</span> Click on any category to expand and see phrases.
              <br />
              Learning basic {selectedLanguage} will make your daily life much easier! 💪
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {languageCategories.map((category) => (
              <LanguageSection
                key={category.id}
                category={category}
                selectedLanguage={selectedLanguage}
              />
            ))}
          </div>

          {/* Footer Note */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Tip: Locals always appreciate when you try to speak their language! 🙏
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LanguageHelper;
