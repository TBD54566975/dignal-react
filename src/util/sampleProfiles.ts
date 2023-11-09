import Bat from '@assets/sample-pictures/bat.png';
import Cow from '@assets/sample-pictures/cow.png';
import Dolphin from '@assets/sample-pictures/dolphin.png';
import Elephant from '@assets/sample-pictures/elephant.png';
import Fox from '@assets/sample-pictures/fox.png';
import { ProfileListContextItem } from './profile';

const sampleDisplayProfiles: Pick<
  ProfileListContextItem,
  'name' | 'icon' | 'iconAlt'
>[] = [
  {
    name: 'Bella Bat',
    icon: Bat,
    iconAlt: 'A purple bat with extended wings in watercolor',
  },
  {
    name: 'Cory Cow',
    icon: Cow,
    iconAlt: 'A closeup of a smiling white and brown cow in watercolor',
  },
  {
    name: 'Daisy Dolphin',
    icon: Dolphin,
    iconAlt:
      'A shot of a smiling blue dolphin from the neck up with fins extended in watercolor',
  },
  {
    name: 'Eli Elephant',
    icon: Elephant,
    iconAlt: 'A closeup of a grey elephant with white tusks in watercolor',
  },
  {
    name: 'Fiona Fox',
    icon: Fox,
    iconAlt:
      'A brown and red fox with white tips on their face and ears in watercolor',
  },
];

const randomIndex = Math.floor(Math.random() * sampleDisplayProfiles.length);

export const sampleProfile = sampleDisplayProfiles[randomIndex];
