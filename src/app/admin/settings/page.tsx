"use client";

import AdminShell from "../AdminShell";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    whatsappNumber: "+94742570943",
    telegramChatIds: "",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setSettings((prev) => ({ ...prev, ...data }));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error("Failed to save settings.");
      }
    } catch {
      toast.error("Error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminShell>
        <div className="text-center py-5">
          <i className="fa fa-spin fa-spinner fa-2x"></i>
          <p className="mt-3">Loading settings…</p>
        </div>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="password__change">
        <div className="password__change-top">
          <h3 className="password__change-title">
            <i className="fa fa-cog"></i> Store Settings
          </h3>
        </div>

        <div className="password__form white-bg">
          <form onSubmit={handleSave}>
            <div className="row">

              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>WhatsApp Number</label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    placeholder="+94742570943"
                  />
                  <small style={{ color: "#6b7280", fontSize: 12, marginTop: 4, display: "block" }}>
                    Include country code, e.g. +94742570943.
                  </small>
                </div>
              </div>

              {/* Telegram IDs */}
              <div className="col-lg-6">
                <div className="checkout-form-list mb-20">
                  <label>Telegram Admin IDs</label>
                  <input
                    type="text"
                    value={settings.telegramChatIds}
                    onChange={(e) => setSettings({ ...settings, telegramChatIds: e.target.value })}
                    placeholder="e.g. 12345678, 87654321"
                  />
                  <small style={{ color: "#6b7280", fontSize: 12, marginTop: 4, display: "block" }}>
                    Separate multiple IDs with commas. These IDs will receive order notifications.
                  </small>
                </div>
              </div>


              <div className="col-lg-12">
                <div className="checkout-form-list">
                  <button
                    type="submit"
                    disabled={saving}
                    className="os-btn os-btn-black"
                    style={{ borderRadius: 0 }}
                  >
                    {saving ? (
                      <><i className="fa fa-spin fa-spinner"></i> Saving…</>
                    ) : (
                      "Save Settings"
                    )}
                  </button>
                </div>
              </div>

            </div>
          </form>
        </div>
      </div>
    </AdminShell>
  );
}
