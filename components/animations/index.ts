// Animation components barrel export

// Scroll-based visual effects
export {
  FloatingShapes,
  ParticleField,
  GradientOrbs,
  CursorGlow,
  AnimatedCounter,
  GradientTextReveal,
  AnimatedDivider,
} from "./ScrollEffects";

// Core animation utilities
export { ScrollProgress, CircularScrollProgress } from "./ScrollProgress";
export { FadeInSection, StaggerContainer, StaggerItem } from "./FadeInSection";
export {
  ParallaxLayer,
  ParallaxContainer,
  ParallaxImage,
  BlurredParallaxSection,
} from "./ParallaxLayer";
export {
  MagneticElement,
  FloatingParticles,
  TextReveal,
  GlowingBorder,
  Typewriter,
  RippleEffect,
} from "./MotionEffects";

// Legacy exports (kept for backwards compatibility, but deprecated)
// These character-based animations are no longer used in the main site
// export { GrowingBoy } from "./GrowingBoy";
// export { LifeStageCharacter } from "./LifeStageCharacter";
// export { ScrollingCharacter } from "./ScrollingCharacter";
// export { RealisticCharacter } from "./RealisticCharacter";
// export { AbstractHero } from "./AbstractHero";
