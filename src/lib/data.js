import collegesRaw from '../data/colleges.json'
import categoriesRaw from '../data/categories.json'
import kurdistanRaw from '../data/kurdistan_colleges.json'

// Display-order overrides on top of the raw sortOrder from Firestore.
// The first 5 categories stay put; oil_gas is promoted to just after them
// (was #13, an important sector for Iraq/Kurdistan students).
const CATEGORY_ORDER_OVERRIDE = {
  oil_gas: 5.5,
}

// Normalize categories into an array, sorted by (overridden) sortOrder
export const categories = Object.entries(categoriesRaw)
  .map(([id, c]) => ({ id, ...c }))
  .sort((a, b) => {
    const orderA = CATEGORY_ORDER_OVERRIDE[a.categoryKey] ?? a.sortOrder
    const orderB = CATEGORY_ORDER_OVERRIDE[b.categoryKey] ?? b.sortOrder
    return orderA - orderB
  })

const categoryById = Object.fromEntries(categories.map((c) => [c.id, c]))
const categoryByKey = Object.fromEntries(categories.map((c) => [c.categoryKey, c]))

// ---------------------------------------------------------------------------
// Iraq colleges
// ---------------------------------------------------------------------------

// Colleges of (human) Medicine / Dentistry / Pharmacy — the only colleges
// eligible for the +5 martyr-family bonus tier (every other college gets +7
// instead; the two never stack). Matched by substring against the Iraq
// college's full name, since Iraqi medical colleges use several branded
// names (كلية طب الكندي, كلية طب حمورابي, كلية طب البتول, كلية طب الزهراء...)
// as well as the plain "كلية الطب" form.
const MEDICAL_BONUS_KEYWORDS = ['طب الاسنان', 'طب االسنان', 'كلية الصيدلة']
function isMedicalBonusCollege(name) {
  if (!name) return false
  if (name.includes('بيطري')) return false // veterinary doesn't count
  if (MEDICAL_BONUS_KEYWORDS.some((kw) => name.includes(kw))) return true
  // "كلية طب ..." or "كلية الطب" — any college whose college-level name is a
  // form of "College of Medicine", but not e.g. "المعهد الطبي" (technical
  // institute) or "تقنيات طبية" (medical technology), which aren't full
  // human-medicine degree colleges.
  return /كلية\s+(ال)?طب(\s|\/|$)/.test(name)
}

// Normalize Iraq colleges into an array with resolved categoryId
export const collegesIraq = Object.entries(collegesRaw).map(([id, c]) => {
  const categoryId = c.categoryRef?.__ref__?.split('/')?.[1] ?? null
  return {
    id: `iq_${id}`,
    region: 'iraq',
    name: c.name,
    branch: c.branch, // 'علمي' | 'ادبي' | 'فنون'
    gender: c.gender, // 'مختلط' | 'ذكر' | 'انثى'
    shift: c.shift, // 'بەیانی' (day) | 'ئێواران' (evening)
    city: c.city && c.city.trim() ? c.city : null, // null = unspecified
    scoreTotal: c.scoreTotal,
    scorePercent: c.scorePercent,
    categoryId,
    category: categoryId ? categoryById[categoryId] : null,
    isMedicalBonus: isMedicalBonusCollege(c.name),
  }
})

// ---------------------------------------------------------------------------
// Kurdistan colleges
// ---------------------------------------------------------------------------

// Branch, medical-bonus tagging (isMedicalBonus), and score columns
// (زانکۆلاین گشتی / پارالێل گشتی only — the state-wide sub-columns) are
// pre-resolved by the data-prep script that reads the source PDF (see
// /tmp/work/kurdistan_data/rebuild.py). isMedicalBonus is a hand-confirmed
// list of the 12 real medicine/dentistry/pharmacy rows across 6 universities
// (not keyword-guessed), since Kurdish "پزیشکی" appears in many
// non-qualifying department names (veterinary, nursing, medical lab tech,
// polytechnic pharmacy, etc.). Rows whose زانکۆلاین گشتی printed as 0 (not
// open to students from outside their region) were dropped upstream.
export const collegesKurdistan = kurdistanRaw.map((c, i) => {
  const categoryId = c.categoryKey ? categoryByKey[c.categoryKey]?.id ?? null : null
  return {
    id: `krd_${i}`,
    region: 'kurdistan',
    name: `${c.university} / ${c.dept}`,
    dept: c.dept,
    university: c.university,
    branch: c.branch, // already normalized to 'علمي' | 'ادبي' by rebuild.py
    gender: 'مختلط', // no gender split in the Kurdistan dataset
    shift: 'بەیانی', // this dataset only covers day-shift admissions
    city: c.region,
    scoreNormal: c.scoreNormal,
    scoreParallel: c.scoreParallel,
    // "required" score shown/used for eligibility = the lower (easier) of the two, since
    // parallel is a paid seat with a lower cutoff; a student clears the college if they
    // beat either track.
    scorePercent:
      c.scoreNormal != null && c.scoreParallel != null
        ? Math.min(c.scoreNormal, c.scoreParallel)
        : c.scoreNormal ?? c.scoreParallel ?? null,
    categoryId,
    category: categoryId ? categoryById[categoryId] : null,
    isMedicalBonus: c.isMedicalBonus === true,
  }
})

