import { Creature } from '../types/GameTypes';

export const creatures: Creature[] = [
  {
    id: 'owl',
    name: 'Owl',
    level: 1,
    position: { x: 400, y: 300 },
    detectionRadius: 250, // Increased from 120
    soundFile: 'owl.mp3',
    color: '139, 69, 19', // Brown
    icon: '🦉',
    facts: [
      "Owls can rotate their heads up to 270 degrees to look around.",
      "An owl's hearing is so precise they can locate prey in complete darkness.",
      "Owl feathers have special fringes that make their flight completely silent.",
      "The barn owl's heart-shaped face acts like a satellite dish to focus sound.",
      "Some owls have asymmetrical ear openings to pinpoint sound direction.",
      "Great horned owls are one of the most widespread owl species in the Americas.",
      "Owls swallow prey whole and regurgitate indigestible parts as pellets.",
      "A group of owls is called a parliament, wisdom, or study.",
      "Owls have three eyelids: one for blinking, one for sleeping, and one for cleaning.",
      "The smallest owl is the elf owl, weighing only about 1.5 ounces.",
      "Snowy owls migrate from the Arctic and can be active during the day.",
      "Ancient Greeks considered owls symbols of wisdom and knowledge.",
      "Owls cannot move their eyes in their sockets - they must turn their whole head.",
      "The great gray owl has the largest facial disc of any raptor.",
      "Burrowing owls nest underground and can run as fast as they can fly.",
      "Screech owls come in red and gray color phases regardless of their parents' colors.",
      "Long-eared owls can compress their feathers to appear thin when threatened.",
      "Owls have specialized flight feathers with soft fringes to reduce turbulence.",
      "The eagle owl is one of the largest owl species with a wingspan over 6 feet.",
      "Owls play important ecological roles by controlling rodent populations."
    ]
  },
  {
    id: 'fox',
    name: 'Fox',
    level: 2,
    position: { x: 600, y: 200 },
    detectionRadius: 220, // Increased from 100
    soundFile: 'fox.mp3',
    color: '255, 69, 0', // Orange-red
    icon: '🦊',
    facts: [
      "Foxes can hear low-frequency sounds and rodents digging underground.",
      "Red foxes can run up to 30 mph and jump over 6-foot fences.",
      "Foxes use their tails for balance, warmth, and communication.",
      "A fox's den is called an earth, and they often have multiple entrance holes.",
      "Foxes are excellent climbers and can climb trees with slanted trunks.",
      "The Arctic fox changes coat color from brown in summer to white in winter.",
      "Foxes have whiskers on their legs as well as their faces to help them navigate.",
      "Baby foxes are called kits, pups, or cubs depending on the region.",
      "Foxes are omnivores and eat fruits, vegetables, fish, frogs, and even worms.",
      "The fennec fox has the largest ears relative to body size of any canid.",
      "Foxes communicate through at least 40 different sounds including barks and screams.",
      "Red foxes wrap their bushy tails around themselves for warmth while sleeping.",
      "Foxes have a 'magnetic sense' that helps them hunt by detecting Earth's magnetic field.",
      "The gray fox is the only canid that can retract its claws like a cat.",
      "Foxes mate for life and the male helps raise the young.",
      "A fox's pupils are vertical slits in bright light, similar to cats.",
      "Foxes can live 10-12 years in the wild but up to 20 years in captivity.",
      "The bat-eared fox uses its enormous ears to locate insects in the ground.",
      "Foxes play an important role in folklore and mythology across many cultures.",
      "Urban foxes have adapted to city life and often become more nocturnal."
    ]
  },
  {
    id: 'deer',
    name: 'Deer',
    level: 3,
    position: { x: 200, y: 450 },
    detectionRadius: 200, // Increased from 80
    soundFile: 'deer.mp3',
    color: '160, 82, 45', // Saddle brown
    icon: '🦌',
    facts: [
      "Deer can run up to 40 mph and jump 8 feet high or 30 feet in length.",
      "Only male deer typically grow antlers, which they shed and regrow each year.",
      "Deer have a four-chambered stomach and chew cud like cows.",
      "White-tailed deer can live 10-20 years in the wild.",
      "Deer have excellent hearing and can rotate their ears independently.",
      "A deer's eyes are positioned on the sides of their head for nearly 360-degree vision.",
      "Fawns are born with spots that help camouflage them from predators.",
      "Deer are excellent swimmers and can cross rivers and lakes.",
      "Antlers are the fastest-growing bone tissue in the animal kingdom.",
      "Deer communicate through scent, body language, and various vocalizations.",
      "The largest deer species is the moose, which can weigh up to 1,500 pounds.",
      "Deer have a special gland that produces scent for marking territory.",
      "Female deer are called does, males are bucks, and babies are fawns.",
      "Deer can see into the ultraviolet spectrum, making them very alert to movement.",
      "Mule deer get their name from their large, mule-like ears.",
      "Deer sleep very lightly and rarely enter deep sleep phases.",
      "The Chinese water deer is one of the few deer species without antlers.",
      "Deer play important ecological roles in seed dispersal and forest regeneration.",
      "Reindeer are the only deer species where both males and females grow antlers.",
      "Deer have been important to human cultures for thousands of years."
    ]
  },
  {
    id: 'squirrel',
    name: 'Squirrel',
    level: 4,
    position: { x: 150, y: 150 },
    detectionRadius: 180, // Increased from 60
    soundFile: 'squirrel.mp3',
    color: '139, 69, 19', // Brown
    icon: '🐿️',
    facts: [
      "Squirrels can rotate their hind feet 180 degrees to help them climb down trees headfirst.",
      "A squirrel's front teeth never stop growing throughout their entire life.",
      "Squirrels pretend to bury nuts to throw off potential thieves watching them.",
      "Flying squirrels don't actually fly - they glide using a membrane between their legs.",
      "Squirrels can remember thousands of hiding spots where they've buried food.",
      "Baby squirrels are called pups, kits, or kittens and are born blind and hairless.",
      "Red squirrels can live up to 8 years, while gray squirrels live 12-20 years.",
      "Squirrels are incredible jumpers and can leap 10 times their body length.",
      "A squirrel's tail acts as a parachute, blanket, and communication tool.",
      "Ground squirrels hibernate, but tree squirrels remain active all winter.",
      "Squirrels are mostly herbivorous but will occasionally eat bird eggs and insects.",
      "The largest squirrel species is the Indian giant squirrel, reaching 3 feet long.",
      "Squirrels communicate through chirps, tail movements, and scent marking.",
      "Gray squirrels were introduced to the UK and are now considered an invasive species.",
      "Squirrels have excellent color vision and can see in the ultraviolet spectrum.",
      "A group of squirrels is called a scurry or dray.",
      "Squirrels can fall from any height without being injured due to their low terminal velocity.",
      "Arctic ground squirrels can lower their body temperature below freezing while hibernating.",
      "Squirrels play important roles in forest ecosystems by dispersing seeds.",
      "The world's smallest squirrel is the African pygmy squirrel, weighing only 10 grams."
    ]
  },
  {
    id: 'phoenix',
    name: 'Phoenix',
    level: 5,
    position: { x: 700, y: 500 },
    detectionRadius: 150, // Increased from 40
    soundFile: 'phoenix.mp3',
    color: '255, 140, 0', // Dark orange
    icon: '🔥',
    facts: [
      "The Phoenix is a mythical bird that represents rebirth, renewal, and eternal life.",
      "In Greek mythology, the Phoenix lived for 500-1,000 years before burning itself to ash.",
      "The Phoenix would rise from its own ashes, reborn as a young bird.",
      "Different cultures have similar fire birds: the Fenghuang in China and Firebird in Russia.",
      "The Phoenix was said to have beautiful red and gold plumage that shone like fire.",
      "Ancient Egyptians called their version of the Phoenix 'Bennu' and associated it with the sun god Ra.",
      "The Phoenix represents hope, transformation, and the cyclical nature of life.",
      "In some legends, the Phoenix's tears had healing powers.",
      "The Phoenix built its nest from aromatic wood and spices before its fiery rebirth.",
      "Harry Potter's phoenix Fawkes demonstrates the creature's loyalty and healing abilities.",
      "The Phoenix appears in many modern stories as a symbol of overcoming adversity.",
      "In alchemy, the Phoenix represents the purification process of transformation.",
      "The city of Phoenix, Arizona, was named after this mythical bird.",
      "Native American cultures have similar thunder birds associated with fire and renewal.",
      "The Phoenix constellation was named after this legendary creature.",
      "In Chinese culture, the Fenghuang represents virtue, grace, and the union of yin and yang.",
      "The Phoenix teaches us that endings can be new beginnings in disguise.",
      "Many cultures see the Phoenix as a symbol of the soul's immortality.",
      "The Phoenix reminds us that we have the power to rise above our challenges.",
      "Stories of the Phoenix inspire people to believe in their ability to transform and grow."
    ]
  }
];