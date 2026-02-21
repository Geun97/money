# Supabase "Invalid API key" 해결 방법

Vercel 로그에 `Invalid API key` 가 나오면, Vercel에 설정한 **anon key** 가 잘못된 경우입니다.

## 1. Supabase에서 올바른 키 복사

1. **https://supabase.com/dashboard** 접속 → 로그인
2. 사용 중인 **프로젝트** 선택 (정책24 블로그용)
3. 왼쪽 아래 **Settings** (톱니바퀴) 클릭
4. **API** 메뉴 클릭
5. **Project URL** 복사 → `NEXT_PUBLIC_SUPABASE_URL` 값으로 사용
6. **Project API keys** 에서 **anon public** 키만 복사  
   - **anon** (public) 사용. **service_role** 은 사용하지 말 것.  
   - 복사 시 앞뒤 공백 없이 붙여넣기

## 2. Vercel에서 환경 변수 수정

1. **https://vercel.com** → 해당 프로젝트 (money) 선택
2. **Settings** → **Environment Variables**
3. 기존 항목 수정:
   - `NEXT_PUBLIC_SUPABASE_URL`  
     → Supabase **Project URL** 로 덮어쓰기
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
     → Supabase **anon public** 키로 덮어쓰기
4. **Save** 후 꼭 **Redeploy**  
   - **Deployments** 탭 → 맨 위 배포 **⋮** → **Redeploy**

## 3. 자주 하는 실수

| 실수 | 해결 |
|------|------|
| **service_role** 키를 넣음 | **anon public** 키만 사용 |
| 다른 프로젝트 키 사용 | 지금 쓰는 Supabase 프로젝트의 API 화면에서 복사 |
| 복사 시 공백 포함 | 한 번에 복사하고, 값 앞뒤에 스페이스 없이 붙여넣기 |
| 환경 변수만 수정하고 재배포 안 함 | 수정 후 반드시 **Redeploy** 한 번 실행 |

환경 변수만 바꾸고 Redeploy 를 하지 않으면 이전 빌드가 그대로라서 키 오류가 계속 납니다.
