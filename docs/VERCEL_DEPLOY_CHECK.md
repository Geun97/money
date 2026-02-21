# Vercel 배포 상태 확인 방법

## 1. 대시보드 들어가기

1. 브라우저에서 **https://vercel.com** 접속
2. 로그인 (GitHub로 로그인했으면 그대로 사용)

## 2. 프로젝트 선택

1. 상단 또는 대시보드에서 **money** 프로젝트 클릭  
   (이름이 다르면 해당하는 프로젝트 선택)

## 3. 배포 상태 보기

1. **Deployments** 탭 클릭
2. 맨 위가 가장 최신 배포

| 상태 | 의미 |
|------|------|
| **Building** | 빌드 중 (1~2분 정도 소요) |
| **Queued** | 대기 중, 곧 빌드 시작 |
| **Ready** | 배포 완료 → 사이트에 반영됨 |
| **Error** | 빌드 실패 → 해당 배포 클릭해서 로그 확인 |

## 4. 배포 완료 후 확인

- **Ready**가 되면 **https://money-ivon.vercel.app** 접속해서 새로고침
- 디버그용: **https://money-ivon.vercel.app/api/debug-posts** 로 Supabase 연결/글 개수 확인

## 5. 수동 재배포 (필요할 때)

1. **Deployments** 탭에서 맨 위 배포 행 오른쪽 **⋮** (세 점) 클릭
2. **Redeploy** 선택
3. **Redeploy** 버튼 한 번 더 클릭

이후 다시 **Building** → **Ready** 될 때까지 기다리면 됨.
