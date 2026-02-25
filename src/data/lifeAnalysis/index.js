import { Briefcase, Heart, Shield, MessageCircle, TrendingUp, Activity } from 'lucide-react';
import careerProfiles from './careerProfiles';
import relationshipProfiles from './relationshipProfiles';
import stressProfiles from './stressProfiles';
import communicationProfiles from './communicationProfiles';
import growthProfiles from './growthProfiles';
import wellnessProfiles from './wellnessProfiles';

/**
 * Classify a Big Five score into a level bucket.
 * L = 0-35, M = 36-65, H = 66-100
 */
function level(score) {
  if (score <= 35) return 'L';
  if (score <= 65) return 'M';
  return 'H';
}

/** Build a profile lookup key from the given trait order. */
function profileKey(scores, traits) {
  return traits.map((t) => level(scores[t])).join('-');
}

const lifeAnalysis = [
  {
    key: 'careers',
    label: 'Career & Work',
    icon: Briefcase,
    getAnalysis(scores) {
      return careerProfiles[profileKey(scores, ['O', 'E', 'C'])];
    },
  },
  {
    key: 'relationships',
    label: 'Relationships',
    icon: Heart,
    getAnalysis(scores) {
      return relationshipProfiles[profileKey(scores, ['A', 'E', 'N'])];
    },
  },
  {
    key: 'stress',
    label: 'Stress & Coping',
    icon: Shield,
    getAnalysis(scores) {
      return stressProfiles[profileKey(scores, ['N', 'C', 'E'])];
    },
  },
  {
    key: 'communication',
    label: 'Communication',
    icon: MessageCircle,
    getAnalysis(scores) {
      return communicationProfiles[profileKey(scores, ['E', 'A', 'O'])];
    },
  },
  {
    key: 'growth',
    label: 'Personal Growth',
    icon: TrendingUp,
    getAnalysis(scores) {
      // Find the trait whose score is furthest from 50
      const traits = ['O', 'C', 'E', 'A', 'N'];
      let maxDist = 0;
      let extremeTrait = null;
      for (const t of traits) {
        const dist = Math.abs((scores[t] ?? 50) - 50);
        if (dist > maxDist) {
          maxDist = dist;
          extremeTrait = t;
        }
      }
      // If no trait is notably extreme, use the balanced fallback
      if (maxDist <= 15) {
        return growthProfiles['balanced'];
      }
      const lv = level(scores[extremeTrait]);
      return growthProfiles[`${extremeTrait}-${lv}`];
    },
  },
  {
    key: 'wellness',
    label: 'Health & Wellness',
    icon: Activity,
    getAnalysis(scores) {
      return wellnessProfiles[profileKey(scores, ['C', 'E', 'N'])];
    },
  },
];

export default lifeAnalysis;
