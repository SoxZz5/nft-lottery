import fs from 'fs';
import sharp from 'sharp';
import minterOptions from '../../config/minterOptions';
import {
    assetsPath,
    imagesPath,
    generationTmpPath,
    copyFile,
    generateCAR,
    imagesNameCAR,
    collectionProfilePicName
} from './utils';

const profilePicPath = `${imagesPath}/profile/${collectionProfilePicName}`;
const destroyedShipName = "destroyed.png";
const destroyedShipPath = `${imagesPath}/${destroyedShipName}`;

function generateMergedImages(): Promise<sharp.OutputInfo[]> {

    const promises: Array<Promise<sharp.OutputInfo>> = [];
    minterOptions.body.variants.forEach((bodyVariant, bodyIndex) => {
        minterOptions.skin.variants.forEach((skinVariant, skinIndex) => {
            minterOptions.weapon.variants.forEach((weaponVariant, weaponIndex) => {
                minterOptions.booster.variants.forEach((boosterVariant, boosterIndex) => {
                    
                    const filePath = `${generationTmpPath}/${bodyIndex}_${skinIndex}_${weaponIndex}_${boosterIndex}.png`;
                    const promise = sharp(assetsPath + minterOptions.weapon.getPath(weaponIndex))
                                    .composite([
                                        { input: assetsPath + minterOptions.skin.getPath(skinIndex) },
                                        { input: assetsPath + minterOptions.booster.getPath(boosterIndex) },
                                        { input: assetsPath + minterOptions.body.getPath(bodyIndex) }
                                    ])
                                    .toFile(filePath);
                                    //.catch(err => console.log(err));
                    promises.push(promise);
                });
            });
        });
    });
    return Promise.all(promises);
}

/*
    * Generate images CAR
*/
async function run() {

    // Delete and recreate tmp/
    fs.rmSync(generationTmpPath, { recursive: true, force: true });
    fs.mkdirSync(generationTmpPath);

    // Copy collection logo to tmp/
    copyFile(profilePicPath, `${generationTmpPath}/${collectionProfilePicName}`)
    
    // Copy destroyed ship visual to tmp/
    copyFile(destroyedShipPath, `${generationTmpPath}/${destroyedShipName}`)
    
    // Generate all combinations of merged PNGs and save them to tmp/
    await generateMergedImages();
    
    // At this point, all images we want to push on IPFS are in tmp/
    // Generate CAR for images
    await generateCAR(imagesNameCAR);
}
run();

export {}