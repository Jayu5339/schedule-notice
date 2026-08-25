import { supabase } from "../../supabase/supabaseClient";

export default async function handleVerifyPin({
  studentId,
  pin,
  isFirstLogin,
}) {
  if (!studentId || !pin) {
    throw new Error("studentId와 pin이 필요합니다.");
  }

  if (!supabase || !supabase.auth || !supabase.functions) {
    throw new Error(
      "Supabase 클라이언트가 초기화되지 않았습니다. VITE_SUPABASE_URL과 VITE_SUPABASE_ANON_KEY를 확인해주세요.",
    );
  }

  const { data, error } = await supabase.functions.invoke("verify-pin", {
    body: {
      studentId,
      pin,
      isFirstLogin,
    },
  });

  if (error) {
    throw error;
  }

  if (!data?.ok) {
    throw new Error(data?.error || "PIN 인증에 실패했습니다.");
  }

  return data;
}
