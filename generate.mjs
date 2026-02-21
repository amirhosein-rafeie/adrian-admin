import fs from 'fs/promises';
import path from 'path';
import openapiTS, { astToString } from 'openapi-typescript';

const CONFIG = {
  input: 'http://185.97.116.149:8080/swagger.yaml',
  output: './src/share/utils/api/__generated__/custom.ts',
};

function postProcess(contents) {
  contents = contents.replace(/header:\s*{[^}]*}/g, 'header?: never');

  contents = contents.replace(
    /translation:\s*Record<string,\s*never>/g,
    'translation: Translate'
  );

  contents = contents.replace(
    /(\w+)\??:\s*\[\s*(?:[^\]]*)\]\s*\|\s*\[\s*(?:[^\]]*)\];/g,
    (_match, key) => `${key}: string | number;`
  );

  return contents;
}

async function generate() {
  try {
    const ast = await openapiTS(CONFIG.input, {
      transform(schema) {
        if (schema.type === 'float') schema.type = 'number';
      },
    });

    let contents = astToString(ast);

    contents = postProcess(contents);

    await fs.mkdir(path.dirname(CONFIG.output), { recursive: true });

    await fs.writeFile(CONFIG.output, contents, 'utf8');

    console.log(`✅ File generated successfully at ${CONFIG.output}`);
  } catch (err) {
    console.error('❌ Error generating types:', err);
  }
}

generate();
