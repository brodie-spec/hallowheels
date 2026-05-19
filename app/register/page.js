'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const MOBILITY_DEVICES = [
  'Wheelchair',
  'Power Wheelchair',
  'Adaptive Bike',
  'Walker',
  'Adaptive Stroller',
  'Other',
]

const RELATIONSHIPS = ['Parent', 'Legal Guardian', 'Other']

const EVENTS = [
  { id: 'hampton-roads', label: 'Hampton Roads (Oct 24, VA Beach)' },
  { id: 'roanoke',       label: 'Roanoke (Oct 24, Salem)' },
  { id: 'richmond',      label: 'Richmond (Oct 24)' },
  { id: 'not-attending', label: 'Not Attending In Person' },
]

const DISCLOSURES = [
  'Name',
  'Age',
  'City of Residence',
  'Nature of Disability',
  'Treatment Information',
  'None',
]

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming',
  'Washington D.C.',
]

function buildJotFormUrl(form) {
  const base = 'https://www.jotform.com/261384252662054'
  const phoneDigits = form.phone.replace(/\D/g, '')
  const params = new URLSearchParams()
  params.set('i[first]', form.parentFirstName)
  params.set('i[last]', form.parentLastName)
  params.set('residingAt[addr_line1]', form.streetAddress)
  params.set('residingAt[city]', form.city)
  params.set('residingAt[state]', form.state)
  params.set('residingAt[postal]', form.zipCode)
  params.set('childsFull[first]', form.childFirstName)
  params.set('childsFull[last]', form.childLastName)
  if (form.disclosures.length > 0) params.set('iAuthorize', form.disclosures.join(','))
  params.set('parentguardianPrint[first]', form.parentFirstName)
  params.set('parentguardianPrint[last]', form.parentLastName)
  params.set('relationship', form.relationship)
  params.set('phoneNumber[full]', phoneDigits)
  params.set('email', form.email)
  return `${base}?${params.toString()}`
}

function validate(form) {
  const e = {}
  if (!form.childFirstName.trim())  e.childFirstName  = "Child's first name is required"
  if (!form.childLastName.trim())   e.childLastName   = "Child's last name is required"
  if (!form.costumeName.trim())     e.costumeName     = 'Costume name is required'
  if (!form.mobilityDevice)         e.mobilityDevice  = 'Please select a mobility device type'
  if (!form.parentFirstName.trim()) e.parentFirstName = 'First name is required'
  if (!form.parentLastName.trim())  e.parentLastName  = 'Last name is required'
  if (!form.relationship)           e.relationship    = 'Please select your relationship to the child'
  if (!form.streetAddress.trim())   e.streetAddress   = 'Street address is required'
  if (!form.city.trim())            e.city            = 'City is required'
  if (!form.state)                  e.state           = 'State is required'
  if (!form.zipCode.trim()) {
    e.zipCode = 'Zip code is required'
  } else if (!/^\d{5}(-\d{4})?$/.test(form.zipCode.trim())) {
    e.zipCode = 'Enter a valid 5-digit zip code'
  }
  if (!form.phone.trim()) {
    e.phone = 'Phone number is required'
  } else if (form.phone.replace(/\D/g, '').length < 10) {
    e.phone = 'Enter a valid 10-digit phone number'
  }
  if (!form.email.trim()) {
    e.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    e.email = 'Enter a valid email address'
  }
  return e
}

