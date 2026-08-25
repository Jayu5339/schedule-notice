import { supabase } from "../../supabase/supabaseClient";

export default async function handleVerifyPin({
  studentId,
  pin,
  isFirstLogin,
}) {
  if (!studentId || !pin) {
    throw new Error("studentId와 pin이 필요합니다.");
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
