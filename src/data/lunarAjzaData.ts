import { SURAHS, Surah } from './quranMetadata';

export interface ScholarlyNote {
  title: string;
  excerpt: string;
  arabicQuote?: string;
  translationQuote?: string;
  quranReference?: string;
}

export interface LunarJuz {
  day: number;                    // 1 to 30
  title: string;                  // e.g. "1st Juz", "15th Juz (Full Moon)"
  surahIds: number[];             // e.g. [1, 2]
  surahNames: string[];           // Transliterations e.g. ["Al-Fatihah", "Al-Baqarah"]
  surahArabicNames: string[];     // Arabic names e.g. ["الفاتحة", "البقرة"]
  totalVerses: number;
  startPrintedPage: number;
  startPdfPage: number;
  endPrintedPage: number;
  endPdfPage: number;
  scholarlyNote?: ScholarlyNote;
}

export const LUNAR_AJZA: LunarJuz[] = [
  {
    day: 1,
    title: '1st Juz',
    surahIds: [1, 2],
    surahNames: ['Al-Fatihah', 'Al-Baqarah'],
    surahArabicNames: ['الفاتحة', 'البقرة'],
    totalVerses: 293, // 7 + 286
    startPrintedPage: 2,
    startPdfPage: 3,
    endPrintedPage: 37,
    endPdfPage: 38,
  },
  {
    day: 2,
    title: '2nd Juz',
    surahIds: [3],
    surahNames: ["Ali 'Imran"],
    surahArabicNames: ['آل عمران'],
    totalVerses: 200,
    startPrintedPage: 38,
    startPdfPage: 39,
    endPrintedPage: 60,
    endPdfPage: 61,
  },
  {
    day: 3,
    title: '3rd Juz',
    surahIds: [4],
    surahNames: ['An-Nisa'],
    surahArabicNames: ['النساء'],
    totalVerses: 176,
    startPrintedPage: 61,
    startPdfPage: 62,
    endPrintedPage: 83,
    endPdfPage: 84,
  },
  {
    day: 4,
    title: '4th Juz',
    surahIds: [5],
    surahNames: ["Al-Ma'idah"],
    surahArabicNames: ['المائدة'],
    totalVerses: 120,
    startPrintedPage: 84,
    startPdfPage: 85,
    endPrintedPage: 101,
    endPdfPage: 102,
  },
  {
    day: 5,
    title: '5th Juz',
    surahIds: [6],
    surahNames: ["Al-An'am"],
    surahArabicNames: ['الأنعام'],
    totalVerses: 165,
    startPrintedPage: 102,
    startPdfPage: 103,
    endPrintedPage: 118,
    endPdfPage: 119,
  },
  {
    day: 6,
    title: '6th Juz',
    surahIds: [7],
    surahNames: ["Al-A'raf"],
    surahArabicNames: ['الأعراف'],
    totalVerses: 206,
    startPrintedPage: 119,
    startPdfPage: 120,
    endPrintedPage: 140,
    endPdfPage: 141,
  },
  {
    day: 7,
    title: '7th Juz',
    surahIds: [8, 9],
    surahNames: ['Al-Anfal', 'At-Tawbah'],
    surahArabicNames: ['الأنفال', 'التوبة'],
    totalVerses: 204, // 75 + 129
    startPrintedPage: 141,
    startPdfPage: 142,
    endPrintedPage: 164,
    endPdfPage: 165,
  },
  {
    day: 8,
    title: '8th Juz',
    surahIds: [10, 11],
    surahNames: ['Yunus', 'Hud'],
    surahArabicNames: ['يونس', 'هود'],
    totalVerses: 232, // 109 + 123
    startPrintedPage: 165,
    startPdfPage: 166,
    endPrintedPage: 186,
    endPdfPage: 187,
  },
  {
    day: 9,
    title: '9th Juz',
    surahIds: [12, 13],
    surahNames: ['Yusuf', "Ar-Ra'd"],
    surahArabicNames: ['يوسف', 'الرعد'],
    totalVerses: 154, // 111 + 43
    startPrintedPage: 187,
    startPdfPage: 188,
    endPrintedPage: 202,
    endPdfPage: 203,
  },
  {
    day: 10,
    title: '10th Juz',
    surahIds: [14, 15],
    surahNames: ['Ibrahim', 'Al-Hijr'],
    surahArabicNames: ['إبراهيم', 'الحجر'],
    totalVerses: 151, // 52 + 99
    startPrintedPage: 203,
    startPdfPage: 204,
    endPrintedPage: 213,
    endPdfPage: 214,
  },
  {
    day: 11,
    title: '11th Juz',
    surahIds: [16],
    surahNames: ['An-Nahl'],
    surahArabicNames: ['النحل'],
    totalVerses: 128,
    startPrintedPage: 214,
    startPdfPage: 215,
    endPrintedPage: 224,
    endPdfPage: 225,
  },
  {
    day: 12,
    title: '12th Juz',
    surahIds: [17, 18],
    surahNames: ['Al-Isra', 'Al-Kahf'],
    surahArabicNames: ['الإسراء', 'الكهف'],
    totalVerses: 221, // 111 + 110
    startPrintedPage: 225,
    startPdfPage: 226,
    endPrintedPage: 243,
    endPdfPage: 244,
  },
  {
    day: 13,
    title: '13th Juz',
    surahIds: [19, 20],
    surahNames: ['Maryam', 'Taha'],
    surahArabicNames: ['مريم', 'طه'],
    totalVerses: 233, // 98 + 135
    startPrintedPage: 244,
    startPdfPage: 245,
    endPrintedPage: 256,
    endPdfPage: 257,
  },
  {
    day: 14,
    title: '14th Juz',
    surahIds: [21, 22],
    surahNames: ['Al-Anbiya', 'Al-Hajj'],
    surahArabicNames: ['الأنبياء', 'الحج'],
    totalVerses: 190, // 112 + 78
    startPrintedPage: 257,
    startPdfPage: 258,
    endPrintedPage: 272,
    endPdfPage: 273,
  },
  {
    day: 15,
    title: '15th Juz (Full Moon • Sūrah al-Nūr)',
    surahIds: [23, 24],
    surahNames: ["Al-Mu'minun", 'An-Nur'],
    surahArabicNames: ['المؤمنون', 'النور'],
    totalVerses: 182, // 118 + 64
    startPrintedPage: 273,
    startPdfPage: 274,
    endPrintedPage: 286,
    endPdfPage: 287,
    scholarlyNote: {
      title: 'Arrival of the Full Moon (Nūr)',
      excerpt:
        'When the 14th day of the month has ended and the 15th night commences, the time of the full moon has arrived. Since this is the time of most Nūr or light, Allah Most High gives us Sūrah al-Nūr to be recited on the 15th day. Whenever he recites this Sūrah while reciting the whole Qur\'ān once a lunar month, the believer is thus alerted to the arrival of that stage in the passage of time during the lunar month, when half the month has ended, and half now remains.',
      quranReference: 'Sūrah al-Nūr (24:1-64)',
    },
  },
  {
    day: 16,
    title: '16th Juz',
    surahIds: [25, 26],
    surahNames: ['Al-Furqan', "Ash-Shu'ara"],
    surahArabicNames: ['الفرقان', 'الشعراء'],
    totalVerses: 304, // 77 + 227
    startPrintedPage: 287,
    startPdfPage: 288,
    endPrintedPage: 299,
    endPdfPage: 300,
  },
  {
    day: 17,
    title: '17th Juz',
    surahIds: [27, 28, 29],
    surahNames: ['An-Naml', 'Al-Qasas', "Al-'Ankabut"],
    surahArabicNames: ['النمل', 'القصص', 'العنكبوت'],
    totalVerses: 250, // 93 + 88 + 69
    startPrintedPage: 300,
    startPdfPage: 301,
    endPrintedPage: 322,
    endPdfPage: 323,
  },
  {
    day: 18,
    title: '18th Juz',
    surahIds: [30, 31, 32, 33],
    surahNames: ['Ar-Rum', 'Luqman', 'As-Sajdah', 'Al-Ahzab'],
    surahArabicNames: ['الروم', 'لقمان', 'السجدة', 'الأحزاب'],
    totalVerses: 197, // 60 + 34 + 30 + 73
    startPrintedPage: 323,
    startPdfPage: 324,
    endPrintedPage: 340,
    endPdfPage: 341,
  },
  {
    day: 19,
    title: '19th Juz',
    surahIds: [34, 35, 36, 37],
    surahNames: ['Saba', 'Fatir', 'Ya-Sin', 'As-Saffat'],
    surahArabicNames: ['سبأ', 'فاطر', 'يس', 'الصافات'],
    totalVerses: 364, // 54 + 45 + 83 + 182
    startPrintedPage: 341,
    startPdfPage: 342,
    endPrintedPage: 360,
    endPdfPage: 361,
  },
  {
    day: 20,
    title: '20th Juz',
    surahIds: [38, 39, 40],
    surahNames: ['Sad', 'Az-Zumar', 'Ghafir'],
    surahArabicNames: ['ص', 'الزمر', 'غافر'],
    totalVerses: 248, // 88 + 75 + 85
    startPrintedPage: 361,
    startPdfPage: 362,
    endPrintedPage: 379,
    endPdfPage: 380,
  },
  {
    day: 21,
    title: '21st Juz (Last Third • Lailatul Qadr)',
    surahIds: [41, 42, 43, 44],
    surahNames: ['Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan'],
    surahArabicNames: ['فصلت', 'الشورى', 'الزخرف', 'الدخان'],
    totalVerses: 255, // 54 + 53 + 89 + 59
    startPrintedPage: 380,
    startPdfPage: 381,
    endPrintedPage: 397,
    endPdfPage: 398,
    scholarlyNote: {
      title: 'Commencement of the Last Third & Lailatul Qadr',
      excerpt:
        'When the 21st day of the month commences, this is of paramount importance in blessed Ramadān since it marks the commencement of the last 1/3 of the month, during whose odd nights Lailatul Qadr occurs. On this night, the angels and the Rūh (Gabriel) descend. In Sūrah Fussilāt (41:30-32), we learn of what the angels bring to the steadfast believers: glad tidings of Paradise. In Sūrah al-Dukhān (44:3-5), we are reminded that Allah sent down the Qur\'ān on a blessed night, distinguishing all matters in wisdom.',
      arabicQuote:
        'إِنَّ الَّذِينَ قَالُوا رَبُّنَا اللَّهُ ثُمَّ اسْتَقَامُوا تَتَنَزَّلُ عَلَيْهِمُ الْمَلَائِكَةُ أَلَّا تَخَافُوا وَلَا تَحْزَنُوا وَأَبْشِرُوا بِالْجَنَّةِ الَّتِي كُنتُمْ تُوعَدُونَ',
      translationQuote:
        '“Fear not and grieve not, but receive the glad tiding of that paradise which has been promised to you! We are close unto you in the life of this world and in the life to come...”',
      quranReference: 'Fussilāt 41:30-32 & al-Dukhān 44:3-5',
    },
  },
  {
    day: 22,
    title: '22nd Juz',
    surahIds: [45, 46, 47, 48, 49],
    surahNames: ['Al-Jathiyah', 'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat'],
    surahArabicNames: ['الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات'],
    totalVerses: 157, // 37 + 35 + 38 + 29 + 18
    startPrintedPage: 398,
    startPdfPage: 399,
    endPrintedPage: 412,
    endPdfPage: 413,
  },
  {
    day: 23,
    title: '23rd Juz (The Star & The Moon • Final Week)',
    surahIds: [50, 51, 52, 53, 54],
    surahNames: ['Qaf', 'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar'],
    surahArabicNames: ['ق', 'الذاريات', 'الطور', 'النجم', 'القمر'],
    totalVerses: 271, // 45 + 60 + 49 + 62 + 55
    startPrintedPage: 413,
    startPdfPage: 414,
    endPrintedPage: 423,
    endPdfPage: 424,
    scholarlyNote: {
      title: 'Starlight Replaces Moonlight in the Final Week',
      excerpt:
        'When the 22nd day ends and the 23rd commences, only one week remains for the month to conclude. During this final week, a momentous celestial change occurs: the moon eventually disappears, and stars take over the night-sky. Starlight replaces moonlight. Allah Most High gives us Sūrah al-Najm (The Star) followed by Sūrah al-Qamar (The Moon) on the 23rd day, alerting us both that starlight replaces moonlight and that the final week has begun, preparing the sky for receiving the slender light of the new moon.',
      quranReference: 'Sūrah al-Najm (53) & Sūrah al-Qamar (54)',
    },
  },
  {
    day: 24,
    title: '24th Juz',
    surahIds: [55, 56, 57, 58],
    surahNames: ['Ar-Rahman', "Al-Waqi'ah", 'Al-Hadid', 'Al-Mujadila'],
    surahArabicNames: ['الرحمن', 'الواقعة', 'الحديد', 'المجادلة'],
    totalVerses: 225, // 78 + 96 + 29 + 22
    startPrintedPage: 424,
    startPdfPage: 425,
    endPrintedPage: 434,
    endPdfPage: 435,
  },
  {
    day: 25,
    title: '25th Juz',
    surahIds: [59, 60, 61, 62, 63, 64, 65, 66, 67, 68],
    surahNames: [
      'Al-Hashr',
      'Al-Mumtahanah',
      'As-Saf',
      "Al-Jumu'ah",
      'Al-Munafiqun',
      'At-Taghabun',
      'At-Talaq',
      'At-Tahrim',
      'Al-Mulk',
      'Al-Qalam',
    ],
    surahArabicNames: [
      'الحشر',
      'الممتحنة',
      'الصف',
      'الجمعة',
      'المنافقون',
      'التغابن',
      'الطلاق',
      'التحريم',
      'الملك',
      'القلم',
    ],
    totalVerses: 187, // 24+13+14+11+11+18+12+12+30+52 = 197 or 187 (per pdf: 187)
    startPrintedPage: 435,
    startPdfPage: 436,
    endPrintedPage: 451,
    endPdfPage: 452,
  },
  {
    day: 26,
    title: '26th Juz',
    surahIds: [69, 70, 71, 72, 73, 74],
    surahNames: [
      'Al-Haqqah',
      "Al-Ma'arij",
      'Nuh',
      'Al-Jinn',
      'Al-Muzzammil',
      'Al-Muddaththir',
    ],
    surahArabicNames: ['الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر'],
    totalVerses: 228, // 52 + 44 + 28 + 28 + 20 + 56
    startPrintedPage: 452,
    startPdfPage: 453,
    endPrintedPage: 460,
    endPdfPage: 461,
  },
  {
    day: 27,
    title: '27th Juz',
    surahIds: [75, 76, 77, 78, 79],
    surahNames: ['Al-Qiyamah', 'Al-Insan', 'Al-Mursalat', 'An-Naba', "An-Nazi'at"],
    surahArabicNames: ['القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات'],
    totalVerses: 207, // 40 + 31 + 50 + 40 + 46
    startPrintedPage: 461,
    startPdfPage: 462,
    endPrintedPage: 466,
    endPdfPage: 467,
  },
  {
    day: 28,
    title: '28th Juz',
    surahIds: [80, 81, 82, 83, 84, 85, 86, 87, 88],
    surahNames: [
      "'Abasa",
      'At-Takwir',
      'Al-Infitar',
      'Al-Mutaffifin',
      'Al-Inshiqaq',
      'Al-Buruj',
      'At-Tariq',
      "Al-A'la",
      'Al-Ghashiyah',
    ],
    surahArabicNames: [
      'عبس',
      'التكوير',
      'الانفطار',
      'المطففين',
      'الانشقاق',
      'البروج',
      'الطارق',
      'الأعلى',
      'الغاشية',
    ],
    totalVerses: 214, // 42+29+19+36+25+22+17+19+26
    startPrintedPage: 467,
    startPdfPage: 468,
    endPrintedPage: 474,
    endPdfPage: 475,
  },
  {
    day: 29,
    title: '29th Juz (Sūrah al-Qadr & The Crescent Moon)',
    surahIds: [89, 90, 91, 92, 93, 94, 95, 96, 97],
    surahNames: [
      'Al-Fajr',
      'Al-Balad',
      'Ash-Shams',
      'Al-Layl',
      'Ad-Duha',
      'Ash-Sharh',
      'At-Tin',
      "Al-'Alaq",
      'Al-Qadr',
    ],
    surahArabicNames: [
      'الفجر',
      'البلد',
      'الشمس',
      'الليل',
      'الضحى',
      'الشرح',
      'التين',
      'العلق',
      'القدر',
    ],
    totalVerses: 137, // 30+20+15+21+11+8+8+19+5
    startPrintedPage: 475,
    startPdfPage: 476,
    endPrintedPage: 479,
    endPdfPage: 480,
    scholarlyNote: {
      title: 'Lailatul Qadr and Sighting the New Moon',
      excerpt:
        'Sūrah al-Qadr informs us that Lailatul Qadr is by far the greatest night of the year, when the Qur\'ān was revealed, making mention of both al-Fajr and al-Layl. Our Juz arranges the recitation of Sūrah al-Qadr on the 29th day alongside both Sūrah al-Fajr and Sūrah al-Layl. When the 29th day ends, we look in the evening sky to see whether the new moon is visible. If sighted, we recite the remaining short Suwar to complete the cover-to-cover Khatam. If not, the remaining Suwar are recited on the 30th day.',
      quranReference: 'Sūrah al-Qadr (97), al-Fajr (89), al-Layl (92)',
    },
  },
  {
    day: 30,
    title: '30th Juz (Khatam & Complete Month)',
    surahIds: [
      98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112,
      113, 114,
    ],
    surahNames: [
      'Al-Bayyinah',
      'Az-Zalzalah',
      "Al-'Adiyat",
      "Al-Qari'ah",
      'At-Takathur',
      "Al-'Asr",
      'Al-Humazah',
      'Al-Fil',
      'Quraysh',
      "Al-Ma'un",
      'Al-Kawthar',
      'Al-Kafirun',
      'An-Nasr',
      'Al-Masad',
      'Al-Ikhlas',
      'Al-Falaq',
      'An-Nas',
    ],
    surahArabicNames: [
      'البينة',
      'الزلزلة',
      'العاديات',
      'القارعة',
      'التكاثر',
      'العصر',
      'الهمزة',
      'الفيل',
      'قريش',
      'الماعون',
      'الكوثر',
      'الكافرون',
      'النصر',
      'المسد',
      'الإخلاص',
      'الفلق',
      'الناس',
    ],
    totalVerses: 78,
    startPrintedPage: 480,
    startPdfPage: 481,
    endPrintedPage: 485,
    endPdfPage: 486,
    scholarlyNote: {
      title: 'Completing the Lunar Month in Harmony',
      excerpt:
        'Those who recite the Qur\'ān to complete it in one lunar month should restrain themselves from rushing completion before the month ends. Make sure to have a 29th Juz to recite on the 29th day, and a 30th Juz to recite in the event that the lunar month continues to a 30th day.',
      quranReference: 'Sūrah al-Bayyinah (98) to Sūrah an-Nās (114)',
    },
  },
];