// Defined outside RegisterPage to avoid recreation on every render
function FormField({ id, label, required, hint, error, children }) {
  return (
    <div className={`reg-field${error ? ' reg-field--error' : ''}`}>
      <label htmlFor={id} className="reg-label">
        {label}
        {required && <span className="reg-required" aria-hidden="true"> *</span>}
      </label>
      {hint && <p className="reg-hint">{hint}</p>}
      {children}
      {error && (
        <p className="reg-error-msg" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}

export default function RegisterPage() {
  const [form, setForm] = useState({
    childFirstName: '',
    childLastName:  '',
    costumeName:    '',
    mobilityDevice: '',
    parentFirstName: '',
    parentLastName:  '',
    relationship:    '',
    streetAddress:   '',
    city:            '',
    state:           'Virginia',
    zipCode:         '',
    phone:           '',
    email:           '',
    events:          [],
    disclosures:     [],
  })
  const [errors, setErrors]       = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  function setField(name, value) {
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }))
  }

  function toggleCheck(name, value) {
    setForm(prev => {
      const arr = prev[name]
      return {
        ...prev,
        [name]: arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value],
      }
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      const count = Object.keys(errs).length
      setSubmitError(`Please fix ${count} error${count !== 1 ? 's' : ''} above before continuing.`)
      document.getElementById(`reg-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    setErrors({})
    setSubmitError('')
    setSubmitting(true)

    // Best-effort save — don't block redirect on failure
    try {
      await supabase.from('registrations').insert({
        child_first_name:  form.childFirstName,
        child_last_name:   form.childLastName,
        costume_name:      form.costumeName,
        mobility_device:   form.mobilityDevice,
        parent_first_name: form.parentFirstName,
        parent_last_name:  form.parentLastName,
        relationship:      form.relationship,
        street_address:    form.streetAddress,
        city:              form.city,
        state:             form.state,
        zip_code:          form.zipCode,
        phone:             form.phone,
        email:             form.email,
        events:            form.events,
        disclosures:       form.disclosures,
        year:              2026,
      })
    } catch (err) {
      console.error('[Register] Supabase insert error:', err)
    }

    window.location.href = buildJotFormUrl(form)
  }

  return (
    <>
      <style>{`
        /* ── Hero ── */
        .reg-hero {
          background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 60%, var(--navy-light) 100%);
          padding: 140px 24px 72px;
          text-align: center;
        }
        .reg-hero h1 { color: var(--white); margin-bottom: 20px; }
        .reg-hero h1 span { color: var(--yellow); }
        .reg-hero > .container > p {
          color: rgba(255,255,255,0.82);
          max-width: 560px;
          margin: 0 auto;
          font-size: 1.05rem;
          line-height: 1.75;
        }

        /* ── Progress stepper ── */
        .reg-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 36px;
        }
        .reg-step {
          display: flex;
          align-items: center;
          gap: 9px;
        }
        .reg-step-bubble {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.85rem;
          flex-shrink: 0;
        }
        .reg-step-bubble--active  { background: var(--orange); color: var(--white); }
        .reg-step-bubble--pending { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.45); }
        .reg-step-label {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
        }
        .reg-step-label--active  { color: var(--white); }
        .reg-step-label--pending { color: rgba(255,255,255,0.4); }
        .reg-step-line {
          width: 44px;
          height: 2px;
          background: rgba(255,255,255,0.2);
          margin: 0 10px;
          flex-shrink: 0;
        }

        /* ── Form body ── */
        .reg-body {
          background: var(--cream);
          padding: 64px 0 96px;
        }
        .reg-wrap {
          max-width: 680px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ── Cards ── */
        .reg-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow);
          overflow: hidden;
          margin-bottom: 24px;
        }
        .reg-card-header {
          padding: 22px 28px 18px;
          border-bottom: 1px solid var(--gray-200);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .reg-card-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--navy);
          color: var(--white);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .reg-card-header h2 {
          font-size: 1.15rem;
          color: var(--navy);
          margin: 0;
          line-height: 1.3;
        }
        .reg-card-body {
          padding: 24px 28px 28px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* ── Fields ── */
        .reg-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .reg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .reg-label {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
        }
        .reg-required { color: var(--orange); }
        .reg-hint {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: -2px;
        }
        .reg-input,
        .reg-select {
          width: 100%;
          padding: 11px 14px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text);
          background: var(--white);
          transition: border-color 0.18s;
          appearance: none;
          -webkit-appearance: none;
        }
        .reg-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%235A6A7A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 38px;
          cursor: pointer;
        }
        .reg-input:focus,
        .reg-select:focus {
          outline: none;
          border-color: var(--navy);
          box-shadow: 0 0 0 3px rgba(27,61,110,0.12);
        }
        .reg-field--error .reg-input,
        .reg-field--error .reg-select {
          border-color: #DC2626;
        }
        .reg-field--error .reg-input:focus,
        .reg-field--error .reg-select:focus {
          box-shadow: 0 0 0 3px rgba(220,38,38,0.12);
        }
        .reg-error-msg {
          font-size: 0.8rem;
          color: #DC2626;
          font-weight: 600;
        }

        /* ── Checkboxes ── */
        .reg-group-legend {
          font-family: var(--font-body);
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          margin-bottom: 12px;
          display: block;
        }
        .reg-checkbox-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .reg-check-label {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.4;
          user-select: none;
        }
        .reg-check-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          border: 2px solid var(--gray-400);
          border-radius: 4px;
          flex-shrink: 0;
          accent-color: var(--orange);
          cursor: pointer;
        }
        .reg-check-label:hover input[type="checkbox"] {
          border-color: var(--orange);
        }

        /* ── Submit area ── */
        .reg-submit-error {
          background: #FEE2E2;
          border-left: 4px solid #EF4444;
          padding: 12px 16px;
          border-radius: var(--radius);
          font-size: 0.875rem;
          color: #991B1B;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .reg-submit-btn {
          width: 100%;
          justify-content: center;
          font-size: 1.05rem;
          padding: 16px 24px;
        }
        .reg-submit-note {
          text-align: center;
          margin-top: 10px;
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        /* ── Contact footer ── */
        .reg-contact {
          text-align: center;
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--gray-200);
        }
        .reg-contact p { font-size: 0.9rem; }
        .reg-contact a { color: var(--navy); font-weight: 600; text-decoration: underline; }
        .reg-contact a:hover { color: var(--orange); }

        /* ── Responsive ── */
        @media (max-width: 600px) {
          .reg-hero { padding: 120px 16px 56px; }
          .reg-step-line { width: 20px; margin: 0 5px; }
          .reg-step-label { display: none; }
          .reg-step-label--active { display: block; }
          .reg-row { grid-template-columns: 1fr; }
          .reg-card-header,
          .reg-card-body { padding-left: 20px; padding-right: 20px; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="reg-hero" aria-labelledby="reg-heading">
        <div className="container">
          <span className="section-label" style={{ color: 'var(--yellow)' }}>2026 HalloWheels</span>
          <h1 id="reg-heading">
            Register Your <span>Child</span>
          </h1>

          {/* Progress stepper */}
          <nav className="reg-stepper" aria-label="Registration progress">
            <div className="reg-step">
              <span className="reg-step-bubble reg-step-bubble--active" aria-hidden="true">1</span>
              <span className="reg-step-label reg-step-label--active">Your Info</span>
            </div>
            <div className="reg-step-line" aria-hidden="true" />
            <div className="reg-step" aria-hidden="true">
              <span className="reg-step-bubble reg-step-bubble--pending">2</span>
              <span className="reg-step-label reg-step-label--pending">Photo Release</span>
            </div>
            <div className="reg-step-line" aria-hidden="true" />
            <div className="reg-step" aria-hidden="true">
              <span className="reg-step-bubble reg-step-bubble--pending">3</span>
              <span className="reg-step-label reg-step-label--pending">Done</span>
            </div>
          </nav>

          <p>
            Ready to join HalloWheels 2026? Fill out the form below and we'll take you
            straight to your photo release to complete your registration.
          </p>
        </div>
      </section>

      {/* ── FORM ── */}
      <section className="reg-body">
        <div className="reg-wrap">
          <form
            onSubmit={handleSubmit}
            noValidate
            aria-label="HalloWheels 2026 registration form"
          >
            {/* Submit error summary — announced to screen readers on validation failure */}
            {submitError && (
              <div className="reg-submit-error" role="alert" aria-atomic="true">
                {submitError}
              </div>
            )}

            {/* ── Section 1: About Your Child ── */}
            <div className="reg-card">
              <div className="reg-card-header">
                <span className="reg-card-num" aria-hidden="true">1</span>
                <h2>About Your Child</h2>
              </div>
              <div className="reg-card-body">
                <div className="reg-row">
                  <FormField
                    id="reg-childFirstName"
                    label="Child's First Name"
                    required
                    error={errors.childFirstName}
                  >
                    <input
                      id="reg-childFirstName"
                      type="text"
                      className="reg-input"
                      value={form.childFirstName}
                      onChange={e => setField('childFirstName', e.target.value)}
                      autoComplete="given-name"
                      aria-required="true"
                      aria-describedby={errors.childFirstName ? 'reg-childFirstName-error' : undefined}
                    />
                  </FormField>
                  <FormField
                    id="reg-childLastName"
                    label="Child's Last Name"
                    required
                    error={errors.childLastName}
                  >
                    <input
                      id="reg-childLastName"
                      type="text"
                      className="reg-input"
                      value={form.childLastName}
                      onChange={e => setField('childLastName', e.target.value)}
                      autoComplete="family-name"
                      aria-required="true"
                      aria-describedby={errors.childLastName ? 'reg-childLastName-error' : undefined}
                    />
                  </FormField>
                </div>
                <FormField
                  id="reg-costumeName"
                  label="Costume Name / Title"
                  required
                  hint="What have you named your creation? e.g. The Olaf Express"
                  error={errors.costumeName}
                >
                  <input
                    id="reg-costumeName"
                    type="text"
                    className="reg-input"
                    value={form.costumeName}
                    onChange={e => setField('costumeName', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.costumeName ? 'reg-costumeName-error' : 'reg-costumeName-hint'}
                  />
                </FormField>
                <FormField
                  id="reg-mobilityDevice"
                  label="Mobility Device Type"
                  required
                  error={errors.mobilityDevice}
                >
                  <select
                    id="reg-mobilityDevice"
                    className="reg-select"
                    value={form.mobilityDevice}
                    onChange={e => setField('mobilityDevice', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.mobilityDevice ? 'reg-mobilityDevice-error' : undefined}
                  >
                    <option value="">Select a device type…</option>
                    {MOBILITY_DEVICES.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>

            {/* ── Section 2: About You ── */}
            <div className="reg-card">
              <div className="reg-card-header">
                <span className="reg-card-num" aria-hidden="true">2</span>
                <h2>About You</h2>
              </div>
              <div className="reg-card-body">
                <div className="reg-row">
                  <FormField
                    id="reg-parentFirstName"
                    label="Your First Name"
                    required
                    error={errors.parentFirstName}
                  >
                    <input
                      id="reg-parentFirstName"
                      type="text"
                      className="reg-input"
                      value={form.parentFirstName}
                      onChange={e => setField('parentFirstName', e.target.value)}
                      autoComplete="given-name"
                      aria-required="true"
                      aria-describedby={errors.parentFirstName ? 'reg-parentFirstName-error' : undefined}
                    />
                  </FormField>
                  <FormField
                    id="reg-parentLastName"
                    label="Your Last Name"
                    required
                    error={errors.parentLastName}
                  >
                    <input
                      id="reg-parentLastName"
                      type="text"
                      className="reg-input"
                      value={form.parentLastName}
                      onChange={e => setField('parentLastName', e.target.value)}
                      autoComplete="family-name"
                      aria-required="true"
                      aria-describedby={errors.parentLastName ? 'reg-parentLastName-error' : undefined}
                    />
                  </FormField>
                </div>
                <FormField
                  id="reg-relationship"
                  label="Relationship to Child"
                  required
                  error={errors.relationship}
                >
                  <select
                    id="reg-relationship"
                    className="reg-select"
                    value={form.relationship}
                    onChange={e => setField('relationship', e.target.value)}
                    aria-required="true"
                    aria-describedby={errors.relationship ? 'reg-relationship-error' : undefined}
                  >
                    <option value="">Select…</option>
                    {RELATIONSHIPS.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </FormField>
                <FormField
                  id="reg-streetAddress"
                  label="Street Address"
                  required
                  error={errors.streetAddress}
                >
                  <input
                    id="reg-streetAddress"
                    type="text"
                    className="reg-input"
                    value={form.streetAddress}
                    onChange={e => setField('streetAddress', e.target.value)}
                    autoComplete="street-address"
                    aria-required="true"
                    aria-describedby={errors.streetAddress ? 'reg-streetAddress-error' : undefined}
                  />
                </FormField>
                <div className="reg-row">
                  <FormField
                    id="reg-city"
                    label="City"
                    required
                    error={errors.city}
                  >
                    <input
                      id="reg-city"
                      type="text"
                      className="reg-input"
                      value={form.city}
                      onChange={e => setField('city', e.target.value)}
                      autoComplete="address-level2"
                      aria-required="true"
                      aria-describedby={errors.city ? 'reg-city-error' : undefined}
                    />
                  </FormField>
                  <FormField
                    id="reg-state"
                    label="State"
                    required
                    error={errors.state}
                  >
                    <select
                      id="reg-state"
                      className="reg-select"
                      value={form.state}
                      onChange={e => setField('state', e.target.value)}
                      autoComplete="address-level1"
                      aria-required="true"
                      aria-describedby={errors.state ? 'reg-state-error' : undefined}
                    >
                      {US_STATES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </FormField>
                </div>
                <FormField
                  id="reg-zipCode"
                  label="Zip Code"
                  required
                  error={errors.zipCode}
                >
                  <input
                    id="reg-zipCode"
                    type="text"
                    inputMode="numeric"
                    className="reg-input"
                    style={{ maxWidth: '160px' }}
                    value={form.zipCode}
                    onChange={e => setField('zipCode', e.target.value)}
                    autoComplete="postal-code"
                    placeholder="12345"
                    aria-required="true"
                    aria-describedby={errors.zipCode ? 'reg-zipCode-error' : undefined}
                  />
                </FormField>
                <div className="reg-row">
                  <FormField
                    id="reg-phone"
                    label="Phone Number"
                    required
                    error={errors.phone}
                  >
                    <input
                      id="reg-phone"
                      type="tel"
                      className="reg-input"
                      value={form.phone}
                      onChange={e => setField('phone', e.target.value)}
                      autoComplete="tel"
                      placeholder="(555) 555-5555"
                      aria-required="true"
                      aria-describedby={errors.phone ? 'reg-phone-error' : undefined}
                    />
                  </FormField>
                  <FormField
                    id="reg-email"
                    label="Email Address"
                    required
                    error={errors.email}
                  >
                    <input
                      id="reg-email"
                      type="email"
                      className="reg-input"
                      value={form.email}
                      onChange={e => setField('email', e.target.value)}
                      autoComplete="email"
                      aria-required="true"
                      aria-describedby={errors.email ? 'reg-email-error' : undefined}
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* ── Section 3: Event ── */}
            <div className="reg-card">
              <div className="reg-card-header">
                <span className="reg-card-num" aria-hidden="true">3</span>
                <h2>Which Event Are You Attending?</h2>
              </div>
              <div className="reg-card-body">
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend className="reg-group-legend">Select all that apply</legend>
                  <div className="reg-checkbox-group">
                    {EVENTS.map(ev => (
                      <label key={ev.id} className="reg-check-label">
                        <input
                          type="checkbox"
                          checked={form.events.includes(ev.id)}
                          onChange={() => toggleCheck('events', ev.id)}
                        />
                        {ev.label}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            {/* ── Section 4: Photo Release Authorization ── */}
            <div className="reg-card">
              <div className="reg-card-header">
                <span className="reg-card-num" aria-hidden="true">4</span>
                <h2>Photo Release Authorization</h2>
              </div>
              <div className="reg-card-body">
                <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
                  <legend className="reg-group-legend">
                    I authorize disclosure of the following personal information (check all that apply):
                  </legend>
                  <div className="reg-checkbox-group">
                    {DISCLOSURES.map(d => (
                      <label key={d} className="reg-check-label">
                        <input
                          type="checkbox"
                          checked={form.disclosures.includes(d)}
                          onChange={() => toggleCheck('disclosures', d)}
                        />
                        {d}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              className="btn btn-primary reg-submit-btn"
              disabled={submitting}
              aria-busy={submitting}
            >
              {submitting ? 'Redirecting to photo release…' : 'Continue to Photo Release →'}
            </button>
            <p className="reg-submit-note">
              You'll be taken to the photo release form with your information already filled in.
            </p>
          </form>

          {/* ── Contact ── */}
          <div className="reg-contact">
            <p>
              Questions? Email{' '}
              <a href="mailto:info@atdevicesforkids.org">info@atdevicesforkids.org</a>
              {' '}or call{' '}
              <a href="tel:7577638905">(757) 763-8905</a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
