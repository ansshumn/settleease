export interface Phrase {
  english: string;
  hindi: string;
  tamil: string;
  kannada: string;
  bengali: string;
  marathi: string;
}

export interface PhraseCategory {
  id: string;
  name: string;
  icon: string;
  phrases: Phrase[];
}

export const languageCategories: PhraseCategory[] = [
  {
    id: 'greetings',
    name: 'Greetings',
    icon: 'hand-wave',
    phrases: [
      {
        english: 'Hello / Hi',
        hindi: 'Namaste / Hello',
        tamil: 'Vanakkam',
        kannada: 'Namaskara',
        bengali: 'Namaskar',
        marathi: 'Namaskar'
      },
      {
        english: 'How are you?',
        hindi: 'Aap kaise hain?',
        tamil: 'Eppadi irukinga?',
        kannada: 'Hegidira?',
        bengali: 'Kemon acho?',
        marathi: 'Kasa aahes?'
      },
      {
        english: 'I am fine',
        hindi: 'Main theek hoon',
        tamil: 'Naan nalla iruken',
        kannada: 'Naanu chennagiddini',
        bengali: 'Ami bhalo achi',
        marathi: 'Mi bara aahe'
      },
      {
        english: 'Thank you',
        hindi: 'Dhanyavaad',
        tamil: 'Nandri',
        kannada: 'Dhanyavaadagalu',
        bengali: 'Dhonyobad',
        marathi: 'Dhanyavaad'
      },
      {
        english: 'Goodbye',
        hindi: 'Alvida / Phir milenge',
        tamil: 'Poi varugiren',
        kannada: 'Hogibartini',
        bengali: 'Abar dekha hobe',
        marathi: 'Punha bhetoo'
      }
    ]
  },
  {
    id: 'shopping',
    name: 'Shopping & Bargaining',
    icon: 'shopping-bag',
    phrases: [
      {
        english: 'How much is this?',
        hindi: 'Yeh kitne ka hai?',
        tamil: 'Idhu evvalavu?',
        kannada: 'Idu eshtu?',
        bengali: 'Eta koto?',
        marathi: 'He kiticha aahe?'
      },
      {
        english: 'Too expensive',
        hindi: 'Bahut mehenga hai',
        tamil: 'Romba costly',
        kannada: 'Thumba costly',
        bengali: 'Onek beshi dam',
        marathi: 'Khup mahag aahe'
      },
      {
        english: 'Give me discount',
        hindi: 'Thoda kam karo',
        tamil: 'Konjam kammi pannunga',
        kannada: 'Swalpa kammi maadi',
        bengali: 'Ektu komao',
        marathi: 'Thoda kami kara'
      },
      {
        english: 'I will take this',
        hindi: 'Yeh le lunga',
        tamil: 'Idha eduppen',
        kannada: 'Idu togothini',
        bengali: 'Eta nebo',
        marathi: 'He gheyn'
      },
      {
        english: 'Do you have change?',
        hindi: 'Change hai?',
        tamil: 'Change iruka?',
        kannada: 'Change ide?',
        bengali: 'Bhangar ache?',
        marathi: 'Sutte aahet ka?'
      }
    ]
  },
  {
    id: 'emergency',
    name: 'Emergency Phrases',
    icon: 'siren',
    phrases: [
      {
        english: 'Help!',
        hindi: 'Madad karo!',
        tamil: 'Udavi!',
        kannada: 'Sahaaya maadi!',
        bengali: 'Sahajjo koro!',
        marathi: 'Madad kara!'
      },
      {
        english: 'Call the police',
        hindi: 'Police ko bulao',
        tamil: 'Police-ai kupdunga',
        kannada: 'Police karithin',
        bengali: 'Police dako',
        marathi: 'Police la bolava'
      },
      {
        english: 'I need a doctor',
        hindi: 'Mujhe doctor chahiye',
        tamil: 'Enakku doctor venum',
        kannada: 'Nanage doctor beku',
        bengali: 'Amar doctor lagbe',
        marathi: 'Mala doctor hava'
      },
      {
        english: 'Where is the hospital?',
        hindi: 'Hospital kahan hai?',
        tamil: 'Hospital engey?',
        kannada: 'Hospital elli ide?',
        bengali: 'Hospital kothay?',
        marathi: 'Hospital kuthe aahe?'
      },
      {
        english: 'I am lost',
        hindi: 'Main kho gaya hoon',
        tamil: 'Naan vazhi thavariten',
        kannada: 'Naanu dari tappidini',
        bengali: 'Ami hariye gechi',
        marathi: 'Mi harwle aahe'
      }
    ]
  },
  {
    id: 'daily',
    name: 'Daily Use',
    icon: 'sun',
    phrases: [
      {
        english: 'Where is the bus stop?',
        hindi: 'Bus stop kahan hai?',
        tamil: 'Bus stop engey?',
        kannada: 'Bus stop elli ide?',
        bengali: 'Bus stop kothay?',
        marathi: 'Bus stop kuthe aahe?'
      },
      {
        english: 'I am new here',
        hindi: 'Main yahan naya hoon',
        tamil: 'Naan inga pudusa',
        kannada: 'Naanu illi hosu',
        bengali: 'Ami ekhane notun',
        marathi: 'Mi ithe nava aahe'
      },
      {
        english: 'I don\'t understand',
        hindi: 'Mujhe samajh nahi aaya',
        tamil: 'Puriyala',
        kannada: 'Nanage artha agilla',
        bengali: 'Ami bujhte parchi na',
        marathi: 'Mala samajle nahi'
      },
      {
        english: 'Can you speak slowly?',
        hindi: 'Thoda dheere boliye',
        tamil: 'Konjam medhuvaa sollunga',
        kannada: 'Swalpa nidhanavaagi heli',
        bengali: 'Aaste bolun please',
        marathi: 'Thoda haluwar bola'
      },
      {
        english: 'What is your name?',
        hindi: 'Aapka naam kya hai?',
        tamil: 'Unga peru enna?',
        kannada: 'Nimma hesaru enu?',
        bengali: 'Tomar naam ki?',
        marathi: 'Tumche nav kay?'
      },
      {
        english: 'My name is...',
        hindi: 'Mera naam ... hai',
        tamil: 'En peru ...',
        kannada: 'Nanna hesaru ...',
        bengali: 'Amar naam ...',
        marathi: 'Majhe nav ... aahe'
      }
    ]
  },
  {
    id: 'food',
    name: 'Food & Ordering',
    icon: 'utensils',
    phrases: [
      {
        english: 'I am vegetarian',
        hindi: 'Main shakahari hoon',
        tamil: 'Naan vegetarian',
        kannada: 'Naanu shakaahaari',
        bengali: 'Ami niramish khai',
        marathi: 'Mi shakahari aahe'
      },
      {
        english: 'Less spicy please',
        hindi: 'Kam mirchi dalna',
        tamil: 'Kammi kaaram podu',
        kannada: 'Kammi khaara maadi',
        bengali: 'Jhal kom',
        marathi: 'Kam tikhat kara'
      },
      {
        english: 'Give me water',
        hindi: 'Paani dena',
        tamil: 'Thanni kudu',
        kannada: 'Neeru kodi',
        bengali: 'Jol dao',
        marathi: 'Pani dya'
      },
      {
        english: 'Bill please',
        hindi: 'Bill de dijiye',
        tamil: 'Bill kudunga',
        kannada: 'Bill kodi',
        bengali: 'Bill dao',
        marathi: 'Bill dya'
      }
    ]
  }
];

export const languages = ['Hindi', 'Tamil', 'Kannada', 'Bengali', 'Marathi'] as const;
export type Language = typeof languages[number];
