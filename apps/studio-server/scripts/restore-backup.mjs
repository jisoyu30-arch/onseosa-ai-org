import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { checkBundle, compareWork, restoreBackup } from '../src/backup.mjs';

/*
 * 작품 백업 파일을 새 빈 폴더에 복원한다.
 *
 *   node apps/studio-server/scripts/restore-backup.mjs --backup=<백업 파일> --into=<새 빈 폴더>
 *   (선택) --compare=<원래 원고 폴더>   복원본이 원본과 같은지 파일 단위로 비교한다.
 *   (선택) --check                      복원하지 않고 백업 파일이 온전한지만 본다.
 *
 * 이미 무언가 있는 폴더에는 쓰지 않는다. 지금 쓰는 원고 폴더 위에 덮어쓰는 기능은 없다.
 * 복원한 폴더를 집필실에서 열려면: 집필실을 끄고, 그 폴더를 STUDIO_DATA_ROOT 로 지정해 저장 서버를 켠다(README 참고).
 */

function arg(name) {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

export function run(argv = process.argv) {
  const backup = arg('backup');
  const into = arg('into');
  const compare = arg('compare');
  const checkOnly = argv.includes('--check');
  if (!backup || (!into && !checkOnly)) throw new Error('사용법: --backup=<백업 파일> --into=<새 빈 폴더> [--compare=<원래 원고 폴더>]');
  const bundle = checkBundle(JSON.parse(fs.readFileSync(path.resolve(backup), 'utf8')));
  console.log(`백업: ${bundle.title} (${bundle.workId}) · 만든 때 ${bundle.exportedAt}`);
  console.log(`담긴 것: 회차 ${bundle.counts.docs}편, 뺀 원고 ${bundle.counts.removed}편, 판 ${bundle.counts.versions}개, 복구본 ${bundle.counts.recovery}개, 카드 ${bundle.counts.cards}장, 연결 ${bundle.counts.links}개, 파일 ${bundle.counts.files}개`);
  if (checkOnly) {
    console.log('백업 파일은 온전합니다. (복원하지 않았습니다)');
    return { bundle };
  }
  const result = restoreBackup(bundle, into);
  console.log(`복원 완료: ${result.root}`);
  if (compare) {
    const report = compareWork(path.resolve(compare), result.root, bundle.workId);
    console.log(report.same ? '원본과 같습니다 (회차 ID·순서·모든 파일 내용).' : `원본과 다릅니다:\n- ${report.differences.join('\n- ')}`);
    if (!report.same) process.exitCode = 1;
    return { bundle, result, report };
  }
  return { bundle, result };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    run();
  } catch (e) {
    console.error('복원하지 못했습니다: ' + e.message);
    process.exit(1);
  }
}
