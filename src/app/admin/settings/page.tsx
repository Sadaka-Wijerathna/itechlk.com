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
    bankName1: "",
    bankBranch1: "",
    bankAccountName1: "",
    bankAccountNo1: "",
    bankName2: "",
    bankBranch2: "",
    bankAccountName2: "",
    bankAccountNo2: "",
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
      <div className="order__info" style={{ padding: '25px', background: '#fff', border: '1px solid #ebebeb' }}>
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
              {/* Bank Account 1 (Left Side) */}
              <div className="col-lg-6 mt-20">
                <div className="row">
                  <div className="col-lg-12 mb-10">
                    <h4 style={{ fontSize: 16, borderBottom: '1px solid #eaedff', paddingBottom: 8, color: '#111827', fontWeight: 600 }}>
                      Bank Account 1
                    </h4>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={settings.bankName1}
                        onChange={(e) => setSettings({ ...settings, bankName1: e.target.value })}
                        placeholder="People's Bank"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Branch</label>
                      <input
                        type="text"
                        value={settings.bankBranch1}
                        onChange={(e) => setSettings({ ...settings, bankBranch1: e.target.value })}
                        placeholder="Morawaka"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Account Name</label>
                      <input
                        type="text"
                        value={settings.bankAccountName1}
                        onChange={(e) => setSettings({ ...settings, bankAccountName1: e.target.value })}
                        placeholder="P.A.Indira Umanga"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Account Number</label>
                      <input
                        type="text"
                        value={settings.bankAccountNo1}
                        onChange={(e) => setSettings({ ...settings, bankAccountNo1: e.target.value })}
                        placeholder="060200160094469"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Account 2 (Right Side) */}
              <div className="col-lg-6 mt-20">
                <div className="row">
                  <div className="col-lg-12 mb-10">
                    <h4 style={{ fontSize: 16, borderBottom: '1px solid #eaedff', paddingBottom: 8, color: '#111827', fontWeight: 600 }}>
                      Bank Account 2
                    </h4>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Bank Name</label>
                      <input
                        type="text"
                        value={settings.bankName2}
                        onChange={(e) => setSettings({ ...settings, bankName2: e.target.value })}
                        placeholder="Bank of Ceylon (BOC)"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Branch</label>
                      <input
                        type="text"
                        value={settings.bankBranch2}
                        onChange={(e) => setSettings({ ...settings, bankBranch2: e.target.value })}
                        placeholder="Morawaka"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Account Name</label>
                      <input
                        type="text"
                        value={settings.bankAccountName2}
                        onChange={(e) => setSettings({ ...settings, bankAccountName2: e.target.value })}
                        placeholder="Anuhas P A I U"
                      />
                    </div>
                  </div>
                  
                  <div className="col-lg-6">
                    <div className="checkout-form-list mb-20">
                      <label>Account Number</label>
                      <input
                        type="text"
                        value={settings.bankAccountNo2}
                        onChange={(e) => setSettings({ ...settings, bankAccountNo2: e.target.value })}
                        placeholder="72790749"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-12 mt-20">
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
