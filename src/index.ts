import readline from 'readline';
import fs from 'fs';
import { parseGrid, parseLine } from './helpers';
import { Grid } from './rover';

(async () => {
  try {
    const [filename] = process.argv.slice(2, 3);
    const input = typeof filename !== 'undefined' ? fs.createReadStream(filename) : process.stdin;

    const rl = readline.createInterface({ input });

    let grid: Grid | undefined;
    for await (const line of rl) {
      if (typeof grid === 'undefined') {
        grid = parseGrid(line);
        continue;
      }
      const [rover, instructions] = parseLine(line);
      process.stdout.write(rover.interpretWithinGrid(grid, ...instructions).stringify() + '\n');
    }
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
})();
