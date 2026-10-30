export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'Meccan' | 'Medinan';
  totalVerses: number;
  startPrintedPage: number; // printed page in Taj Quran
  startPdfPage: number;     // PDF page (startPrintedPage + 1)
  para: number;            // Starting Juz / Para
}

export interface Juz {
  id: number;
  nameArabic: string;
  nameTransliteration: string;
  startPrintedPage: number;
  startPdfPage: number;
  startSurahId: number;
  startVerse: number;
}

export interface Bookmark {
  id: string;
  pdfPage: number;
  printedPage: number;
  surahId: number;
  surahName: string;
  para: number;
  title: string;
  note?: string;
  createdAt: number;
}

export const SURAHS: Surah[] = [
  { id: 1, name: "الفاتحة", transliteration: "Al-Fatihah", translation: "The Opening", type: "Meccan", totalVerses: 7, startPrintedPage: 2, startPdfPage: 3, para: 1 },
  { id: 2, name: "البقرة", transliteration: "Al-Baqarah", translation: "The Cow", type: "Medinan", totalVerses: 286, startPrintedPage: 3, startPdfPage: 4, para: 1 },
  { id: 3, name: "آل عمران", transliteration: "Ali 'Imran", translation: "Family of Imran", type: "Medinan", totalVerses: 200, startPrintedPage: 38, startPdfPage: 39, para: 3 },
  { id: 4, name: "النساء", transliteration: "An-Nisa", translation: "The Women", type: "Medinan", totalVerses: 176, startPrintedPage: 61, startPdfPage: 62, para: 4 },
  { id: 5, name: "المائدة", transliteration: "Al-Ma'idah", translation: "The Table Spread", type: "Medinan", totalVerses: 120, startPrintedPage: 84, startPdfPage: 85, para: 6 },
  { id: 6, name: "الأنعام", transliteration: "Al-An'am", translation: "The Cattle", type: "Meccan", totalVerses: 165, startPrintedPage: 102, startPdfPage: 103, para: 7 },
  { id: 7, name: "الأعراف", transliteration: "Al-A'raf", translation: "The Heights", type: "Meccan", totalVerses: 206, startPrintedPage: 119, startPdfPage: 120, para: 8 },
  { id: 8, name: "الأنفال", transliteration: "Al-Anfal", translation: "The Spoils of War", type: "Medinan", totalVerses: 75, startPrintedPage: 141, startPdfPage: 142, para: 9 },
  { id: 9, name: "التوبة", transliteration: "At-Tawbah", translation: "The Repentance", type: "Medinan", totalVerses: 129, startPrintedPage: 149, startPdfPage: 150, para: 10 },
  { id: 10, name: "يونس", transliteration: "Yunus", translation: "Jonah", type: "Meccan", totalVerses: 109, startPrintedPage: 165, startPdfPage: 166, para: 11 },
  { id: 11, name: "هود", transliteration: "Hud", translation: "Hud", type: "Meccan", totalVerses: 123, startPrintedPage: 176, startPdfPage: 177, para: 11 },
  { id: 12, name: "يوسف", transliteration: "Yusuf", translation: "Joseph", type: "Meccan", totalVerses: 111, startPrintedPage: 187, startPdfPage: 188, para: 12 },
  { id: 13, name: "الرعد", transliteration: "Ar-Ra'd", translation: "The Thunder", type: "Medinan", totalVerses: 43, startPrintedPage: 198, startPdfPage: 199, para: 13 },
  { id: 14, name: "إبراهيم", transliteration: "Ibrahim", translation: "Abraham", type: "Meccan", totalVerses: 52, startPrintedPage: 203, startPdfPage: 204, para: 13 },
  { id: 15, name: "الحجر", transliteration: "Al-Hijr", translation: "The Rocky Tract", type: "Meccan", totalVerses: 99, startPrintedPage: 208, startPdfPage: 209, para: 14 },
  { id: 16, name: "النحل", transliteration: "An-Nahl", translation: "The Bee", type: "Meccan", totalVerses: 128, startPrintedPage: 214, startPdfPage: 215, para: 14 },
  { id: 17, name: "الإسراء", transliteration: "Al-Isra", translation: "The Night Journey", type: "Meccan", totalVerses: 111, startPrintedPage: 225, startPdfPage: 226, para: 15 },
  { id: 18, name: "الكهف", transliteration: "Al-Kahf", translation: "The Cave", type: "Meccan", totalVerses: 110, startPrintedPage: 234, startPdfPage: 235, para: 15 },
  { id: 19, name: "مريم", transliteration: "Maryam", translation: "Mary", type: "Meccan", totalVerses: 98, startPrintedPage: 244, startPdfPage: 245, para: 16 },
  { id: 20, name: "طه", transliteration: "Taha", translation: "Ta-Ha", type: "Meccan", totalVerses: 135, startPrintedPage: 249, startPdfPage: 250, para: 16 },
  { id: 21, name: "الأنبياء", transliteration: "Al-Anbiya", translation: "The Prophets", type: "Meccan", totalVerses: 112, startPrintedPage: 257, startPdfPage: 258, para: 17 },
  { id: 22, name: "الحج", transliteration: "Al-Hajj", translation: "The Pilgrimage", type: "Medinan", totalVerses: 78, startPrintedPage: 265, startPdfPage: 266, para: 17 },
  { id: 23, name: "المؤمنون", transliteration: "Al-Mu'minun", translation: "The Believers", type: "Meccan", totalVerses: 118, startPrintedPage: 273, startPdfPage: 274, para: 18 },
  { id: 24, name: "النور", transliteration: "An-Nur", translation: "The Light", type: "Medinan", totalVerses: 64, startPrintedPage: 279, startPdfPage: 280, para: 18 },
  { id: 25, name: "الفرقان", transliteration: "Al-Furqan", translation: "The Criterion", type: "Meccan", totalVerses: 77, startPrintedPage: 287, startPdfPage: 288, para: 18 },
  { id: 26, name: "الشعراء", transliteration: "Ash-Shu'ara", translation: "The Poets", type: "Meccan", totalVerses: 227, startPrintedPage: 293, startPdfPage: 294, para: 19 },
  { id: 27, name: "النمل", transliteration: "An-Naml", translation: "The Ant", type: "Meccan", totalVerses: 93, startPrintedPage: 300, startPdfPage: 301, para: 19 },
  { id: 28, name: "القصص", transliteration: "Al-Qasas", translation: "The Stories", type: "Meccan", totalVerses: 88, startPrintedPage: 307, startPdfPage: 308, para: 20 },
  { id: 29, name: "العنكبوت", transliteration: "Al-'Ankabut", translation: "The Spider", type: "Meccan", totalVerses: 69, startPrintedPage: 316, startPdfPage: 317, para: 20 },
  { id: 30, name: "الروم", transliteration: "Ar-Rum", translation: "The Romans", type: "Meccan", totalVerses: 60, startPrintedPage: 323, startPdfPage: 324, para: 21 },
  { id: 31, name: "لقمان", transliteration: "Luqman", translation: "Luqman", type: "Meccan", totalVerses: 34, startPrintedPage: 328, startPdfPage: 329, para: 21 },
  { id: 32, name: "السجدة", transliteration: "As-Sajdah", translation: "The Prostration", type: "Meccan", totalVerses: 30, startPrintedPage: 331, startPdfPage: 332, para: 21 },
  { id: 33, name: "الأحزاب", transliteration: "Al-Ahzab", translation: "The Combined Forces", type: "Medinan", totalVerses: 73, startPrintedPage: 333, startPdfPage: 334, para: 21 },
  { id: 34, name: "سبأ", transliteration: "Saba", translation: "Sheba", type: "Meccan", totalVerses: 54, startPrintedPage: 341, startPdfPage: 342, para: 22 },
  { id: 35, name: "فاطر", transliteration: "Fatir", translation: "Originator", type: "Meccan", totalVerses: 45, startPrintedPage: 346, startPdfPage: 347, para: 22 },
  { id: 36, name: "يس", transliteration: "Ya-Sin", translation: "Ya-Sin", type: "Meccan", totalVerses: 83, startPrintedPage: 351, startPdfPage: 352, para: 22 },
  { id: 37, name: "الصافات", transliteration: "As-Saffat", translation: "Those who set the Ranks", type: "Meccan", totalVerses: 182, startPrintedPage: 356, startPdfPage: 357, para: 23 },
  { id: 38, name: "ص", transliteration: "Sad", translation: "The Letter Sad", type: "Meccan", totalVerses: 88, startPrintedPage: 361, startPdfPage: 362, para: 23 },
  { id: 39, name: "الزمر", transliteration: "Az-Zumar", translation: "The Troops", type: "Meccan", totalVerses: 75, startPrintedPage: 366, startPdfPage: 367, para: 23 },
  { id: 40, name: "غافر", transliteration: "Ghafir", translation: "The Forgiver", type: "Meccan", totalVerses: 85, startPrintedPage: 373, startPdfPage: 374, para: 24 },
  { id: 41, name: "فصلت", transliteration: "Fussilat", translation: "Explained in Detail", type: "Meccan", totalVerses: 54, startPrintedPage: 380, startPdfPage: 381, para: 24 },
  { id: 42, name: "الشورى", transliteration: "Ash-Shura", translation: "The Consultation", type: "Meccan", totalVerses: 53, startPrintedPage: 385, startPdfPage: 386, para: 25 },
  { id: 43, name: "الزخرف", transliteration: "Az-Zukhruf", translation: "The Ornaments of Gold", type: "Meccan", totalVerses: 89, startPrintedPage: 390, startPdfPage: 391, para: 25 },
  { id: 44, name: "الدخان", transliteration: "Ad-Dukhan", translation: "The Smoke", type: "Meccan", totalVerses: 59, startPrintedPage: 396, startPdfPage: 397, para: 25 },
  { id: 45, name: "الجاثية", transliteration: "Al-Jathiyah", translation: "The Crouching", type: "Meccan", totalVerses: 37, startPrintedPage: 398, startPdfPage: 399, para: 25 },
  { id: 46, name: "الأحقاف", transliteration: "Al-Ahqaf", translation: "The Wind-Curved Sandhills", type: "Meccan", totalVerses: 35, startPrintedPage: 401, startPdfPage: 402, para: 26 },
  { id: 47, name: "محمد", transliteration: "Muhammad", translation: "Muhammad", type: "Medinan", totalVerses: 38, startPrintedPage: 404, startPdfPage: 405, para: 26 },
  { id: 48, name: "الفتح", transliteration: "Al-Fath", translation: "The Victory", type: "Medinan", totalVerses: 29, startPrintedPage: 408, startPdfPage: 409, para: 26 },
  { id: 49, name: "الحجرات", transliteration: "Al-Hujurat", translation: "The Rooms", type: "Medinan", totalVerses: 18, startPrintedPage: 411, startPdfPage: 412, para: 26 },
  { id: 50, name: "ق", transliteration: "Qaf", translation: "The Letter Qaf", type: "Meccan", totalVerses: 45, startPrintedPage: 413, startPdfPage: 414, para: 26 },
  { id: 51, name: "الذاريات", transliteration: "Adh-Dhariyat", translation: "The Winnowing Winds", type: "Meccan", totalVerses: 60, startPrintedPage: 415, startPdfPage: 416, para: 26 },
  { id: 52, name: "الطور", transliteration: "At-Tur", translation: "The Mount", type: "Meccan", totalVerses: 49, startPrintedPage: 418, startPdfPage: 419, para: 27 },
  { id: 53, name: "النجم", transliteration: "An-Najm", translation: "The Star", type: "Meccan", totalVerses: 62, startPrintedPage: 420, startPdfPage: 421, para: 27 },
  { id: 54, name: "القمر", transliteration: "Al-Qamar", translation: "The Moon", type: "Meccan", totalVerses: 55, startPrintedPage: 422, startPdfPage: 423, para: 27 },
  { id: 55, name: "الرحمن", transliteration: "Ar-Rahman", translation: "The Beneficent", type: "Medinan", totalVerses: 78, startPrintedPage: 424, startPdfPage: 425, para: 27 },
  { id: 56, name: "الواقعة", transliteration: "Al-Waqi'ah", translation: "The Inevitable", type: "Meccan", totalVerses: 96, startPrintedPage: 427, startPdfPage: 428, para: 27 },
  { id: 57, name: "الحديد", transliteration: "Al-Hadid", translation: "The Iron", type: "Medinan", totalVerses: 29, startPrintedPage: 429, startPdfPage: 430, para: 27 },
  { id: 58, name: "المجادلة", transliteration: "Al-Mujadila", translation: "The Pleading Woman", type: "Medinan", totalVerses: 22, startPrintedPage: 433, startPdfPage: 434, para: 28 },
  { id: 59, name: "الحشر", transliteration: "Al-Hashr", translation: "The Exile", type: "Medinan", totalVerses: 24, startPrintedPage: 435, startPdfPage: 436, para: 28 },
  { id: 60, name: "الممتحنة", transliteration: "Al-Mumtahanah", translation: "She that is to be examined", type: "Medinan", totalVerses: 13, startPrintedPage: 438, startPdfPage: 439, para: 28 },
  { id: 61, name: "الصف", transliteration: "As-Saf", translation: "The Ranks", type: "Medinan", totalVerses: 14, startPrintedPage: 440, startPdfPage: 441, para: 28 },
  { id: 62, name: "الجمعة", transliteration: "Al-Jumu'ah", translation: "The Congregation, Friday", type: "Medinan", totalVerses: 11, startPrintedPage: 441, startPdfPage: 442, para: 28 },
  { id: 63, name: "المنافقون", transliteration: "Al-Munafiqun", translation: "The Hypocrites", type: "Medinan", totalVerses: 11, startPrintedPage: 442, startPdfPage: 443, para: 28 },
  { id: 64, name: "التغابن", transliteration: "At-Taghabun", translation: "The Mutual Disillusion", type: "Medinan", totalVerses: 18, startPrintedPage: 443, startPdfPage: 444, para: 28 },
  { id: 65, name: "الطلاق", transliteration: "At-Talaq", translation: "The Divorce", type: "Medinan", totalVerses: 12, startPrintedPage: 445, startPdfPage: 446, para: 28 },
  { id: 66, name: "التحريم", transliteration: "At-Tahrim", translation: "The Prohibition", type: "Medinan", totalVerses: 12, startPrintedPage: 447, startPdfPage: 448, para: 28 },
  { id: 67, name: "الملك", transliteration: "Al-Mulk", translation: "The Sovereignty", type: "Meccan", totalVerses: 30, startPrintedPage: 449, startPdfPage: 450, para: 29 },
  { id: 68, name: "القلم", transliteration: "Al-Qalam", translation: "The Pen", type: "Meccan", totalVerses: 52, startPrintedPage: 450, startPdfPage: 451, para: 29 },
  { id: 69, name: "الحاقة", transliteration: "Al-Haqqah", translation: "The Reality", type: "Meccan", totalVerses: 52, startPrintedPage: 452, startPdfPage: 453, para: 29 },
  { id: 70, name: "المعارج", transliteration: "Al-Ma'arij", translation: "The Ascending Stairways", type: "Meccan", totalVerses: 44, startPrintedPage: 454, startPdfPage: 455, para: 29 },
  { id: 71, name: "نوح", transliteration: "Nuh", translation: "Noah", type: "Meccan", totalVerses: 28, startPrintedPage: 455, startPdfPage: 456, para: 29 },
  { id: 72, name: "الجن", transliteration: "Al-Jinn", translation: "The Jinn", type: "Meccan", totalVerses: 28, startPrintedPage: 457, startPdfPage: 458, para: 29 },
  { id: 73, name: "المزمل", transliteration: "Al-Muzzammil", translation: "The Enshrouded One", type: "Meccan", totalVerses: 20, startPrintedPage: 458, startPdfPage: 459, para: 29 },
  { id: 74, name: "المدثر", transliteration: "Al-Muddaththir", translation: "The Cloaked One", type: "Meccan", totalVerses: 56, startPrintedPage: 459, startPdfPage: 460, para: 29 },
  { id: 75, name: "القيامة", transliteration: "Al-Qiyamah", translation: "The Resurrection", type: "Meccan", totalVerses: 40, startPrintedPage: 461, startPdfPage: 462, para: 29 },
  { id: 76, name: "الإنسان", transliteration: "Al-Insan", translation: "The Man", type: "Medinan", totalVerses: 31, startPrintedPage: 462, startPdfPage: 463, para: 29 },
  { id: 77, name: "المرسلات", transliteration: "Al-Mursalat", translation: "The Emissaries", type: "Meccan", totalVerses: 50, startPrintedPage: 463, startPdfPage: 464, para: 29 },
  { id: 78, name: "النبأ", transliteration: "An-Naba", translation: "The Tidings", type: "Meccan", totalVerses: 40, startPrintedPage: 465, startPdfPage: 466, para: 30 },
  { id: 79, name: "النازعات", transliteration: "An-Nazi'at", translation: "Those who drag forth", type: "Meccan", totalVerses: 46, startPrintedPage: 466, startPdfPage: 467, para: 30 },
  { id: 80, name: "عبس", transliteration: "'Abasa", translation: "He Frowned", type: "Meccan", totalVerses: 42, startPrintedPage: 467, startPdfPage: 468, para: 30 },
  { id: 81, name: "التكوير", transliteration: "At-Takwir", translation: "The Overthrowing", type: "Meccan", totalVerses: 29, startPrintedPage: 468, startPdfPage: 469, para: 30 },
  { id: 82, name: "الانفطار", transliteration: "Al-Infitar", translation: "The Cleaving", type: "Meccan", totalVerses: 19, startPrintedPage: 469, startPdfPage: 470, para: 30 },
  { id: 83, name: "المطففين", transliteration: "Al-Mutaffifin", translation: "The Defrauding", type: "Meccan", totalVerses: 36, startPrintedPage: 470, startPdfPage: 471, para: 30 },
  { id: 84, name: "الانشقاق", transliteration: "Al-Inshiqaq", translation: "The Sundering", type: "Meccan", totalVerses: 25, startPrintedPage: 471, startPdfPage: 472, para: 30 },
  { id: 85, name: "البروج", transliteration: "Al-Buruj", translation: "The Mansions of the Stars", type: "Meccan", totalVerses: 22, startPrintedPage: 472, startPdfPage: 473, para: 30 },
  { id: 86, name: "الطارق", transliteration: "At-Tariq", translation: "The Nightcomer", type: "Meccan", totalVerses: 17, startPrintedPage: 473, startPdfPage: 474, para: 30 },
  { id: 87, name: "الأعلى", transliteration: "Al-A'la", translation: "The Most High", type: "Meccan", totalVerses: 19, startPrintedPage: 473, startPdfPage: 474, para: 30 },
  { id: 88, name: "الغاشية", transliteration: "Al-Ghashiyah", translation: "The Overwhelming", type: "Meccan", totalVerses: 26, startPrintedPage: 474, startPdfPage: 475, para: 30 },
  { id: 89, name: "الفجر", transliteration: "Al-Fajr", translation: "The Dawn", type: "Meccan", totalVerses: 30, startPrintedPage: 475, startPdfPage: 476, para: 30 },
  { id: 90, name: "البلد", transliteration: "Al-Balad", translation: "The City", type: "Meccan", totalVerses: 20, startPrintedPage: 476, startPdfPage: 477, para: 30 },
  { id: 91, name: "الشمس", transliteration: "Ash-Shams", translation: "The Sun", type: "Meccan", totalVerses: 15, startPrintedPage: 476, startPdfPage: 477, para: 30 },
  { id: 92, name: "الليل", transliteration: "Al-Layl", translation: "The Night", type: "Meccan", totalVerses: 21, startPrintedPage: 477, startPdfPage: 478, para: 30 },
  { id: 93, name: "الضحى", transliteration: "Ad-Duha", translation: "The Morning Hours", type: "Meccan", totalVerses: 11, startPrintedPage: 478, startPdfPage: 479, para: 30 },
  { id: 94, name: "الشرح", transliteration: "Ash-Sharh", translation: "The Relief", type: "Meccan", totalVerses: 8, startPrintedPage: 478, startPdfPage: 479, para: 30 },
  { id: 95, name: "التين", transliteration: "At-Tin", translation: "The Fig", type: "Meccan", totalVerses: 8, startPrintedPage: 478, startPdfPage: 479, para: 30 },
  { id: 96, name: "العلق", transliteration: "Al-'Alaq", translation: "The Clot", type: "Meccan", totalVerses: 19, startPrintedPage: 479, startPdfPage: 480, para: 30 },
  { id: 97, name: "القدر", transliteration: "Al-Qadr", translation: "The Power", type: "Meccan", totalVerses: 5, startPrintedPage: 479, startPdfPage: 480, para: 30 },
  { id: 98, name: "البينة", transliteration: "Al-Bayyinah", translation: "The Clear Proof", type: "Medinan", totalVerses: 8, startPrintedPage: 480, startPdfPage: 481, para: 30 },
  { id: 99, name: "الزلزلة", transliteration: "Az-Zalzalah", translation: "The Earthquake", type: "Medinan", totalVerses: 8, startPrintedPage: 480, startPdfPage: 481, para: 30 },
  { id: 100, name: "العاديات", transliteration: "Al-'Adiyat", translation: "The Courser", type: "Meccan", totalVerses: 11, startPrintedPage: 481, startPdfPage: 482, para: 30 },
  { id: 101, name: "القارعة", transliteration: "Al-Qari'ah", translation: "The Calamity", type: "Meccan", totalVerses: 11, startPrintedPage: 481, startPdfPage: 482, para: 30 },
  { id: 102, name: "التكاثر", transliteration: "At-Takathur", translation: "The Rivalry in World Increase", type: "Meccan", totalVerses: 8, startPrintedPage: 482, startPdfPage: 483, para: 30 },
  { id: 103, name: "العصر", transliteration: "Al-'Asr", translation: "The Declining Day", type: "Meccan", totalVerses: 3, startPrintedPage: 482, startPdfPage: 483, para: 30 },
  { id: 104, name: "الهمزة", transliteration: "Al-Humazah", translation: "The Traducer", type: "Meccan", totalVerses: 9, startPrintedPage: 482, startPdfPage: 483, para: 30 },
  { id: 105, name: "الفيل", transliteration: "Al-Fil", translation: "The Elephant", type: "Meccan", totalVerses: 5, startPrintedPage: 483, startPdfPage: 484, para: 30 },
  { id: 106, name: "قريش", transliteration: "Quraysh", translation: "Quraysh", type: "Meccan", totalVerses: 4, startPrintedPage: 483, startPdfPage: 484, para: 30 },
  { id: 107, name: "الماعون", transliteration: "Al-Ma'un", translation: "The Small Kindnesses", type: "Meccan", totalVerses: 7, startPrintedPage: 483, startPdfPage: 484, para: 30 },
  { id: 108, name: "الكوثر", transliteration: "Al-Kawthar", translation: "The Abundance", type: "Meccan", totalVerses: 3, startPrintedPage: 484, startPdfPage: 485, para: 30 },
  { id: 109, name: "الكافرون", transliteration: "Al-Kafirun", translation: "The Disbelievers", type: "Meccan", totalVerses: 6, startPrintedPage: 484, startPdfPage: 485, para: 30 },
  { id: 110, name: "النصر", transliteration: "An-Nasr", translation: "The Divine Support", type: "Medinan", totalVerses: 3, startPrintedPage: 484, startPdfPage: 485, para: 30 },
  { id: 111, name: "المسد", transliteration: "Al-Masad", translation: "The Palm Fiber", type: "Meccan", totalVerses: 5, startPrintedPage: 484, startPdfPage: 485, para: 30 },
  { id: 112, name: "الإخلاص", transliteration: "Al-Ikhlas", translation: "The Sincerity", type: "Meccan", totalVerses: 4, startPrintedPage: 485, startPdfPage: 486, para: 30 },
  { id: 113, name: "الفلق", transliteration: "Al-Falaq", translation: "The Daybreak", type: "Meccan", totalVerses: 5, startPrintedPage: 485, startPdfPage: 486, para: 30 },
  { id: 114, name: "الناس", transliteration: "An-Nas", translation: "Mankind", type: "Meccan", totalVerses: 6, startPrintedPage: 485, startPdfPage: 486, para: 30 },
];

