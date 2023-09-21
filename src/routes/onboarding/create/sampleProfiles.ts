import Bat from '@assets/sample-pictures/bat.png';
import Cow from '@assets/sample-pictures/cow.png';
import Dolphin from '@assets/sample-pictures/dolphin.png';
import Elephant from '@assets/sample-pictures/elephant.png';
import Fox from '@assets/sample-pictures/fox.png';

const sampleDisplayProfiles = [
  {
    name: 'Bella Bat',
    picture: await (await fetch(Bat)).blob(),
  },
  {
    name: 'Cory Cow',
    picture: await (await fetch(Cow)).blob(),
  },
  {
    name: 'Daisy Dolphin',
    picture: await (await fetch(Dolphin)).blob(),
  },
  {
    name: 'Eli Elephant',
    picture: await (await fetch(Elephant)).blob(),
  },
  {
    name: 'Fiona Fox',
    picture: await (await fetch(Fox)).blob(),
  },
];

const randomIndex = Math.floor(Math.random() * sampleDisplayProfiles.length);

export const sampleProfile = sampleDisplayProfiles[randomIndex];
