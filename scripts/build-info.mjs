// Records when the site was built, for the "last updated" line in site stats.
import { writeFile } from 'node:fs/promises';
await writeFile(new URL('../public/assets/build.json', import.meta.url), JSON.stringify({ builtAt: new Date().toISOString() }) + '\n');
