import { api } from "@/services/api";

export async function activateAccount(payload: {
  token: string;
  password: string;
  passwordConfirmation: string;
}) {
  const response = await api.post<{ message: string }>("/auth/activate", payload);

  return response.data;
}