export const JUZ_LIST: Juz[] = [
  { id: 1, nameArabic: "الم", nameTransliteration: "Alif-Lam-Meem", startPrintedPage: 2, startPdfPage: 3, startSurahId: 1, startVerse: 1 },
  { id: 2, nameArabic: "سَيَقُولُ", nameTransliteration: "Sayaqool", startPrintedPage: 18, startPdfPage: 19, startSurahId: 2, startVerse: 142 },
  { id: 3, nameArabic: "تِلْكَ الرُّسُلُ", nameTransliteration: "Tilka ar-Rusul", startPrintedPage: 34, startPdfPage: 35, startSurahId: 2, startVerse: 253 },
  { id: 4, nameArabic: "لَنْ تَنَالُوا", nameTransliteration: "Lan Tanaaloo", startPrintedPage: 50, startPdfPage: 51, startSurahId: 3, startVerse: 93 },
  { id: 5, nameArabic: "وَالْمُحْصَنَاتُ", nameTransliteration: "Wal Mohsanat", startPrintedPage: 66, startPdfPage: 67, startSurahId: 4, startVerse: 24 },
  { id: 6, nameArabic: "لَا يُحِبُّ اللَّهُ", nameTransliteration: "La Yuhibbullah", startPrintedPage: 82, startPdfPage: 83, startSurahId: 4, startVerse: 148 },
  { id: 7, nameArabic: "وَإِذَا سَمِعُوا", nameTransliteration: "Wa Iza Sami'oo", startPrintedPage: 98, startPdfPage: 99, startSurahId: 5, startVerse: 82 },
  { id: 8, nameArabic: "وَلَوْ أَنَّنَا", nameTransliteration: "Wa Law Annana", startPrintedPage: 114, startPdfPage: 115, startSurahId: 6, startVerse: 111 },
  { id: 9, nameArabic: "قَالَ الْمَلَأُ", nameTransliteration: "Qalal Malao", startPrintedPage: 130, startPdfPage: 131, startSurahId: 7, startVerse: 88 },
  { id: 10, nameArabic: "وَاعْلَمُوا", nameTransliteration: "Wa A'lamoo", startPrintedPage: 146, startPdfPage: 147, startSurahId: 8, startVerse: 41 },
  { id: 11, nameArabic: "يَعْتَذِرُونَ", nameTransliteration: "Ya'taziroona", startPrintedPage: 162, startPdfPage: 163, startSurahId: 9, startVerse: 93 },
  { id: 12, nameArabic: "وَمَا مِنْ دَابَّةٍ", nameTransliteration: "Wa Mamin Da'abat", startPrintedPage: 178, startPdfPage: 179, startSurahId: 11, startVerse: 6 },
  { id: 13, nameArabic: "وَمَا أُبَرِّئُ", nameTransliteration: "Wa Ma Oobari-o", startPrintedPage: 194, startPdfPage: 195, startSurahId: 12, startVerse: 53 },
  { id: 14, nameArabic: "رُبَمَا", nameTransliteration: "Rubama", startPrintedPage: 210, startPdfPage: 211, startSurahId: 15, startVerse: 1 },
  { id: 15, nameArabic: "سُبْحَانَ الَّذِي", nameTransliteration: "Subhanallazi", startPrintedPage: 225, startPdfPage: 226, startSurahId: 17, startVerse: 1 },
  { id: 16, nameArabic: "قَالَ أَلَمْ", nameTransliteration: "Qal Alam", startPrintedPage: 241, startPdfPage: 242, startSurahId: 18, startVerse: 75 },
  { id: 17, nameArabic: "اقْتَرَبَ", nameTransliteration: "Iqtaraba", startPrintedPage: 257, startPdfPage: 258, startSurahId: 21, startVerse: 1 },
  { id: 18, nameArabic: "قَدْ أَفْلَحَ", nameTransliteration: "Qadd Aflaha", startPrintedPage: 273, startPdfPage: 274, startSurahId: 23, startVerse: 1 },
  { id: 19, nameArabic: "وَقَالَ الَّذِينَ", nameTransliteration: "Wa Qalallazina", startPrintedPage: 289, startPdfPage: 290, startSurahId: 25, startVerse: 21 },
  { id: 20, nameArabic: "أَمَّنْ خَلَقَ", nameTransliteration: "A'man Khalaqa", startPrintedPage: 305, startPdfPage: 306, startSurahId: 27, startVerse: 56 },
  { id: 21, nameArabic: "اتْلُ مَا أُوحِيَ", nameTransliteration: "Utlu Ma Oohiya", startPrintedPage: 321, startPdfPage: 322, startSurahId: 29, startVerse: 46 },
  { id: 22, nameArabic: "وَمَنْ يَقْنُتْ", nameTransliteration: "Wa Manyaqnut", startPrintedPage: 337, startPdfPage: 338, startSurahId: 33, startVerse: 31 },
  { id: 23, nameArabic: "وَمَا لِيَ", nameTransliteration: "Wa Maliya", startPrintedPage: 353, startPdfPage: 354, startSurahId: 36, startVerse: 28 },
  { id: 24, nameArabic: "فَمَنْ أَظْلَمُ", nameTransliteration: "Faman Azlamu", startPrintedPage: 369, startPdfPage: 370, startSurahId: 39, startVerse: 32 },
  { id: 25, nameArabic: "إِلَيْهِ يُرَدُّ", nameTransliteration: "Ilayhi Yuraddu", startPrintedPage: 385, startPdfPage: 386, startSurahId: 41, startVerse: 47 },
  { id: 26, nameArabic: "حم", nameTransliteration: "Ha-Meem", startPrintedPage: 401, startPdfPage: 402, startSurahId: 46, startVerse: 1 },
  { id: 27, nameArabic: "قَالَ فَمَا خَطْبُكُمْ", nameTransliteration: "Qala Fama Khatbukum", startPrintedPage: 417, startPdfPage: 418, startSurahId: 51, startVerse: 31 },
  { id: 28, nameArabic: "قَدْ سَمِعَ اللَّهُ", nameTransliteration: "Qadd Sami'Allah", startPrintedPage: 433, startPdfPage: 434, startSurahId: 58, startVerse: 1 },
  { id: 29, nameArabic: "تَبَارَكَ الَّذِي", nameTransliteration: "Tabarakallazi", startPrintedPage: 449, startPdfPage: 450, startSurahId: 67, startVerse: 1 },
  { id: 30, nameArabic: "عَمَّ", nameTransliteration: "'Amma", startPrintedPage: 465, startPdfPage: 466, startSurahId: 78, startVerse: 1 },
];