export const colleges = [...collegesIraq, ...collegesKurdistan]

// ---------------------------------------------------------------------------
// Cities / regions
// ---------------------------------------------------------------------------

// City display priority: Kirkuk first (the app's home city), then the other
// major cities, then everything else alphabetically.
const CITY_PRIORITY = ['کەرکووک', 'بەغدا', 'تکریت', 'هەولێر', 'سلێمانی', 'دهۆک', 'بەسرە', 'موسڵ']

function cityRank(city) {
  const idx = CITY_PRIORITY.indexOf(city)
  return idx === -1 ? CITY_PRIORITY.length : idx
}

export function sortCities(cityList) {
  return [...cityList].sort((a, b) => {
    const ra = cityRank(a)
    const rb = cityRank(b)
    if (ra !== rb) return ra - rb
    return a.localeCompare(b, 'ar')
  })
}

export const cities = sortCities(Array.from(new Set(collegesIraq.map((c) => c.city).filter(Boolean))))

export const branches = [
  { value: 'علمي', label: 'زانستی' },
  { value: 'ادبي', label: 'ئەدەبی' },
  { value: 'فنون', label: 'هونەری' },
]

export const genders = [
  { value: 'ذكر', label: 'نێر' },
  { value: 'انثى', label: 'مێ' },
]

// ---------------------------------------------------------------------------
// Martyr / family-loss bonus
// ---------------------------------------------------------------------------

// A family member's martyrdom grants an admission-score bonus, applied only
// to day-shift ('بەیانی') Iraq colleges — Kurdistan colleges never receive
// this bonus, regardless of the martyr's own region. The two tiers never
// stack — a college gets one or the other:
//   - Medicine / Dentistry / Pharmacy colleges: +5, but ONLY if the student's own
//     entered score is >= 90 (otherwise no bonus on these specific colleges).
//   - Every other college: +7, regardless of the student's score.
export const MARTYR_BONUS_BASE = 7
export const MARTYR_BONUS_MEDICAL_EXTRA = 5
export const MARTYR_BONUS_MEDICAL_THRESHOLD = 90

export function martyrBonusFor(college, student) {
  if (!student.hasMartyr) return 0
  if (college.region !== 'iraq') return 0
  if (college.shift !== 'بەیانی') return 0
  // Medicine / dentistry / pharmacy get +5 (only when the student's own score is >= 90).
  // Every other college gets +7. The two never stack.
  if (college.isMedicalBonus) {
    return student.scorePercent >= MARTYR_BONUS_MEDICAL_THRESHOLD ? MARTYR_BONUS_MEDICAL_EXTRA : 0
  }
  return MARTYR_BONUS_BASE
}

/**
 * Does this student (score, branch, gender) qualify for this college, given
 * any martyr bonus that applies to it?
 */
export function isEligible(college, student) {
  if (college.branch !== student.branch) return false
  if (college.gender !== 'مختلط' && college.gender !== student.gender) return false
  const bonus = martyrBonusFor(college, student)
  return student.scorePercent + bonus >= college.scorePercent
}

/**
 * Given student inputs, return colleges (for one region) filtered to their
 * branch+gender (the universe of "relevant" colleges), each tagged with
 * `accepted` and the bonus (if any) that applied.
 */
export function matchColleges(student, region) {
  const pool = region === 'kurdistan' ? collegesKurdistan : collegesIraq
  return pool
    .filter((c) => c.branch === student.branch && (c.gender === 'مختلط' || c.gender === student.gender))
    .map((c) => {
      const bonus = martyrBonusFor(c, student)
      return { ...c, bonus, accepted: student.scorePercent + bonus >= c.scorePercent }
    })
}

/**
 * Group matched colleges by category, with accept/reject counts.
 */
export function groupByCategory(matched) {
  const byCategory = new Map()
  for (const c of matched) {
    if (!c.categoryId) continue
    if (!byCategory.has(c.categoryId)) {
      byCategory.set(c.categoryId, { category: c.category, accepted: [], rejected: [] })
    }
    const bucket = byCategory.get(c.categoryId)
    ;(c.accepted ? bucket.accepted : bucket.rejected).push(c)
  }
  // sort categories by sortOrder, only include ones with at least 1 relevant college
  return categories
    .filter((cat) => byCategory.has(cat.id))
    .map((cat) => byCategory.get(cat.id))
}

/**
 * Group a category's colleges by city, with accept/reject counts per city.
 */
export function groupByCity(categoryBucket) {
  const all = [...categoryBucket.accepted, ...categoryBucket.rejected]
  const byCity = new Map()
  for (const c of all) {
    const key = c.city ?? '__unspecified__'
    if (!byCity.has(key)) byCity.set(key, { city: c.city, accepted: [], rejected: [] })
    const bucket = byCity.get(key)
    ;(c.accepted ? bucket.accepted : bucket.rejected).push(c)
  }
  return Array.from(byCity.values()).sort((a, b) => {
    if (!a.city) return 1
    if (!b.city) return -1
    const ra = cityRank(a.city)
    const rb = cityRank(b.city)
    if (ra !== rb) return ra - rb
    return a.city.localeCompare(b.city, 'ar')
  })
}
