import { IPublicProfile } from '@/util/types';
import Bat from '@assets/sample-pictures/bat.png';
import Cow from '@assets/sample-pictures/cow.png';
import Dolphin from '@assets/sample-pictures/dolphin.png';
import Elephant from '@assets/sample-pictures/elephant.png';
import Fox from '@assets/sample-pictures/fox.png';

const sampleDisplayProfiles: IPublicProfile[] = [
  {
    name: 'Bella Bat',
    icon: Bat,
    icon_alt: 'A purple bat with extended wings in watercolor',
  },
  {
    name: 'Cory Cow',
    icon: Cow,
    icon_alt: 'A closeup of a smiling white and brown cow in watercolor',
  },
  {
    name: 'Daisy Dolphin',
    icon: Dolphin,
    icon_alt:
      'A shot of a smiling blue dolphin from the neck up with fins extended in watercolor',
  },
  {
    name: 'Eli Elephant',
    icon: Elephant,
    icon_alt: 'A closeup of a grey elephant with white tusks in watercolor',
  },
  {
    name: 'Fiona Fox',
    icon: Fox,
    icon_alt:
      'A brown and red fox with white tips on their face and ears in watercolor',
  },
];

const randomIndex = Math.floor(Math.random() * sampleDisplayProfiles.length);

export const sampleProfile = sampleDisplayProfiles[randomIndex];
