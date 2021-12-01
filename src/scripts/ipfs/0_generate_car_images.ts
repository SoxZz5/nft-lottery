import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { packToFs } from 'ipfs-car/pack/fs'
import { FsBlockStore } from 'ipfs-car/blockstore/fs'
import minterOptions from '../../config/minterOptions';
import { CarReader } from '@ipld/car'

// General
const assetsPath = path.resolve(`${__dirname}/../../assets`);
const imagesPath = `${assetsPath}/images`;
const ipfsPath = `${assetsPath}/ipfs`;
const generationTmpPath = `${ipfsPath}/tmp`;

// Images
const profilePicName = "SpaceTombo_ships.gif";
const profilePicPath = `${imagesPath}/profile/${profilePicName}`;
const destroyedShipName = "destroyed.png";
const destroyedShipPath = `${imagesPath}/${destroyedShipName}`;

function copyFile(source: string, destination: string) {

    fs.copyFile(source, destination, (err) => {
        if (err) throw err;
    });
}

function generateMergedImages(): Promise<sharp.OutputInfo[]> {

    const promises: Array<Promise<sharp.OutputInfo>> = [];
    minterOptions.body.variants.forEach((bodyVariant, bodyIndex) => {
        minterOptions.skin.variants.forEach((skinVariant, skinIndex) => {
            minterOptions.weapon.variants.forEach((weaponVariant, weaponIndex) => {
                minterOptions.booster.variants.forEach((boosterVariant, boosterIndex) => {
                    
                    const filePath = `${generationTmpPath}/${bodyIndex + 1}_${skinIndex + 1}_${weaponIndex + 1}_${boosterIndex + 1}.png`;
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

async function generateCAR() {

    const tmpFilePath = `${ipfsPath}/car`;
    await packToFs({
        input: generationTmpPath,
        output: tmpFilePath,
        blockstore: new FsBlockStore(),
        wrapWithDirectory: false
    });

    const stream = fs.createReadStream(tmpFilePath)
    const reader = await CarReader.fromIterable(stream)
    const roots = await reader.getRoots()
    const info = await reader.get(roots[0])
    if(info) {
        fs.renameSync(tmpFilePath, `${ipfsPath}/${info["cid"].toString()}.car`);
    } else {
        throw "Missing CID";
    }
}

async function run() {
    
    /*
        * 1. Generate images CAR
    */

    // Delete ipfs/ then recreate ipfs/ and ipfs/tmp/
    fs.rmSync(ipfsPath, { recursive: true, force: true });
    fs.mkdirSync(ipfsPath);
    fs.mkdirSync(generationTmpPath);

    // Copy collection logo
    copyFile(profilePicPath, `${generationTmpPath}/${profilePicName}`)
    
    // Copy destroyed ship visual
    copyFile(destroyedShipPath, `${generationTmpPath}/${destroyedShipName}`)
    
    // Generate all combinations of merged PNGs and save them to tmp/
    await generateMergedImages();
    
    // At this point, all images we want to push on IPFS are in tmp/
    // Generate CAR for images
    await generateCAR();
    
    /*
        * 2. Generate metadata CAR
    */

    // Delete and recreate tmp/
    fs.rmSync(generationTmpPath, { recursive: true, force: true });
    fs.mkdirSync(generationTmpPath);


}
run();

export {}