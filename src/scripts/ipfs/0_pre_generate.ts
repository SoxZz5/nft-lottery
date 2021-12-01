import fs from 'fs';
import { ipfsPath, generationTmpPath } from './utils';

// Delete ipfs/ then recreate ipfs/ and ipfs/tmp/
fs.rmSync(ipfsPath, { recursive: true, force: true });
fs.mkdirSync(ipfsPath);
fs.mkdirSync(generationTmpPath);