/**
 * Calculates target PDF page for given Surah and Ayat
 */
export function getPdfPageForAyat(surahId: number, verseNumber: number): number {
  const surahIndex = SURAHS.findIndex(s => s.id === surahId);
  if (surahIndex === -1) return 3;

  const currentSurah = SURAHS[surahIndex];
  const nextSurah = SURAHS[surahIndex + 1];

  const startPdf = currentSurah.startPdfPage;
  const endPdf = nextSurah ? nextSurah.startPdfPage : 486;

  if (startPdf >= endPdf || currentSurah.totalVerses <= 1 || verseNumber <= 1) {
    return startPdf;
  }

  // Linear interpolation within the Surah's page span
  const safeVerse = Math.min(Math.max(1, verseNumber), currentSurah.totalVerses);
  const ratio = (safeVerse - 1) / (currentSurah.totalVerses);
  const pageOffset = Math.floor(ratio * (endPdf - startPdf));

  return Math.min(endPdf - 1, startPdf + pageOffset);
}

/**
 * Given a PDF page, find the active Surah and Para
 */
export function getMetadataForPdfPage(pdfPage: number) {
  // Find surah that started at or before this page
  let activeSurah = SURAHS[0];
  for (const s of SURAHS) {
    if (s.startPdfPage <= pdfPage) {
      activeSurah = s;
    } else {
      break;
    }
  }

  // Find para that started at or before this page
  let activeJuz = JUZ_LIST[0];
  for (const j of JUZ_LIST) {
    if (j.startPdfPage <= pdfPage) {
      activeJuz = j;
    } else {
      break;
    }
  }

  const printedPage = pdfPage > 1 ? pdfPage - 1 : 1;

  return {
    surah: activeSurah,
    juz: activeJuz,
    printedPage,
    pdfPage
  };
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  folder: string;
}

