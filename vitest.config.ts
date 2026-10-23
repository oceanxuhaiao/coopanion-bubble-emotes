import { fileURLToPath } from 'node:url';
export default {
  resolve: { alias: [{find:/^cortico\//,replacement:fileURLToPath(new URL('./upstream/Coopanion-0.2.8/vendor/cortico/src/',import.meta.url))}] },
  test: { include: ['packages/**/tests/*.test.ts'], pool:'forks', maxWorkers:2, minWorkers:1 }
};
