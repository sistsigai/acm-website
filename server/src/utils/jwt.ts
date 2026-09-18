import jwt, { Secret, SignOptions } from "jsonwebtoken";

/* ---------------- TOKEN PAYLOAD TYPE ---------------- */

export interface AdminTokenPayload {
  id: string;
  role: string;
}

/* ---------------- CREATE ADMIN TOKEN ---------------- */

export const createAdminToken = (payload: AdminTokenPayload): string => {
  const jwtSecretRaw = process.env.JWT_SECRET;

  if (!jwtSecretRaw) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (process.env.NODE_ENV === "production") {
    const commonSecrets = [
      "secret",
      "admin123",
      "password",
      "jwtsecret"
    ];

    if (commonSecrets.includes(jwtSecretRaw.toLowerCase())) {
      console.warn("⚠️ WARNING: Using common/default JWT_SECRET in production!");
    }

    if (jwtSecretRaw.length < 32) {
      console.warn("⚠️ WARNING: JWT_SECRET length is less than 32 characters!");
    }
  }

  const jwtSecret: Secret = jwtSecretRaw;

  const signOptions: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "1d") as SignOptions["expiresIn"],
    issuer: "acm-sigai-admin",
    audience: "admin-panel"
  };

  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000)
    },
    jwtSecret,
    signOptions
  );
};
