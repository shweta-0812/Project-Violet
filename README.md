Create a new npm project, install Fastify, and install typescript & node.js types as peer dependencies:

npm init -y
npm i fastify
npm i -D typescript @types/node

Add the following lines to the "scripts" section of the package.json:

{
"scripts": {
"build": "tsc -p tsconfig.json",
"start": "node index.js"
}
}

Initialize a TypeScript configuration file:

npx tsc --init