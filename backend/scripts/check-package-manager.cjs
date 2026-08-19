if (process.env.npm_execpath && !process.env.npm_execpath.includes('pnpm')) {
  console.error('\x1b[31mError: This project requires pnpm.\x1b[0m');
  console.error('Install it: npm i -g pnpm');
  console.error('Then run:   pnpm install');
  process.exit(1);
}
