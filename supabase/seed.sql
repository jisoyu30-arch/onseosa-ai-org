-- Phase 1 엔진 프로필 초기 데이터 (6개)
INSERT INTO engine_profiles (engine_name, department, role_summary, preferred_model) VALUES
  ('arko', '총괄운영', '총괄 PM. 맥락 파악, 엔진 결정, 결과 통합, 보고', 'gpt-4o'),
  ('noah', '분석팀', '분석가. 자료/레퍼런스 패턴 분석', 'gemini-2.5-flash'),
  ('eden', '기획팀', '기획자. 분석 결과를 실행 가능한 기획안으로 변환', 'gpt-4o'),
  ('ria', '창작팀', '작가. 감성 카피, 설명문, 제목 후보 창작', 'claude-sonnet-4-6'),
  ('kal', '검수팀', '검수관. 냉정한 품질 평가. 점수 0~100', 'gpt-4o'),
  ('luka', '기록팀', '기록관. 기억 저장 및 히스토리 관리', 'none');

-- 엔진 기억 초기화
INSERT INTO engine_memory (engine_name) VALUES
  ('arko'), ('noah'), ('eden'), ('ria'), ('kal'), ('luka');
