"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useEffect, useState } from "react";
import Link from "next/link";

function Logo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <div
        style={{
          width: "28px",
          height: "28px",
          background: "var(--accent)",
          borderRadius: "7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
          <path
            d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z"
            fill="white"
            fillOpacity="0.9"
          />
          <circle cx="8" cy="9" r="3" fill="var(--accent)" />
        </svg>
      </div>
      <span
        style={{
          fontWeight: 700,
          fontSize: "16px",
          letterSpacing: "-0.03em",
          color: "var(--accent)",
        }}
      >
        FaceGate
      </span>
    </div>
  );
}

export default function Dashboard() {
  const { ready, authenticated, user, login, logout, getAccessToken } =
    usePrivy();
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [appName, setAppName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (authenticated) fetchApiKey();
  }, [authenticated]);

  const fetchApiKey = async () => {
    try {
      const token = await getAccessToken();
      if (!token) return;
      const res = await fetch("/api/keys", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.apiKey) setApiKey(data.apiKey);
    } catch (e) {}
  };

  const generateKey = async () => {
    if (!appName.trim()) return;
    setLoading(true);
    try {
      const token = await getAccessToken();
      const res = await fetch("/api/keys", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ appName }),
      });
      const data = await res.json();
      if (data.apiKey) setApiKey(data.apiKey);
    } catch (e) {}
    setLoading(false);
  };

  const copyKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!ready)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
          Loading...
        </div>
      </div>
    );

  if (!authenticated)
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--bg)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <nav
          style={{
            padding: "0 32px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <Link href="/">
            <Logo />
          </Link>
        </nav>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "48px",
              width: "100%",
              maxWidth: "400px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "var(--accent)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}
            >
              <svg width="22" height="24" viewBox="0 0 16 18" fill="none">
                <path
                  d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z"
                  fill="white"
                />
                <circle cx="8" cy="9" r="3" fill="var(--accent)" />
              </svg>
            </div>
            <h2
              style={{
                fontSize: "22px",
                fontWeight: "700",
                letterSpacing: "-0.03em",
                marginBottom: "8px",
              }}
            >
              Welcome to FaceGate
            </h2>
            <p
              style={{
                fontSize: "14px",
                color: "var(--text-secondary)",
                marginBottom: "32px",
                lineHeight: "1.6",
              }}
            >
              Sign in to get your API key and start protecting your subscription
              from credential sharing.
            </p>
            <button
              onClick={login}
              style={{
                width: "100%",
                background: "var(--accent)",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "var(--radius-sm)",
                fontSize: "15px",
                fontWeight: "600",
                letterSpacing: "-0.01em",
              }}
            >
              Sign in with Google
            </button>
            <p
              style={{
                fontSize: "12px",
                color: "var(--text-muted)",
                marginTop: "16px",
              }}
            >
              Free during ETHOnline 2026
            </p>
          </div>
        </div>
      </div>
    );

  const navItems = [
    { id: "overview", label: "Overview", icon: "▦" },
    { id: "apikey", label: "API Key", icon: "⚿" },
    { id: "integrate", label: "Integration", icon: "⌥" },
    { id: "docs", label: "Docs", icon: "⊞" },
  ];

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", background: "var(--bg)" }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "220px",
          flexShrink: 0,
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          display: "flex",
          flexDirection: "column",
          padding: "0",
        }}
      >
        {/* Brand */}
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <Link href="/">
            <Logo />
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ padding: "12px 10px", flex: 1 }}>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background:
                  activeTab === item.id ? "var(--accent-light)" : "transparent",
                color:
                  activeTab === item.id
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: activeTab === item.id ? "600" : "400",
                cursor: "pointer",
                textAlign: "left",
                marginBottom: "2px",
              }}
            >
              <span style={{ fontSize: "16px", opacity: 0.7 }}>
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User footer */}
        <div
          style={{
            padding: "16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginBottom: "8px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user?.email?.address || user?.google?.email || "Developer"}
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-secondary)",
              padding: "6px 12px",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {/* Topbar */}
        <div
          style={{
            padding: "0 32px",
            height: "56px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid var(--border)",
            background: "var(--surface)",
          }}
        >
          <h1
            style={{
              fontSize: "16px",
              fontWeight: "600",
              letterSpacing: "-0.02em",
            }}
          >
            {navItems.find((n) => n.id === activeTab)?.label}
          </h1>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              color: "var(--success)",
              fontWeight: "500",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--success)",
                display: "inline-block",
              }}
            />
            Active
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: "32px" }}>
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                Welcome back. Here's your FaceGate status.
              </p>

              {/* Stats */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "16px",
                  marginBottom: "32px",
                }}
              >
                {[
                  {
                    label: "API Status",
                    value: apiKey ? "Active" : "No key yet",
                    color: apiKey ? "var(--success)" : "var(--text-muted)",
                  },
                  {
                    label: "Enrollments",
                    value: "—",
                    color: "var(--text-primary)",
                  },
                  {
                    label: "Blocked attempts",
                    value: "—",
                    color: "var(--text-primary)",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      {stat.label}
                    </div>
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        letterSpacing: "-0.02em",
                        color: stat.color,
                      }}
                    >
                      {stat.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick start */}
              {!apiKey && (
                <div
                  style={{
                    background: "var(--accent-light)",
                    border: "1px solid var(--accent)",
                    borderRadius: "var(--radius-md)",
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: "600",
                        color: "var(--accent)",
                        marginBottom: "4px",
                      }}
                    >
                      Get your API key
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Generate your key to start protecting subscriptions
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab("apikey")}
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      padding: "8px 20px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: "pointer",
                    }}
                  >
                    Generate →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* API KEY TAB */}
          {activeTab === "apikey" && (
            <div style={{ maxWidth: "580px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                Your API key authenticates requests to FaceGate. Keep it secret.
              </p>

              {!apiKey ? (
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-md)",
                    padding: "28px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "600",
                      marginBottom: "16px",
                    }}
                  >
                    Generate API Key
                  </div>
                  <div style={{ marginBottom: "16px" }}>
                    <label
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        marginBottom: "6px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      App name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. StreamVault, MyApp"
                      value={appName}
                      onChange={(e) => setAppName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        border: "1px solid var(--border)",
                        fontSize: "14px",
                        outline: "none",
                        background: "var(--bg)",
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    />
                  </div>
                  <button
                    onClick={generateKey}
                    disabled={loading || !appName.trim()}
                    style={{
                      background: appName.trim()
                        ? "var(--accent)"
                        : "var(--border)",
                      color: appName.trim() ? "#fff" : "var(--text-muted)",
                      border: "none",
                      padding: "10px 24px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "14px",
                      fontWeight: "600",
                      cursor: appName.trim() ? "pointer" : "not-allowed",
                    }}
                  >
                    {loading ? "Generating..." : "Generate API Key"}
                  </button>
                </div>
              ) : (
                <div>
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "24px",
                      marginBottom: "16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        marginBottom: "8px",
                      }}
                    >
                      Your API Key
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <code
                        style={{
                          flex: 1,
                          fontFamily: "var(--font-mono)",
                          fontSize: "14px",
                          background: "var(--bg)",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {apiKey}
                      </code>
                      <button
                        onClick={copyKey}
                        style={{
                          background: copied
                            ? "var(--success)"
                            : "var(--accent)",
                          color: "#fff",
                          border: "none",
                          padding: "10px 16px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "13px",
                          fontWeight: "600",
                          cursor: "pointer",
                          flexShrink: 0,
                          transition: "background 0.2s",
                        }}
                      >
                        {copied ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--danger-light)",
                      border: "1px solid rgba(220,38,38,0.2)",
                      borderRadius: "var(--radius-sm)",
                      padding: "12px 16px",
                      fontSize: "13px",
                      color: "var(--danger)",
                    }}
                  >
                    Keep this key secret. Never expose it in frontend code.
                  </div>
                  <button
                    onClick={async () => {
                      if (
                        !confirm(
                          "Are you sure? Your old API key will stop working immediately.",
                        )
                      )
                        return;
                      setLoading(true);
                      try {
                        const token = await getAccessToken();
                        const res = await fetch("/api/keys", {
                          method: "DELETE",
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ appName: "default" }),
                        });
                        const data = await res.json();
                        if (data.apiKey) setApiKey(data.apiKey);
                      } catch (e) {}
                      setLoading(false);
                    }}
                    style={{
                      background: "transparent",
                      color: "var(--danger)",
                      border: "1px solid rgba(220,38,38,0.3)",
                      padding: "8px 16px",
                      borderRadius: "var(--radius-sm)",
                      fontSize: "13px",
                      fontWeight: "500",
                      cursor: "pointer",
                      marginTop: "12px",
                      width: "100%",
                    }}
                  >
                    ⚠ Rotate API Key
                  </button>
                </div>
              )}
            </div>
          )}

          {/* INTEGRATION TAB */}
          {activeTab === "integrate" && (
            <div style={{ maxWidth: "640px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                Add FaceGate to your app in minutes.
              </p>

              {[
                {
                  step: "1",
                  title: "Install the SDK",
                  code: "npm install @facegate/sdk",
                },
                {
                  step: "2",
                  title: "Initialize FaceGate",
                  code: `import { FaceGate } from '@facegate/sdk'\n\nconst gate = new FaceGate({\n  apiKey: '${apiKey || "fg_live_xxx"}'\n})`,
                },
                {
                  step: "3",
                  title: "Enroll on first login",
                  code: `// When user signs up\nawait gate.enroll(userId)`,
                },
                {
                  step: "4",
                  title: "Verify on every login",
                  code: `// On every login attempt\nconst result = await gate.verify(userId)\nif (!result.authorized) {\n  throw new Error('Face not recognized')\n}`,
                },
              ].map((item) => (
                <div
                  key={item.step}
                  style={{
                    display: "flex",
                    gap: "16px",
                    marginBottom: "24px",
                  }}
                >
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "var(--accent)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontSize: "13px",
                      fontWeight: "700",
                      color: "#fff",
                      marginTop: "2px",
                    }}
                  >
                    {item.step}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: "600",
                        marginBottom: "8px",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        background: "var(--code-bg)",
                        borderRadius: "var(--radius-sm)",
                        padding: "14px 16px",
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: "#E5E7EB",
                        lineHeight: "1.8",
                        whiteSpace: "pre",
                      }}
                    >
                      {item.code}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DOCS TAB */}
          {activeTab === "docs" && (
            <div style={{ maxWidth: "580px" }}>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  marginBottom: "28px",
                }}
              >
                Everything you need to integrate FaceGate.
              </p>
              {[
                {
                  title: "GitHub Repository",
                  desc: "Source code, issues, and contributions",
                  href: "https://github.com/omsant02/FaceGate",
                },
                {
                  title: "npm Package",
                  desc: "@facegate/sdk — install and integrate",
                  href: "https://npmjs.com/package/@facegate/sdk",
                },
                {
                  title: "World ID Selfie Check",
                  desc: "How the underlying verification works",
                  href: "https://docs.world.org/world-id/credentials/11",
                },
              ].map((doc) => (
                <a
                  key={doc.title}
                  href={doc.href}
                  target="_blank"
                  style={{ textDecoration: "none" }}
                >
                  <div
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-md)",
                      padding: "18px 20px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: "600",
                          color: "var(--text-primary)",
                          marginBottom: "3px",
                        }}
                      >
                        {doc.title}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {doc.desc}
                      </div>
                    </div>
                    <span
                      style={{ color: "var(--text-muted)", fontSize: "18px" }}
                    >
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
