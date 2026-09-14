import * as LottieModule from 'lottie-react'

const Lottie = LottieModule.default?.default ?? LottieModule.default ?? LottieModule

import doctor from '../assets/category_icons/doctor.json'
import engineer from '../assets/category_icons/engineer.json'
import gradHat from '../assets/category_icons/grad_hat.json'
import microscope from '../assets/category_icons/microscope.json'
import readingBook from '../assets/category_icons/reading_book.json'
import lawForce from '../assets/category_icons/law_force.json'
import oncoding from '../assets/category_icons/oncoding.json'
import harvest from '../assets/category_icons/harvest.json'
import artist from '../assets/category_icons/artist.json'
import loading from '../assets/category_icons/loading.json'
import podcast from '../assets/category_icons/podcast.json'
import oilDrilling from '../assets/category_icons/oil_drilling.json'
import planetOrbit from '../assets/category_icons/planet_orbit.json'
import quranGirl from '../assets/category_icons/quran_girl.json'
import gears from '../assets/category_icons/gears.json'
import businessVideo from '../assets/category_icons/business.mp4'

// Maps each category's categoryKey (from categories.json) to its Lottie
// animation, replacing the old emoji-per-icon-name lookup in CategoryCard.
// "business" has no lottie yet — Omar supplied a video instead.
const LOTTIE_BY_CATEGORY = {
  healthcare: doctor,
  engineering: engineer,
  education: gradHat,
  science: microscope,
  arts_humanities: readingBook,
  law_political: lawForce,
  it_computer: oncoding,
  agriculture: harvest,
  design_arts: artist,
  archaeology_tourism: loading,
  media: podcast,
  oil_gas: oilDrilling,
  environment_energy: planetOrbit,
  islamic_studies: quranGirl,
  generic_technical_institute: gears,
}

const VIDEO_BY_CATEGORY = {
  business: businessVideo,
}

export default function CategoryIcon({ categoryKey, size = 44 }) {
  const video = VIDEO_BY_CATEGORY[categoryKey]
  const animationData = LOTTIE_BY_CATEGORY[categoryKey]

  if (video) {
    return (
      <video
        src={video}
        autoPlay
        loop
        muted
        playsInline
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    )
  }

  if (animationData) {
    return (
      <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{ width: '100%', height: '100%' }}
      />
    )
  }

  // Fallback while any category is missing its animation — should not
  // normally be visible once every category has an asset assigned.
  return null
}
