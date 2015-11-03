import packageJson from '../../package.json';

export default function() {
  let versionRequired = packageJson.engines.node;
  if(process.versions.node !== versionRequired) {
    console.log('Expected Node version:', versionRequired);
    console.log('Actual Node version:', process.versions.node);
    console.log('Expected and Actual Node versions must be the same. Please fix and restart.');
    return false;
  }

  return true;
}
