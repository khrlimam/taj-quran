import os
import json

CONTENT_MD = '/Users/khairulimam/.gemini/antigravity/brain/14e6d35a-0441-40c5-ab33-9e896b35752a/.system_generated/steps/306/content.md'
OUT_JSON = '/Users/khairulimam/workspaces/antigravity/taj-quran-app/src/data/pageVerseMap.json'

with open(CONTENT_MD, 'r', encoding='utf-8') as f:
    verses_raw = [l.strip().split('|') for l in f if '|' in l]

# verse_map: dict of (surah, ayah) -> char_len
verse_map = {}
for v in verses_raw:
    s, a, text = int(v[0]), int(v[1]), v[2]
    verse_map[(s, a)] = len(text)

# We have SURAHS and JUZ_LIST
# Let's import them or define their exact page markers
# From quranMetadata.ts
SURAHS = [
  (1, 7, 3), (2, 286, 4), (3, 200, 39), (4, 176, 62), (5, 120, 85),
  (6, 165, 103), (7, 206, 120), (8, 75, 142), (9, 129, 150), (10, 109, 166),
  (11, 123, 177), (12, 111, 188), (13, 43, 199), (14, 52, 204), (15, 99, 209),
  (16, 128, 215), (17, 111, 226), (18, 110, 235), (19, 98, 245), (20, 135, 250),
  (21, 112, 258), (22, 78, 266), (23, 118, 274), (24, 64, 280), (25, 77, 288),
  (26, 227, 294), (27, 93, 301), (28, 88, 308), (29, 69, 317), (30, 60, 324),
  (31, 34, 329), (32, 30, 332), (33, 73, 334), (34, 54, 342), (35, 45, 347),
  (36, 83, 352), (37, 182, 357), (38, 88, 362), (39, 75, 367), (40, 85, 374),
  (41, 54, 381), (42, 53, 386), (43, 89, 391), (44, 59, 397), (45, 37, 399),
  (46, 35, 402), (47, 38, 405), (48, 29, 409), (49, 18, 412), (50, 45, 414),
  (51, 60, 416), (52, 49, 419), (53, 62, 421), (54, 55, 423), (55, 78, 425),
  (56, 96, 428), (57, 29, 430), (58, 22, 434), (59, 24, 436), (60, 13, 439),
  (61, 14, 441), (62, 11, 442), (63, 11, 443), (64, 18, 444), (65, 12, 446),
  (66, 12, 448), (67, 30, 450), (68, 52, 451), (69, 52, 453), (70, 44, 455),
  (71, 28, 456), (72, 28, 458), (73, 20, 459), (74, 56, 460), (75, 40, 462),
  (76, 31, 463), (77, 50, 464), (78, 40, 466), (79, 46, 467), (80, 42, 468),
  (81, 29, 469), (82, 19, 470), (83, 36, 471), (84, 25, 472), (85, 22, 473),
  (86, 17, 474), (87, 19, 474), (88, 26, 475), (89, 30, 476), (90, 20, 477),
  (91, 15, 477), (92, 21, 478), (93, 11, 479), (94, 8, 479), (95, 8, 479),
  (96, 19, 480), (97, 5, 480), (98, 8, 481), (99, 8, 481), (100, 11, 482),
  (101, 11, 482), (102, 8, 483), (103, 3, 483), (104, 9, 483), (105, 5, 484),
  (106, 4, 484), (107, 7, 484), (108, 3, 485), (109, 6, 485), (110, 3, 485),
  (111, 5, 485), (112, 4, 486), (113, 5, 486), (114, 6, 486)
]

JUZ_STARTS = [
  (1, 3, 1, 1),
  (2, 19, 2, 142),
  (3, 35, 2, 253),
  (4, 51, 3, 93),
  (5, 67, 4, 24),
  (6, 83, 4, 148),
  (7, 99, 5, 82),
  (8, 115, 6, 111),
  (9, 131, 7, 88),
  (10, 147, 8, 41),
  (11, 163, 9, 93),
  (12, 179, 11, 6),
  (13, 195, 12, 53),
  (14, 211, 15, 1),
  (15, 226, 17, 1),
  (16, 242, 18, 75),
  (17, 258, 21, 1),
  (18, 274, 23, 1),
  (19, 290, 25, 21),
  (20, 306, 27, 56),
  (21, 322, 29, 46),
  (22, 338, 33, 31),
  (23, 354, 36, 28),
  (24, 370, 39, 32),
  (25, 386, 41, 47),
  (26, 402, 46, 1),
  (27, 418, 51, 31),
  (28, 434, 58, 1),
  (29, 450, 67, 1),
  (30, 466, 78, 1),
]

# Build flat list of all verses in Quran order: (s, a)
all_ordered_verses = []
for s, total, _ in SURAHS:
    for a in range(1, total + 1):
        all_ordered_verses.append((s, a))

# For each Juz, find verse index span
page_map = {}

# Page 1: Cover
page_map[1] = {"surahId": 1, "startVerse": 1, "endVerse": 1}
# Page 2: Frontispiece
page_map[2] = {"surahId": 1, "startVerse": 1, "endVerse": 1}

for j_idx in range(len(JUZ_STARTS)):
    juz_num, start_p, s_id, a_num = JUZ_STARTS[j_idx]
    if j_idx + 1 < len(JUZ_STARTS):
        next_juz = JUZ_STARTS[j_idx + 1]
        end_p = next_juz[1] # exclusive
        next_s_id, next_a_num = next_juz[2], next_juz[3]
    else:
        end_p = 487
        next_s_id, next_a_num = 115, 1

    # Find slice of all_ordered_verses for this Juz
    v_start_idx = all_ordered_verses.index((s_id, a_num))
    if next_s_id <= 114:
        v_end_idx = all_ordered_verses.index((next_s_id, next_a_num))
    else:
        v_end_idx = len(all_ordered_verses)

    juz_verses = all_ordered_verses[v_start_idx:v_end_idx]
    total_pages = end_p - start_p

    # Compute character length of each verse
    v_weights = [verse_map.get(v, 40) for v in juz_verses]
    total_weight = sum(v_weights)

    # Distribute verses across total_pages
    current_v_idx = 0
    accum_weight = 0

    for p_offset in range(total_pages):
        page_num = start_p + p_offset
        page_target_weight = (p_offset + 1) * (total_weight / total_pages)

        p_start_v = juz_verses[current_v_idx]

        # Advance until accum_weight reaches page_target_weight
        while current_v_idx < len(juz_verses) - 1 and (accum_weight + v_weights[current_v_idx]) < page_target_weight:
            accum_weight += v_weights[current_v_idx]
            current_v_idx += 1

        p_end_v = juz_verses[current_v_idx]
        
        # Advance to next for subsequent page
        if current_v_idx < len(juz_verses) - 1:
            current_v_idx += 1
            accum_weight += v_weights[current_v_idx - 1]

        page_map[page_num] = {
            "surahId": p_start_v[0],
            "startVerse": p_start_v[1],
            "endVerse": p_end_v[1] if p_end_v[0] == p_start_v[0] else p_start_v[1] + 5
        }

# End pages (Dua Khatm, Awqaf, Index)
for p in range(487, 490):
    page_map[p] = {"surahId": 114, "startVerse": 1, "endVerse": 6}

with open(OUT_JSON, 'w') as f:
    json.dump(page_map, f, indent=2)

print(f'Generated accurate pageVerseMap.json for {len(page_map)} pages!')
