"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import ChangePasswordForm from '../forms/change-password-form';
import { useSession, signOut } from 'next-auth/react';
import { useGeoLocation } from '@/hooks/use-geo-location';

const COUNTRY_DATA = [
  { name: "Afghanistan", code: "+93" }, { name: "Albania", code: "+355" }, { name: "Algeria", code: "+213" },
  { name: "Andorra", code: "+376" }, { name: "Angola", code: "+244" }, { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" }, { name: "Australia", code: "+61" }, { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" }, { name: "Bahamas", code: "+1" }, { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" }, { name: "Belarus", code: "+375" }, { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" }, { name: "Benin", code: "+229" }, { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" }, { name: "Bosnia and Herzegovina", code: "+387" }, { name: "Botswana", code: "+267" },
  { name: "Brazil", code: "+55" }, { name: "Brunei", code: "+673" }, { name: "Bulgaria", code: "+359" },
  { name: "Burundi", code: "+257" }, { name: "Cambodia", code: "+855" }, { name: "Cameroon", code: "+237" },
  { name: "Canada", code: "+1" }, { name: "Chile", code: "+56" }, { name: "China", code: "+86" },
  { name: "Colombia", code: "+57" }, { name: "Costa Rica", code: "+506" }, { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" }, { name: "Cyprus", code: "+357" }, { name: "Czechia", code: "+420" },
  { name: "Denmark", code: "+45" }, { name: "Dominican Republic", code: "+1" }, { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" }, { name: "El Salvador", code: "+503" }, { name: "Estonia", code: "+372" },
  { name: "Ethiopia", code: "+251" }, { name: "Fiji", code: "+679" }, { name: "Finland", code: "+358" },
  { name: "France", code: "+33" }, { name: "Georgia", code: "+995" }, { name: "Germany", code: "+49" },
  { name: "Ghana", code: "+233" }, { name: "Greece", code: "+30" }, { name: "Guatemala", code: "+502" },
  { name: "Haiti", code: "+509" }, { name: "Honduras", code: "+504" }, { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" }, { name: "Iceland", code: "+354" }, { name: "India", code: "+91" },
  { name: "Indonesia", code: "+62" }, { name: "Iran", code: "+98" }, { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" }, { name: "Israel", code: "+972" }, { name: "Italy", code: "+39" },
  { name: "Jamaica", code: "+1" }, { name: "Japan", code: "+81" }, { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" }, { name: "Kenya", code: "+254" }, { name: "Kuwait", code: "+965" },
  { name: "Laos", code: "+856" }, { name: "Latvia", code: "+371" }, { name: "Lebanon", code: "+961" },
  { name: "Libya", code: "+218" }, { name: "Liechtenstein", code: "+423" }, { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" }, { name: "Macao", code: "+853" }, { name: "Madagascar", code: "+261" },
  { name: "Malaysia", code: "+60" }, { name: "Maldives", code: "+960" }, { name: "Malta", code: "+356" },
  { name: "Mexico", code: "+52" }, { name: "Moldova", code: "+373" }, { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" }, { name: "Montenegro", code: "+382" }, { name: "Morocco", code: "+212" },
  { name: "Myanmar", code: "+95" }, { name: "Nepal", code: "+977" }, { name: "Netherlands", code: "+31" },
  { name: "New Zealand", code: "+64" }, { name: "Nicaragua", code: "+505" }, { name: "Nigeria", code: "+234" },
  { name: "Norway", code: "+47" }, { name: "Oman", code: "+968" }, { name: "Pakistan", code: "+92" },
  { name: "Panama", code: "+507" }, { name: "Paraguay", code: "+595" }, { name: "Peru", code: "+51" },
  { name: "Philippines", code: "+63" }, { name: "Poland", code: "+48" }, { name: "Portugal", code: "+351" },
  { name: "Qatar", code: "+974" }, { name: "Romania", code: "+40" }, { name: "Russia", code: "+7" },
  { name: "Saudi Arabia", code: "+966" }, { name: "Serbia", code: "+381" }, { name: "Singapore", code: "+65" },
  { name: "Slovakia", code: "+421" }, { name: "Slovenia", code: "+386" }, { name: "South Africa", code: "+27" },
  { name: "South Korea", code: "+82" }, { name: "Spain", code: "+34" }, { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" }, { name: "Sweden", code: "+46" }, { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" }, { name: "Taiwan", code: "+886" }, { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" }, { name: "Thailand", code: "+66" }, { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" }, { name: "Uganda", code: "+256" }, { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" }, { name: "United Kingdom", code: "+44" },
  { name: "United States", code: "+1" }, { name: "Uruguay", code: "+598" }, { name: "Uzbekistan", code: "+998" },
  { name: "Venezuela", code: "+58" }, { name: "Vietnam", code: "+84" }, { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" }, { name: "Zimbabwe", code: "+263" }
];

const ProfileMenuArea = () => {
  const { data: session, update } = useSession();
  const { geo } = useGeoLocation();
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    country: '',
    phoneCode: '',
    phone: ''
  });

  const handleCountryChange = (countryName: string) => {
    const country = COUNTRY_DATA.find(c => c.name === countryName);
    setFormData(prev => ({
      ...prev,
      country: countryName,
      phoneCode: country ? country.code : prev.phoneCode
    }));
  };

  useEffect(() => {
    if (session?.user) {
      const dbFirstName = (session.user as any).firstName;
      const dbLastName = (session.user as any).lastName;
      const fullName = session.user.name || "";
      const savedCountry = (session.user as any).country || '';
      const savedPhoneCode = (session.user as any).phoneCode || '';

      setFormData({
        firstName: dbFirstName || fullName.split(' ')[0] || '',
        lastName: dbLastName || fullName.split(' ').slice(1).join(' ') || '',
        // Use saved values first; fall back to geo-detected values
        country: savedCountry || (geo?.countryName ?? ''),
        phoneCode: savedPhoneCode || (geo?.callingCode ?? ''),
        phone: (session.user as any).phone || ''
      });

      setLoadingOrders(true);
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setOrders(data);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    }
  }, [session, geo]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        await update(); // Update session
        alert("Profile updated successfully!");
        // Close modal using bootstrap
        const modal = document.getElementById('profile_edit_modal');
        if (modal) {
          const bootstrap = (window as any).bootstrap;
          if (bootstrap) {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
          }
        }
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile");
    }
    setSaving(false);
  };

  const downloadInvoice = (order: any, item: any) => {
    const content = `ITechLK eCommerce Invoice\n------------------------------------------------\nOrder ID: ${order.id}\nDate: ${new Date(order.createdAt).toLocaleDateString()}\nStatus: ${order.status}\n\nBilled To:\n${order.firstName} ${order.lastName}\n${order.email} | ${order.phone}\nCountry: ${order.country}\n\nProduct: ${item.title}\nQuantity: ${item.quantity}\nPrice: $${item.price.toFixed(2)}\n\nOrder Total: $${order.totalAmount.toFixed(2)}\n------------------------------------------------\nThank you for your purchase!`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${order.id.slice(-6)}_${item.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="profile__menu pb-70 bg-white">
        <div className="container">
          <div className="row">
            <div className="col-xxl-4 col-md-4">
              <div className="profile__menu-left bg-white mb-50">
                <div className="profile__menu-tab">
                  <div className="nav nav-tabs flex-column justify-content-start text-start" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-account-tab" data-bs-toggle="tab" data-bs-target="#nav-account" type="button" role="tab" aria-controls="nav-account" aria-selected="true"> <i className="fa fa-user"></i> My Account </button>

                    <button className="nav-link" id="nav-order-tab" data-bs-toggle="tab" data-bs-target="#nav-order" type="button" role="tab" aria-controls="nav-order" aria-selected="false"><i className="fa fa-file"></i> Orders </button>

                    {(session?.user as any)?.provider !== 'google' && (
                      <button className="nav-link" id="nav-password-tab" data-bs-toggle="tab" data-bs-target="#nav-password" type="button" role="tab" aria-controls="nav-password" aria-selected="false"><i className="fa fa-lock"></i>Change Password</button>
                    )}

                    <button className="nav-link logout-link" onClick={() => signOut({ callbackUrl: '/' })}><i className="fa fa-sign-out"></i> Logout</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-8 col-md-8">
              <div className="profile__menu-right">
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-account" role="tabpanel" aria-labelledby="nav-account-tab">
                    <div className="profile__info">
                      <div className="profile__info-top d-flex justify-content-between align-items-center">
                        <h3 className="profile__info-title">Profile Information</h3>
                        <button className="profile__info-btn" type="button" data-bs-toggle="modal"
                          data-bs-target="#profile_edit_modal" style={{ borderRadius: 0 }}>
                          <i className="fa-regular fa-pen-to-square"></i>
                          Edit Profile
                        </button>
                      </div>

                  <div className="profile__info-wrapper white-bg">
                    <div className="row g-0">
                      <div className="col-md-6">
                        <div className="profile__info-item">
                          <p>First Name</p>
                          <h4>
                            {(session?.user as any)?.firstName || 
                             (session?.user?.name ? session.user.name.split(' ')[0] : "Not provided")}
                          </h4>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="profile__info-item">
                          <p>Last Name</p>
                          <h4>
                            {(session?.user as any)?.lastName || 
                             (session?.user?.name ? session.user.name.split(' ').slice(1).join(' ') : "Not provided")}
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile__info-item" style={{ borderTop: '1px solid #eaedff' }}>
                      <p>Email</p>
                      <h4>{session?.user?.email || "Not provided"}</h4>
                    </div>
                    <div className="profile__info-item">
                      <p>Country</p>
                      <h4>{(session?.user as any)?.country || "Not provided"}</h4>
                    </div>
                    <div className="profile__info-item">
                      <p>Phone</p>
                      <h4>{((session?.user as any)?.phoneCode || "") + " " + ((session?.user as any)?.phone || "Not provided")}</h4>
                    </div>
                    <div className="profile__info-item">
                      <p>Role</p>
                      <h4>{(session?.user as any)?.role || "Customer"}</h4>
                    </div>
                    <div className="profile__info-item">
                      <p>Status</p>
                      <h4>Active</h4>
                    </div>
                  </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="nav-order" role="tabpanel" aria-labelledby="nav-order-tab">
                    <div className="order__info">
                      <div className="order__info-top d-flex justify-content-between align-items-center">
                        <h3 className="order__info-title">My Orders</h3>
                        <button type="button" className="order__info-btn">
                          <i className="fa-regular fa-trash-can"></i> Clear
                        </button>
                      </div>

                      <div className="order__list white-bg table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th scope="col">Order ID</th>
                              <th scope="col">Products</th>
                              <th scope="col">Price</th>
                              <th scope="col">Status</th>
                              <th scope="col">Invoice</th>
                            </tr>
                          </thead>
                          <tbody>
                            {loadingOrders ? (
                              <tr><td colSpan={5} className="text-center py-4">Loading orders...</td></tr>
                            ) : orders.length === 0 ? (
                              <tr><td colSpan={5} className="text-center py-4">No orders found.</td></tr>
                            ) : (
                              orders.map(order => (
                                <tr key={order.id}>
                                  <td className="order__id">#{order.id.slice(-6).toUpperCase()}</td>
                                  <td>
                                    {order.items.map((item: any, i: number) => (
                                      <div key={i} className="mb-1" style={{ fontSize: '14px', color: '#111' }}>
                                        {item.title} <span style={{ color: '#6b7280' }}>x{item.quantity}</span>
                                      </div>
                                    ))}
                                  </td>
                                  <td>${order.totalAmount.toFixed(2)}</td>
                                  <td>
                                    <span style={{
                                      padding: '4px 10px',
                                      borderRadius: '20px',
                                      fontSize: '12px',
                                      fontWeight: 'bold',
                                      backgroundColor: order.status === 'Confirmed' ? '#dcfce7' : order.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                                      color: order.status === 'Confirmed' ? '#166534' : order.status === 'Rejected' ? '#991b1b' : '#92400e'
                                    }}>
                                      {order.status}
                                    </span>
                                  </td>
                                  <td>
                                    {order.items.map((item: any, i: number) => (
                                      <div key={i} className="mb-1">
                                        <button
                                          onClick={() => downloadInvoice(order, item)}
                                          style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            margin: 0,
                                            color: '#198754',
                                            fontWeight: '500',
                                            cursor: 'pointer',
                                            fontSize: '14px'
                                          }}
                                        >
                                          Download
                                        </button>
                                      </div>
                                    ))}
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="nav-password" role="tabpanel" aria-labelledby="nav-password-tab">
                    <div className="password__change">
                      <div className="password__change-top">
                        <h3 className="password__change-title">Change Password</h3>
                      </div>
                      <div className="password__form white-bg">
                        <ChangePasswordForm />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

  <div className="modal fade" id="profile_edit_modal" tabIndex={-1} aria-labelledby="profile_edit_modal" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content" style={{ borderRadius: 0 }}>
        <div className="profile__edit-wrapper p-30">
          <div className="profile__edit-close text-end mb-20">
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <h3 className="profile__edit-title text-center mb-30">Edit Profile</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="row">
              <div className="col-md-6">
                <div className="profile__edit-input mb-20">
                  <div className="checkout-form-list">
                    <label>First Name</label>
                    <input 
                      type="text" 
                      value={formData.firstName} 
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                      placeholder="First Name" 
                      required 
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="profile__edit-input mb-20">
                  <div className="checkout-form-list">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      value={formData.lastName} 
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                      placeholder="Last Name" 
                      required 
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile__edit-input mb-30">
              <div className="country-select">
                <label>Country <span className="required">*</span></label>
                <select 
                  className="w-100"
                  value={formData.country} 
                  onChange={(e) => handleCountryChange(e.target.value)}
                  required
                  style={{ height: '50px', border: '1px solid #eaedff', padding: '0 20px', borderRadius: '0', outline: 'none' }}
                >
                  <option value="">-- Select Country --</option>
                  {COUNTRY_DATA.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="profile__edit-input mb-30">
              <div className="checkout-form-list">
                <label>WhatsApp Number <span className="required">*</span></label>
                <div className="d-flex gap-3">
                  <div style={{ flex: '0 0 100px' }}>
                    <input 
                      type="text" 
                      value={formData.phoneCode} 
                      onChange={(e) => setFormData({...formData, phoneCode: e.target.value})} 
                      placeholder="+1" 
                      required 
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <input 
                      type="text" 
                      value={formData.phone} 
                      onChange={(e) => setFormData({...formData, phone: e.target.value})} 
                      placeholder="Number"
                      required 
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="profile__edit-btn mt-10">
              <button type="submit" className="os-btn os-btn-black w-100" disabled={saving} style={{ borderRadius: 0 }}>
                {saving ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </>
  );
};

export default ProfileMenuArea;