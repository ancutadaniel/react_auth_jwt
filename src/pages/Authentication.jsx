import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export const action = async ({ request }) => {
  let url = "http://localhost:8080/";
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";
  const data = await request.formData();

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Invalid mode." }, { status: 422 });
  }

  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const endpoint = mode === "signup" ? "signup" : "login";
  url += endpoint;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw json({ message: "Authentication failed." }, { status: 500 });
  }

  const responseData = await response.json();
  const token = responseData.token;
  localStorage.setItem("token", token);
  const expiresIn = new Date();
  expiresIn.setHours(expiresIn.getHours() + 1);
  localStorage.setItem("expiresIn", expiresIn.toISOString());

  return redirect("/");
};
