import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { config } from 'dotenv';
config();

// npx ts-node scripts/1_uploadImagesAndSetJsons.ts
const imagesFolderPath = path.join('1_images');
const jsonFolderPath = path.join('1_jsons');
const apiKey = process.env.AKORD_KEY;

async function uploadImage(filePath: string): Promise<string> {
  const data = await fs.readFile(filePath);

  const response = await axios.post('https://api.akord.com/files', data, {
    headers: {
      Accept: 'application/json',
      'Api-Key': apiKey,
      'Content-Type': 'image/png',
    },
  });

  return response.data.tx.id;
}

async function updateJsonFiles() {
  for (let i = 595; i < 666; i++) {
    const imageFileName = `${i + 1}.png`;
    const jsonFileName = `${i}.json`;

    const imageFilePath = path.join(imagesFolderPath, imageFileName);
    const jsonFilePath = path.join(jsonFolderPath, jsonFileName);

    try {
      const hash = await uploadImage(imageFilePath);

      const jsonData = await fs.readFile(jsonFilePath, 'utf8');
      const json = JSON.parse(jsonData);
      json.image = `https://arweave.net/${hash}`;

      await fs.writeFile(jsonFilePath, JSON.stringify(json, null, 2));
    } catch (error) {
      console.error(`Error updating ${jsonFileName}:`, error);
    }
  }
}

updateJsonFiles()
  .then(() => console.log('All files updated successfully.'))
  .catch((error) => console.error('Error updating files:', error));
