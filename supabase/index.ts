// supabase/functions/verify-pin/index.ts
import { createClient } from '@supabase/supabase-js'

Deno.serve(async (req) => {
  const { studentId, pin, isFirstLogin } = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!  // service role: pin_hash 접근 가능
  )

  const pinHash = await hashPin(pin) // crypto.subtle 등으로 해싱

  if (isFirstLogin) {
    await supabase.from('students')
      .update({ pin_hash: pinHash })
      .eq('id', studentId)
      .is('pin_hash', null) // 이미 설정된 경우 덮어쓰기 방지
    return new Response(JSON.stringify({ ok: true }))
  }

  const { data } = await supabase.from('students')
    .select('pin_hash').eq('id', studentId).single()

  const valid = data?.pin_hash === pinHash
  return new Response(JSON.stringify({ ok: valid }))
})