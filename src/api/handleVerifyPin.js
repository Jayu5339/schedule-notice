import { createClient } from '@supabase/supabase-js'

// 1. 일반적인 Anon Key로 클라이언트 생성
const supabaseUrl = 'https://your-project-id.supabase.co'
const supabaseAnonKey = 'your-anon-key'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 2. PIN 번호 검증 함수
export default async function handleVerifyPin() {
  const { data, error } = await supabase.functions.invoke('verify-pin', {
    body: {
      studentId: 'student_123',
      pin: '1234',
      isFirstLogin: false // 최초 로그인일 때는 true
    }
  })

  if (error) {
    console.error('호출 실패:', error)
    return
  }

  if (data.ok) {
    console.log('PIN 인증 성공!')
  } else {
    console.log('PIN 일치하지 않음')
  }
}