export function getLunarJuzForDay(day: number): LunarJuz {
  const safeDay = Math.min(30, Math.max(1, Math.round(day)));
  return LUNAR_AJZA[safeDay - 1];
}

export function getAllLunarAjza(): LunarJuz[] {
  return LUNAR_AJZA;
}

/**
 * Returns the list of Surah objects for a specific Lunar Juz
 */
export function getSurahsForLunarJuz(juz: LunarJuz): Surah[] {
  return juz.surahIds
    .map((id) => SURAHS.find((s) => s.id === id))
    .filter((s): s is Surah => Boolean(s));
}

/**
 * Returns the Lunar Juz that corresponds to a given PDF page
 */
export function getLunarJuzForPdfPage(pdfPage: number): LunarJuz {
  if (pdfPage < 3) return LUNAR_AJZA[0];
  if (pdfPage > 486) return LUNAR_AJZA[29];

  const match = LUNAR_AJZA.find(
    (j) => pdfPage >= j.startPdfPage && pdfPage <= j.endPdfPage
  );
  if (match) return match;

  let candidate = LUNAR_AJZA[0];
  for (const j of LUNAR_AJZA) {
    if (j.startPdfPage <= pdfPage) {
      candidate = j;
    } else {
      break;
    }
  }
  return candidate;
}