export const RECITERS: Reciter[] = [
  { id: 'alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري العفاسي', folder: 'Alafasy_128kbps' },
  { id: 'abdulbasit', name: 'Abdul Basit (Murattal)', arabicName: 'عبد الباسط عبد الصمد', folder: 'Abdul_Basit_Murattal_192kbps' },
  { id: 'husary', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري', folder: 'Husary_128kbps' },
  { id: 'minshawi', name: 'Mohamed Siddiq Al-Minshawi', arabicName: 'محمد صديق المنشاوي', folder: 'Minshawy_Murattal_128kbps' },
  { id: 'shatri', name: 'Abu Bakr Ash-Shatri', arabicName: 'أبو بكر الشاطري', folder: 'Abu_Bakr_Ash-Shaatree_128kbps' },
];

/**
 * Returns the MP3 audio URL from EveryAyah CDN for a specific Surah and Ayat
 */
export function getAyahAudioUrl(surahId: number, ayahNumber: number, reciterFolder: string = 'Alafasy_128kbps'): string {
  const s = surahId.toString().padStart(3, '0');
  const a = ayahNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciterFolder}/${s}${a}.mp3`;
}

export interface PageVerseSpan {
  surah: Surah;
  startVerse: number;
  endVerse: number;
}

/**
 * Computes the estimated starting and ending Ayat for a given PDF page
 */
export function getVersesForPdfPage(pdfPage: number): PageVerseSpan {
  const meta = getMetadataForPdfPage(pdfPage);
  const surah = meta.surah;
  const surahIndex = SURAHS.findIndex(s => s.id === surah.id);
  const nextSurah = SURAHS[surahIndex + 1];

  const startPdf = surah.startPdfPage;
  const endPdf = nextSurah ? nextSurah.startPdfPage : 486;
  const totalPages = Math.max(1, endPdf - startPdf);

  if (totalPages <= 1) {
    return {
      surah,
      startVerse: 1,
      endVerse: surah.totalVerses
    };
  }

  const pageOffset = Math.max(0, Math.min(totalPages - 1, pdfPage - startPdf));
  const startRatio = pageOffset / totalPages;
  const endRatio = (pageOffset + 1) / totalPages;

  const startVerse = Math.max(1, Math.min(surah.totalVerses, Math.floor(startRatio * surah.totalVerses) + 1));
  const endVerse = Math.max(startVerse, Math.min(surah.totalVerses, Math.ceil(endRatio * surah.totalVerses)));

  return {
    surah,
    startVerse,
    endVerse
  };
}
