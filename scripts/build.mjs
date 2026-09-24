import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await cp('index.html', 'dist/index.html');
await cp('src', 'dist/src', { recursive: true });
await cp('content', 'dist/content', { recursive: true });
// GitHub Pages의 Jekyll 처리를 끄고 파일을 그대로 배포합니다.
await writeFile('dist/.nojekyll', '');

console.log('Static site built in dist/');
