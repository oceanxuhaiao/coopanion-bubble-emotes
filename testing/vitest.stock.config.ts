import {fileURLToPath} from 'node:url';
export default{resolve:{alias:[{find:/^cortico\//,replacement:fileURLToPath(new URL('../upstream/Coopanion-0.2.8/vendor/cortico/src/',import.meta.url))}]},test:{include:['testing/stock-*.test.ts'],pool:'forks',maxWorkers:1,minWorkers:1,testTimeout:15000}};
