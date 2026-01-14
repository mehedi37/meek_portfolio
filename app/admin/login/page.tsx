"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Form,
  Input,
  Label,
  TextField,
  FieldError,
  Spinner,
  InputGroup,
} from "@heroui/react";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Redirect to admin dashboard
      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-surface to-surface-secondary px-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card className="p-8">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4"
            >
              <FaLock className="w-7 h-7 text-accent" />
            </motion.div>
            <h1 className="text-2xl font-bold text-foreground">Admin Portal</h1>
            <p className="text-muted mt-2 text-sm">
              Sign in to manage your portfolio
            </p>
          </div>

          <Form onSubmit={handleSubmit}>
            <Card.Content className="space-y-5">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-lg bg-danger/10 border border-danger-soft-hover"
                >
                  <p className="text-sm text-danger text-center">{error}</p>
                </motion.div>
              )}

              {/* Username Field */}
              <TextField
                name="username"
                isRequired
                value={username}
                onChange={setUsername}
                className="w-full"
              >
                {/* <Label>Username</Label> */}
                <InputGroup>
                  <InputGroup.Prefix>
                    <FaUser className="w-3 h-3 text-muted" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    placeholder="Enter your username"
                    autoComplete="username"
                  />
                </InputGroup>
                <FieldError />
              </TextField>

              {/* Password Field */}
              <TextField
                name="password"
                type={showPassword ? "text" : "password"}
                isRequired
                value={password}
                onChange={setPassword}
                className="w-full"
              >
                {/* <Label className="flex items-center gap-2 mb-1">
                  <FaLock className="w-3 h-3 text-muted" />
                  Password
                </Label> */}
                <InputGroup>
                  <InputGroup.Prefix>
                    <FaLock className="w-3 h-3 text-muted" />
                  </InputGroup.Prefix>
                  <InputGroup.Input
                    placeholder="Enter your password"
                    autoComplete="current-password"
                  />
                  <InputGroup.Suffix
                    className="cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="w-4 h-4 text-muted" />
                    ) : (
                      <FaEye className="w-4 h-4 text-muted" />
                    )}
                  </InputGroup.Suffix>
                </InputGroup>
                <FieldError />
              </TextField>
            </Card.Content>

            <Card.Footer className="mt-6 flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                isPending={isLoading}
                isDisabled={!username || !password}
              >
                {({ isPending }) => (
                  <>
                    {isPending ? (
                      <Spinner color="current" size="sm" />
                    ) : (
                      <FaLock className="w-4 h-4" />
                    )}
                    {isPending ? "Signing in..." : "Sign In"}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted text-center">
                Protected area. Unauthorized access is prohibited.
              </p>
            </Card.Footer>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}
