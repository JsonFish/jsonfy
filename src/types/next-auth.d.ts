import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    backendUserId?: string;
    backendUsername?: string;
    backendAvatar?: string;
    backendRole?: number;
    backendAccessToken?: string;
    backendRefreshToken?: string;
  }
}
