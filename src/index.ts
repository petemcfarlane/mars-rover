import readline from 'readline';
import { format, parseGrid, parseLine } from './helpers';
import { Grid, interpretWithinGrid } from './rover';

const rl = readline.createInterface({
  input: process.stdin,
});

(async () => {
  let grid: Grid | undefined;
  for await (const line of rl) {
    if (typeof grid === 'undefined') {
      grid = parseGrid(line);
      continue;
    }
    const [rover, instructions] = parseLine(line);
    process.stdout.write(format(interpretWithinGrid(grid, rover, ...instructions)) + '\n');
  }
})();
