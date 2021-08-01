import readline from 'readline';
import { parseGrid, parseLine } from './helpers';
import { Grid } from './rover';

const rl = readline.createInterface({
  input: process.stdin,
});

(async () => {
  try {
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
