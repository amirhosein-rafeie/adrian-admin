/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
import fs from 'fs';
import path from 'path';
import { Project } from 'ts-morph';

const inputFile = path.resolve('./src/share/utils/api/__generated__/custom.ts');
const outputFile = path.resolve('./src/share/utils/api/__generated__/types.ts');

const project = new Project();
project.addSourceFileAtPath(inputFile);
const sourceFile = project.getSourceFileOrThrow('custom.ts');

const pathsType =
  sourceFile.getTypeAlias('paths') || sourceFile.getInterface('paths');
if (!pathsType) {
  console.error("❌ Could not find 'paths' type or interface in custom.ts");
  process.exit(1);
}

let output = `import { paths } from './custom';\n\n`;

const mimeMap = {
  'application/json': 'Json',
  'application/x-www-form-urlencoded': 'Urlencoded',
  'multipart/form-data': 'FormData',
};

function toCamelCase(str) {
  return str
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((word, index) => {
      if (!word) return '';
      if (index === 0) return word.charAt(0).toLowerCase() + word.slice(1);
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join('');
}

const pathProps = pathsType.getType().getProperties();

pathProps.forEach((member) => {
  const pathName = member.getName();
  const basePath = `paths['${pathName}']`;
  const camelPath = toCamelCase(pathName);

  const pathType = member.getTypeAtLocation(pathsType);
  const methods = pathType.getProperties();

  methods.forEach((method) => {
    const methodName = method.getName();
    const methodType = method.getTypeAtLocation(pathsType);
    const methodBase = `${basePath}['${methodName}']`;

    // Responses
    const responses = methodType.getProperty('responses');
    if (responses) {
      const respProps = responses.getTypeAtLocation(pathsType).getProperties();
      respProps.forEach((resp) => {
        const status = resp.getName();
        const statusType = resp.getTypeAtLocation(pathsType);
        const content = statusType.getProperty('content');

        if (content) {
          const mimeTypes = content
            .getTypeAtLocation(pathsType)
            .getProperties();
          mimeTypes.forEach((mimeProp) => {
            const mime = mimeProp.getName();
            const suffix = mimeMap[mime] || mime.replace(/[\/\-]/g, '_');
            const typeName = `${methodName}${status}${camelPath}Response${suffix}`;
            output += `export type ${typeName} = ${methodBase}['responses']['${status}']['content']['${mime}'];\n`;
          });
        } else {
          const typeName = `${methodName}${status}${camelPath}Response`;
          output += `export type ${typeName} = ${methodBase}['responses']['${status}'];\n`;
        }
      });
    }

    const parameters = methodType.getProperty('parameters');
    if (parameters) {
      const paramProps = parameters
        .getTypeAtLocation(pathsType)
        .getProperties();
      paramProps.forEach((p) => {
        const pname = p.getName();
        const typeName = `${methodName}${camelPath}${pname[0].toUpperCase()}${pname.slice(
          1
        )}Params`;
        output += `export type ${typeName} = ${methodBase}['parameters']['${pname}'];\n`;
      });
    }

    const requestBody = methodType.getProperty('requestBody');
    if (requestBody) {
      const content = requestBody
        .getTypeAtLocation(pathsType)
        .getProperty('content');
      if (content) {
        const mimeTypes = content.getTypeAtLocation(pathsType).getProperties();
        mimeTypes.forEach((mimeProp) => {
          const mime = mimeProp.getName();
          const suffix = mimeMap[mime] || mime.replace(/[\/\-]/g, '_');
          const typeName = `${methodName}${camelPath}RequestBody${suffix}`;
          output += `export type ${typeName} = ${methodBase}['requestBody']['content']['${mime}'];\n`;
        });
      }
    }
  });

  output += '\n';
});

fs.writeFileSync(outputFile, output, 'utf8');
console.log('✅ types.ts is generated from custom.ts file successfully.');
