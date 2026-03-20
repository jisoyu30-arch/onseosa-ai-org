"use client";

import { RoleChain } from "@/lib/types";
import { getRoleById } from "@/lib/pipelines";

interface RoleChainBadgeProps {
  roleChain: RoleChain;
  legalReview?: boolean;
  color?: string;
}

const CHAIN_LABELS = {
  creator: "작성",
  reviewer: "검토",
  approver: "승인",
  publisher: "배포",
};

export default function RoleChainBadge({ roleChain, legalReview, color = "#6366F1" }: RoleChainBadgeProps) {
  const steps = [
    { key: "creator" as const, roleId: roleChain.creator },
    { key: "reviewer" as const, roleId: roleChain.reviewer },
    ...(legalReview ? [{ key: "legal" as const, roleId: "법무리스크매니저" }] : []),
    { key: "approver" as const, roleId: roleChain.approver },
    { key: "publisher" as const, roleId: roleChain.publisher },
  ];

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {steps.map((step, i) => {
        const role = getRoleById(step.roleId);
        const label = step.key === "legal" ? "법무" : CHAIN_LABELS[step.key as keyof typeof CHAIN_LABELS];

        return (
          <div key={step.key} className="flex items-center gap-1">
            <div className="flex flex-col items-center">
              <span
                className="px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: `${color}20`,
                  color: step.key === "legal" ? "#EAB308" : color,
                  border: step.key === "legal" ? "1px solid #EAB30840" : "none",
                }}
              >
                {role?.icon} {role?.name || step.roleId}
              </span>
              <span className="text-[8px] text-gray-500 mt-0.5">{label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-gray-600 text-[10px] mx-0.5">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
