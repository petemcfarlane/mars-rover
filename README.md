# Mars rover
## [📧Pete McFarlane](mailto:pete.mcfarlane@icloud.com)

I chose to solve the Mars rover assignment in [TypeScript](https://www.typescriptlang.org), the popular, typed language which compiles down to JavaScript. JavaScript is ubiquitous, it is a very useful tool for many applications - it is rapid to prototype with, available in a multitude of environments and near infinitely scalable with the power of cloud computing. TypeScript offers an extra layer of helpful static typing on top of JavaScript, which is helpful for development, for debugging and reducing unexpected run-time errors.

The CLI application can be executed on any environment that has NodeJS installed. I've also included a `Dockerfile` so it can also be built and ran in an environment without installing NodeJS, provided it can build and run a container.
## How to run (if you have NodeJS available on your environment):
- First install dependencies with
```
npm install
```

- Then compile the TypeScript to regular javascript
```
npm run build
```

- Then run the CLI application by piping the input data to it
```
cat data/input1 | node dist/index.js
```

- Alternatively you may pass a filename as an argument
```
node dist/index.js data/input1
```


## Run without NodeJS (with Docker)
- Build the container
```
docker build -t mars-rover .
```

- Run the container
```
cat data/input1 | docker run -i mars-rover
```

Or
```
 docker run mars-rover data/input1
```
Note: the docker build file copies any input in the `data` dir to the docker container, so if you use this method you'll have to add the data file as a volume mount first.

I've also included some tests which can be run with `npm test` and some formatting/code styling tools which can be run with `npm run format` and `npm run lint`.
## Data structures
I initially modelled the Rover as an `interface` with a `x: number`, `y: number` for position, an `Orientation` and an `isLost: boolean` property. But I decided it would be neater to encapsulate some of the transformations using an EC6 class.

I wished there was a neat way to do pattern matching in TypeScript, until then I used switch statements and `Record` type objects as a sort of dictionary, to map instruction enums.
## What you would do given more time

- ### Error hardening
    What should happen if one of the input lines cannot be parsed? Should we just output an "ERROR: ..." for such a line and continue with the rest of the successful lines? Currently the application stops with a message "Couldn't parse line ...".

- ### Infinite lists/performance testing
    What happens when we have extremely long lists of instructions or an extremely long list of robots?

- ### Parallel processing
    Could we process multiple lines at once, or do the lines in the output have to match the input order?

- ### Don't allow the robot to get lost in the first place?
    We could just bound the robot by the grid, so if it tries to move too far to the north it remains in it's current position, then we continue processing the remaining instructions.
## Assumptions
- m*n grid must be inclusive? From the example assertion, we have a robot in a grid of size `4 x 8` and the robots final position is `(4, 4, E)` and it is not considered lost.

- Input data will be correct - a big assumption to make, I've mentioned above some of the improvements we could make to this by only failing on a line by line instance, if this is appropriate?
