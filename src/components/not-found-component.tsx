"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Custom404() {
  const router = useRouter();
  const [progress, setProgress] = useState(100);
  const REDIRECT_TIME = 5000; // 5초로 변경
  const INTERVAL_TIME = 50; // 50ms마다 업데이트

  useEffect(() => {
    const startTime = Date.now();

    const progressInterval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const remainingProgress = Math.max(
        0,
        100 - (elapsedTime / REDIRECT_TIME) * 100
      );
      setProgress(remainingProgress);
    }, INTERVAL_TIME);

    const redirectTimer = setTimeout(() => {
      router.push("/");
    }, REDIRECT_TIME);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(progressInterval);
    };
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404 - 페이지를 찾을 수 없습니다</h1>
      <p className="mt-4">
        {Math.ceil(progress / 20)}초 후 메인 페이지로 이동합니다...
      </p>
      <div className="w-64 h-2 bg-gray-200 rounded-full mt-4 overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-50 ease-linear"
          style={{
            width: `${progress}%`,
            transition: "width 50ms linear",
          }}
        />
      </div>
    </div>
  );
}
