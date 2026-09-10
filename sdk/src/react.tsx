import React, { useEffect, useState } from "react";
import { IDKitRequestWidget, selfieCheckLegacy } from "@worldcoin/idkit";
import { FaceGate } from "./index";

interface FaceGateWidgetProps {
  apiKey: string;
  userId: string;
  onSuccess: () => void;
  onBlocked?: () => void;
  onError?: (error: string) => void;
  baseUrl?: string;
}

export function FaceGateWidget({
  apiKey,
  userId,
  onSuccess,
  onBlocked,
  onError,
  baseUrl,
}: FaceGateWidgetProps) {
  const [enrollData, setEnrollData] = useState<any>(null);
  const [mode, setMode] = useState<"loading" | "ready" | "error">("loading");
  const [isEnrolling, setIsEnrolling] = useState(false);

  const gate = React.useMemo(
    () => new FaceGate({ apiKey, baseUrl }),
    [apiKey, baseUrl],
  );

  useEffect(() => {
    const init = async () => {
      try {
        const data = await gate.enroll(userId);
        setEnrollData(data);
        setIsEnrolling(!data.enrolled);
        setMode("ready");
      } catch (e) {
        setMode("error");
        onError?.("Failed to initialize FaceGate");
      }
    };
    init();
  }, [userId, apiKey]);

  const handleVerify = async (proof: unknown) => {
    try {
      if (isEnrolling) {
        const result = await gate.confirm(userId, proof);
        if (!result.success) throw new Error("Enrollment failed");
      } else {
        const result = await gate.verify(userId, proof);
        if (!result.authorized) {
          onBlocked?.();
          throw new Error("Face not recognized");
        }
      }
    } catch (e: any) {
      if (e.message === "Face not recognized") throw e;
      onError?.(e.message);
      throw e;
    }
  };

  if (mode === "loading") {
    return React.createElement(
      "div",
      { style: { textAlign: "center", color: "#888", fontSize: "14px" } },
      "Initializing FaceGate...",
    );
  }

  if (mode === "error") {
    return React.createElement(
      "div",
      { style: { textAlign: "center", color: "#f87171", fontSize: "14px" } },
      "FaceGate initialization failed",
    );
  }

  if (!enrollData?.appId) return null;

  return React.createElement(IDKitRequestWidget, {
    open: true,
    onOpenChange: () => {},
    app_id: enrollData.appId,
    action: enrollData.action,
    rp_context: enrollData.rpContext,
    allow_legacy_proofs: true,
    preset: selfieCheckLegacy({}),
    handleVerify: handleVerify,
    onSuccess: onSuccess,
    environment: "sandbox",
  });
}
