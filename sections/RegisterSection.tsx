import RegisterPage from "../islands/auth/RegisterPage.tsx";

export interface Props {
  title?: string;
}

export default function RegisterSection({ title = "Cadastro" }: Props) {
  return (
    <>
      <RegisterPage />
    </>
  );
}