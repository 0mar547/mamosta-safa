import leo from '../assets/category_people/leo.png'
import ross from '../assets/category_people/ross.png'
import both from '../assets/category_people/both.png'

// Which mascot image (if any) shows in the gap between the college-count
// chip and the icon/name block on each category card. Assigned per Omar's
// instructions, category by category.
const PERSON_BY_CATEGORY = {
  healthcare: leo,
  engineering: both,
  education: both,
  business: ross,
  science: leo,
  arts_humanities: ross,
  law_political: ross,
  it_computer: ross,
  agriculture: ross,
  design_arts: leo,
  archaeology_tourism: leo,
  media: leo,
  oil_gas: ross,
  environment_energy: ross,
  islamic_studies: both,
  generic_technical_institute: ross,
}

export default function CategoryPerson({ categoryKey, size = 44 }) {
  const src = PERSON_BY_CATEGORY[categoryKey]
  if (!src) return null

  return (
    <img
      src={src}
      alt=""
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        flexShrink: 0,
        background: 'transparent',
      }}
    />
  )
}
