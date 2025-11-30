import siteConfig from "@/config/metadata";
import Image from "next/image";
import SignInWithGoogle from "./SignInWithGoogle";
import SignInWithGitHub from "./SignInWithGitHub";
import SignInWithCredentials from "./SignInWithCredentials";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 p-6 sm:p-8 md:p-12 lg:p-16 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/10 to-primary/15 blur-3xl"></div>

        <div className="relative backdrop-blur-xl bg-card/80 rounded-3xl border border-border p-6 sm:p-8 md:p-12 lg:p-16 w-full max-w-2xl shadow-2xl">
          <div className="flex items-center justify-center mb-8 md:mb-12">
            <div className="relative">
              <div className="absolute -top-8 -left-8 md:-top-12 md:-left-12 w-16 h-16 md:w-24 md:h-24">
                <div className="w-full h-full bg-linear-to-br from-accent to-primary rounded-full blur-2xl opacity-40 animate-pulse"></div>
              </div>

              <div className="relative group cursor-pointer h-full w-full">
                <Image
                  unoptimized
                  src="/android-chrome-512x512.png"
                  alt="Logo"
                  width="200"
                  height="200"
                  className="transition-transform duration-1000 ease-in-out group-hover:rotate-360 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-[200px] lg:h-[200px]"
                />
              </div>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center mb-4">
            {siteConfig.short_description}
          </h2>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-muted/30">
        <div className="w-full max-w-md">
          <div className="mb-8 md:mb-12">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl sm:text-3xl font-bold text-foreground">{siteConfig.name}</span>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg">{siteConfig.description}</p>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <SignInWithCredentials />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">OR</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SignInWithGoogle />
              <SignInWithGitHub />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}