import siteConfig from "@/config/metadata";
import Image from "next/image";
import SignInWithGoogle from "./SignInWithGoogle";
import SignInWithGitHub from "./SignInWithGitHub";
import SignInWithCredentials from "./SignInWithCredentials";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-1/2 p-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/10 to-primary/15 blur-3xl"></div>

        <div className="relative backdrop-blur-xl bg-card/80 rounded-3xl border border-border p-16 w-full max-w-2xl shadow-2xl">
          <div className="flex items-center justify-center mb-12">
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-24 h-24">
                <div className="w-full h-full bg-linear-to-br from-accent to-primary rounded-full blur-2xl opacity-40 animate-pulse"></div>
              </div>

              <div className="relative group cursor-pointer h-full w-full">
                <Image
                  unoptimized
                  src="/android-chrome-512x512.png"
                  alt="Logo"
                  width="200"
                  height="200"
                  className="transition-transform duration-1000 ease-in-out group-hover:rotate-360"
                />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-foreground text-center mb-4">
            {siteConfig.description}
          </h2>
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-16 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl font-bold text-foreground">{siteConfig.name}</span>
            </div>
            <p className="text-muted-foreground text-lg">{siteConfig.description}</p>
          </div>

          <div className="space-y-6">
            <SignInWithCredentials />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">OR</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SignInWithGoogle />
              <SignInWithGitHub />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}