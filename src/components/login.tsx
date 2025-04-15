import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/Authcontext";

const LoginPage = () => {
  const { setAccessToken } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    rollNo: "",
    accessCode: "",
    clientId: "",
    clientSecret: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("http://20.244.56.144/evaluation-service/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(formData)

      const data = await response.json();

      if (response.ok) {
        setAccessToken(data.access_token);
        router.refresh(); 
      } else {
        setError(data.message || "An error occurred");
      }
    } catch (error) {
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <input
          type="text"
          name="rollNo"
          value={formData.rollNo}
          onChange={handleChange}
          placeholder="Roll No"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <input
          type="text"
          name="accessCode"
          value={formData.accessCode}
          onChange={handleChange}
          placeholder="Access Code"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <input
          type="text"
          name="clientId"
          value={formData.clientId}
          onChange={handleChange}
          placeholder="Client ID"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <input
          type="text"
          name="clientSecret"
          value={formData.clientSecret}
          onChange={handleChange}
          placeholder="Client Secret"
          className="p-2 border border-gray-300 mb-2"
          required
        />
        <button
          type="submit"
          className="p-2 bg-blue-500 text-white rounded"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
