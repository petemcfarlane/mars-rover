# Mars rover
## [📧Pete McFarlane](mailto:pete.mcfarlane@icloud.com)

I chose to solve the Mars rover assignment in [TypeScript](https://www.typescriptlang.org), the popular, typed language which compiles down to JavaScript. JavaScript is ubiquitous, it is a very useful tool for many applications - it is rapid to prototype with, available in a multitude of environments and near infinitely scalable with the power of cloud computing. TypeScript offers an extra layer of helpful static typing on top of JavaScript, which is helpful for development, for debugging and reducing unexpected run-time errors.

The CLI application can be executed on any environment that has NodeJS installed. I've also included a `Dockerfile` so it can also be built and ran in an environment without installing NodeJS, provided it can build and run a container.
## How to run
If you have NodeJS available on your environment:
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


## Run without NodeJS (with Docker)
- Build the container
```
docker build -t mars-rover .
```

- Run the container
```
cat data/input1 | docker run mars-rover
```
## Data structures
I initially modelled the Rover as an `interface` with a `x: number`, `y: number` for position, an `Orientation` and an `isLost: boolean` property. But I decided it would be neater to encapsulate some of the transformations using an EC6 class. The abstractions still not perfect, as some of the smaller types/functions have leaked out, mainly for testing.
I wished there was a neat way to do pattern matching in TypeScript, until then I used switch statements and `Record` type objects as a sort of dictionary, to map instruction enums.
## What you would do given more time

Error hardening
Pass input file as argument
Infinite lists
Parallel processing

## Assumptions
m*n grid must be exclusive? see example input
