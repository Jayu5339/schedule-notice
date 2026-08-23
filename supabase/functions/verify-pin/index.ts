import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
// import { createClient } from "@supabase/supabase-js"

// 프론트엔드에서 호출할 때 CORS 에러를 방지하기 위한 헤더
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// 간단한 SHA-256 해시 함수 (Deno 표준 Crypto API 활용)
async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(pin)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => { // CORS Preflight 요청 처리
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { studentId, pin, isFirstLogin } = await req.json()

    // Edge Function 환경변수에서 자동으로 SUPABASE_URL과 SERVICE_ROLE_KEY를 가져옵니다.
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const pinHash = await hashPin(pin)

    if (isFirstLogin) {
      const { error } = await supabase
        .from('students')
        .update({ pin_hash: pinHash })
        .eq('id', studentId)
        .is('pin_hash', null)

      if (error) throw error

      return new Response(JSON.stringify({ ok: true, message: 'PIN registered' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data, error } = await supabase
      .from('students')
      .select('pin_hash')
      .eq('id', studentId)
      .single()

    if (error || !data) {
      return new Response(JSON.stringify({ ok: false, error: 'Student not found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const valid = data.pin_hash === pinHash
    return new Response(JSON.stringify({ ok: valid }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})