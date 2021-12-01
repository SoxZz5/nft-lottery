import path from 'path';
import fs from 'fs';
import { packToFs } from 'ipfs-car/pack/fs'
import { FsBlockStore } from 'ipfs-car/blockstore/fs'
import { CarReader } from '@ipld/car'

const assetsPath = path.resolve(`${__dirname}/../../assets`);
const imagesPath = `${assetsPath}/images`;
const ipfsPath = `${assetsPath}/ipfs`;
const generationTmpPath = `${ipfsPath}/tmp`;
const imagesNameCAR = "images";
const metadataNameCAR = "metadata";

const collectionProfilePicName = "SpaceTombo_ships.gif";

function copyFile(source: string, destination: string) {

    fs.copyFile(source, destination, (err) => {
        if (err) throw err;
    });
}

function generateCAR(fileName: string) {
    return packToFs({
        input: generationTmpPath,
        output: `${ipfsPath}/${fileName}`,
        blockstore: new FsBlockStore(),
        wrapWithDirectory: false
    });
}

async function getCIDFromCAR(filePath: string) {
    const stream = fs.createReadStream(filePath)
    const reader = await CarReader.fromIterable(stream)
    const roots = await reader.getRoots()
    const info = await reader.get(roots[0])
    
    if(!info) {
        throw "Missing CID";
    }
    return info["cid"].toString();
}

export {
    assetsPath,
    imagesPath,
    ipfsPath,
    generationTmpPath,
    imagesNameCAR,
    metadataNameCAR,
    collectionProfilePicName,
    copyFile,
    generateCAR,
    getCIDFromCAR
};