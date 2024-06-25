import * as fs from 'fs';
import * as path from 'path';

// npx ts-node scripts/0_generateJsons.ts
const folderPath = path.join('./1_jsons');
const numFiles = 668;

if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath);
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type Distribution = {
  [key: string]: string[];
};

const distributions: Distribution = {
  'Scare Factor': ['Low', 'Medium', 'High', 'Panic'],
  'Caffeine Level': ['Low', 'Medium', 'High', 'Energy Explosion'],
  'Energy Level': ['Low', 'Medium', 'High', 'Unstoppable'],
  'Coffee Connoisseur Status': ['Novice', 'Enthusiast', 'Expert', 'Master'],
  'Intelligence Level': ['Low', 'Medium', 'High', 'Genius'],
};

const percentages = [0.4, 0.3, 0.2, 0.1];
const counters: { [key: string]: number[] } = {};

for (const field in distributions) {
  counters[field] = Array(distributions[field].length).fill(0);
}

for (let i = 0; i < numFiles; i++) {
  const data: { [key: string]: any } = {
    name: `CoffeeMonster #${i + 1}`,
    description:
      'CoffeeMonsters is a collection of 666 lovingly AI-generated monsters, with each monster developed individually and refined by our designers. Each creature exudes its own charm and personality, making them truly one-of-a-kind',
    image: 'image',
    attributes: [],
  };

  for (const field in distributions) {
    let valueAssigned = false;

    while (!valueAssigned) {
      const index = getRandomInt(0, distributions[field].length - 1);
      const maxCount = Math.floor(numFiles * percentages[index]);

      if (counters[field][index] < maxCount) {
        data.attributes.push({
          trait_type: field,
          value: distributions[field][index],
        });
        counters[field][index]++;
        valueAssigned = true;
      }
    }
  }

  const filePath = path.join(folderPath, `${i}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

console.log('Generation completed.');
