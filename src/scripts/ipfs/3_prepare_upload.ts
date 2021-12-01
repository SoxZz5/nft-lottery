import fs from 'fs';
import {
    getCIDFromCAR,
    imagesNameCAR,
    metadataNameCAR,
    generationTmpPath,
    ipfsPath
} from './utils';

/*
    * Delete tmp/ and rename CAR files with their CID
*/
async function run() {

    // Delete tmp/
    fs.rmSync(generationTmpPath, { recursive: true, force: true });

    // Rename images CAR
    const imagesCID = await getCIDFromCAR(`${ipfsPath}/${imagesNameCAR}`);
    fs.renameSync(`${ipfsPath}/${imagesNameCAR}`, `${ipfsPath}/${imagesCID}.car`);

    // Rename metadata CAR
    const metadataCID = await getCIDFromCAR(`${ipfsPath}/${metadataNameCAR}`);
    fs.renameSync(`${ipfsPath}/${metadataNameCAR}`, `${ipfsPath}/${metadataCID}.car`);
}
run();

export {}