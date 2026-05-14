'use client'

import { useState, useEffect, useCallback, useRef, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { logoutAction, saveCostume, deleteCostume, saveSetting } from './actions'

// ── Toast system ──────────────────────────────────────────────────────────────

function useToasts() {
  const [toasts, setToasts] = useState([])
  function addToast(message, type = 'success') {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4500)
  }
  return { toasts, addToast }
}

// ── Photo preview helpers ─────────────────────────────────────────────────────

function usePhotoPreviews() {
  const [previews, setPreviews] = useState([]) // { url: string }[]
  function onFilesChange(e) {
    previews.forEach(p => URL.revokeObjectURL(p.url))
    const files = Array.from(e.target.files || [])
    setPreviews(files.map(f => ({ url: URL.createObjectURL(f) })))
  }
  function clear() {
    previews.forEach(p => URL.revokeObjectURL(p.url))
    setPreviews([])
  }
  useEffect(() => () => previews.forEach(p => URL.revokeObjectURL(p.url)), [])
  return { previews, onFilesChange, clear }
}

// ── CostumeForm (add & edit) ──────────────────────────────────────────────────

function CostumeForm({ initial, activeYear, onSave, onCancel, saving }) {
  const formRef = useRef(null)
  const fileInputRef = useRef(null)
  const { previews, onFilesChange, clear } = usePhotoPreviews()
  const [keepUrls, setKeepUrls] = useState(initial?.photo_urls || [])
  const isEdit = !!initial?.id

  function removeKeepUrl(url) {
    setKeepUrls(prev => prev.filter(u => u !== url))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const fd = new FormData(formRef.current)
    // Inject kept URLs as hidden fields
    keepUrls.forEach(url => fd.append('keep_url', url))
    await onSave(fd)
    if (!isEdit) {
      formRef.current.reset()
      clear()
      setKeepUrls([])
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="costume-form" noValidate>
      {isEdit && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="year" value={activeYear} />

      <div className="form-row">
        <div className="form-field">
          <label htmlFor={`cf-name-${isEdit ? initial.id : 'new'}`}>
            Name <span aria-hidden="true">*</span>
          </label>
          <input
            type="text"
            id={`cf-name-${isEdit ? initial.id : 'new'}`}
            name="name"
            defaultValue={initial?.name || ''}
            required
            placeholder="e.g. The Olaf Express"
          />
        </div>
        <div className="form-field">
          <label htmlFor={`cf-tagline-${isEdit ? initial.id : 'new'}`}>Tagline</label>
          <input
            type="text"
            id={`cf-tagline-${isEdit ? initial.id : 'new'}`}
            name="tagline"
            defaultValue={initial?.tagline || ''}
            placeholder="One punchy line"
          />
        </div>
      </div>

      <div className="form-field">
        <label htmlFor={`cf-bio-${isEdit ? initial.id : 'new'}`}>Bio</label>
        <textarea
          id={`cf-bio-${isEdit ? initial.id : 'new'}`}
          name="bio"
          rows={4}
          defaultValue={initial?.bio || ''}
          placeholder="Full story about this kid and their costume..."
        />
      </div>

      <div className="form-field">
        <label htmlFor={`cf-photos-${isEdit ? initial.id : 'new'}`}>
          Photos <span className="form-field-hint">(jpg, png, webp)</span>
        </label>

        {/* Existing photos */}
        {keepUrls.length > 0 && (
          <div className="photo-preview-grid" aria-label="Existing photos">
            {keepUrls.map((url, i) => (
              <div key={url} className="photo-preview-item">
                <img src={url} alt={`Existing photo ${i + 1}`} />
                <button
                  type="button"
                  className="photo-preview-remove"
                  onClick={() => removeKeepUrl(url)}
                  aria-label={`Remove existing photo ${i + 1}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* New photo previews */}
        {previews.length > 0 && (
          <div className="photo-preview-grid" aria-label="New photos to upload">
            {previews.map((p, i) => (
              <div key={p.url} className="photo-preview-item photo-preview-item--new">
                <img src={p.url} alt={`New photo ${i + 1}`} />
                <span className="photo-preview-badge">New</span>
              </div>
            ))}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          id={`cf-photos-${isEdit ? initial.id : 'new'}`}
          name="photos"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="file-input"
          onChange={onFilesChange}
          aria-describedby="photo-hint"
        />
        <p id="photo-hint" className="form-field-hint" style={{ marginTop: '6px' }}>
          Select multiple files at once. Existing photos are kept unless removed above.
        </p>
      </div>

      <div className="form-actions">
        {isEdit && (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="btn btn-sm btn-primary"
          disabled={saving}
          aria-busy={saving}
        >
          {saving
            ? (isEdit ? 'Saving…' : 'Adding…')
            : (isEdit ? 'Save Changes' : 'Add Costume')}
        </button>
      </div>
    </form>
  )
}

// ── CostumeRow ────────────────────────────────────────────────────────────────

function CostumeRow({ costume, activeYear, isEditing, isConfirmingDelete, onEdit, onCancelEdit, onSaveEdit, onDelete, onCancelDelete, onConfirmDelete, saving }) {
  const thumb = costume.photo_urls?.[0]

  return (
    <div className="costume-row">
      <div className="costume-row-main">
        <div className="costume-thumb">
          {thumb
            ? <img src={thumb} alt={`${costume.name} thumbnail`} />
            : <span aria-hidden="true">🎃</span>
          }
        </div>
        <div className="costume-row-info">
          <strong className="costume-row-name">{costume.name}</strong>
          {costume.tagline && (
            <span className="costume-row-tagline">{costume.tagline}</span>
          )}
          <span className="costume-row-meta">
            {costume.photo_urls?.length || 0} photo{costume.photo_urls?.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="costume-row-actions">
          {isConfirmingDelete ? (
            <>
              <span className="delete-confirm-text">Delete this costume?</span>
              <button
                className="btn btn-sm btn-secondary"
                onClick={onCancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-sm costume-row-delete-confirm"
                onClick={onConfirmDelete}
                disabled={saving}
                aria-busy={saving}
              >
                {saving ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </>
          ) : (
            <>
              <button
                className="btn btn-sm btn-secondary"
                onClick={onEdit}
                aria-label={`Edit ${costume.name}`}
                aria-expanded={isEditing}
              >
                Edit
              </button>
              <button
                className="btn btn-sm costume-row-delete"
                onClick={onDelete}
                aria-label={`Delete ${costume.name}`}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="costume-row-edit">
          <CostumeForm
            initial={costume}
            activeYear={activeYear}
            onSave={onSaveEdit}
            onCancel={onCancelEdit}
            saving={saving}
          />
        </div>
      )}
    </div>
  )
}

// ── SettingRow ────────────────────────────────────────────────────────────────

function ToggleRow({ label, description, settingKey, value, onSave, saving }) {
  const isOn = value === 'true'
  return (
    <div className="setting-row">
      <div className="setting-row-label">
        <strong>{label}</strong>
        {description && <span className="setting-row-desc">{description}</span>}
      </div>
      <div className="setting-row-control">
        <label className="toggle-switch" aria-label={`${label}: ${isOn ? 'On' : 'Off'}`}>
          <input
            type="checkbox"
            checked={isOn}
            onChange={() => onSave(settingKey, isOn ? 'false' : 'true')}
            disabled={saving}
          />
          <span className="toggle-slider" aria-hidden="true" />
        </label>
        <span className={`toggle-status ${isOn ? 'on' : 'off'}`}>
          {isOn ? 'Open' : 'Closed'}
        </span>
      </div>
    </div>
  )
}

function InputRow({ label, description, settingKey, value, type = 'text', onSave, saving }) {
  const [draft, setDraft] = useState(value || '')
  const isDirty = draft !== (value || '')
  const id = `setting-${settingKey}`

  useEffect(() => {
    setDraft(value || '')
  }, [value])

  return (
    <div className="setting-row">
      <div className="setting-row-label">
        <label htmlFor={id}><strong>{label}</strong></label>
        {description && <span className="setting-row-desc">{description}</span>}
      </div>
      <div className="setting-row-control setting-row-input">
        <input
          id={id}
          type={type}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          className={`setting-input${isDirty ? ' setting-input--dirty' : ''}`}
          disabled={saving === settingKey}
        />
        <button
          className="btn btn-sm btn-primary"
          onClick={() => onSave(settingKey, draft)}
          disabled={!isDirty || saving === settingKey}
          aria-busy={saving === settingKey}
        >
          {saving === settingKey ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  )
}

// ── Main AdminPanel ───────────────────────────────────────────────────────────

export default function AdminPanel() {
  const router = useRouter()
  const { toasts, addToast } = useToasts()

  // Data
  const [costumes, setCostumes] = useState([])
  const [settings, setSettings] = useState({})
  const [loadingCostumes, setLoadingCostumes] = useState(true)

  // UI state
  const [editingId, setEditingId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [costumeSaving, setCostumeSaving] = useState(false)
  const [costumeDeleting, setCostumeDeleting] = useState(false)
  const [savingSettingKey, setSavingSettingKey] = useState(null)

  const activeYear = parseInt(settings.active_year || new Date().getFullYear())

  // ── Data fetching ────────────────────────────────────────────────────────────

  const fetchCostumes = useCallback(async () => {
    const yr = parseInt(
      (await supabase.from('settings').select('value').eq('key', 'active_year').single())
        .data?.value || activeYear
    )
    const { data } = await supabase
      .from('costumes')
      .select('*')
      .eq('year', yr)
      .order('name')
    if (data) setCostumes(data)
    setLoadingCostumes(false)
  }, [activeYear])

  useEffect(() => {
    async function loadSettings() {
      const { data } = await supabase.from('settings').select('*')
      if (data) setSettings(Object.fromEntries(data.map(r => [r.key, r.value])))
    }
    loadSettings()
  }, [])

  useEffect(() => {
    fetchCostumes()
    const id = setInterval(fetchCostumes, 30000)
    return () => clearInterval(id)
  }, [fetchCostumes])

  // ── Costume actions ──────────────────────────────────────────────────────────

  async function handleSaveCostume(fd) {
    setCostumeSaving(true)
    try {
      const result = await saveCostume(fd)
      if (result?.error) {
        addToast(result.error, 'error')
      } else {
        addToast(fd.get('id') ? 'Costume updated!' : 'Costume added!', 'success')
        setEditingId(null)
        await fetchCostumes()
      }
    } catch {
      addToast('Something went wrong. Please try again.', 'error')
    } finally {
      setCostumeSaving(false)
    }
  }

  async function handleDeleteCostume(id) {
    setCostumeDeleting(true)
    try {
      const result = await deleteCostume(id)
      if (result?.error) {
        addToast(result.error, 'error')
      } else {
        addToast('Costume deleted.', 'success')
        setDeletingId(null)
        await fetchCostumes()
      }
    } catch {
      addToast('Delete failed. Please try again.', 'error')
    } finally {
      setCostumeDeleting(false)
    }
  }

  // ── Settings actions ─────────────────────────────────────────────────────────

  async function handleSaveSetting(key, value) {
    setSavingSettingKey(key)
    try {
      const result = await saveSetting(key, value)
      if (result?.error) {
        addToast(`Failed to save ${key}: ${result.error}`, 'error')
      } else {
        setSettings(prev => ({ ...prev, [key]: String(value) }))
        addToast('Setting saved!', 'success')
      }
    } catch {
      addToast('Failed to save setting.', 'error')
    } finally {
      setSavingSettingKey(null)
    }
  }

  async function handleSignOut() {
    await logoutAction()
    router.refresh()
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{`
        /* ── Layout ── */
        .admin-wrap {
          min-height: 100vh;
          background: #F1F4F8;
        }
        .admin-topbar {
          position: sticky;
          top: 0;
          z-index: 200;
          background: var(--navy-dark);
          border-bottom: 3px solid var(--yellow);
          padding: 0 24px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .admin-topbar-logo {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 900;
          color: var(--white);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-topbar-logo span { color: var(--yellow); }
        .admin-topbar-badge {
          font-family: var(--font-body);
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          background: var(--orange);
          color: var(--white);
          padding: 3px 8px;
          border-radius: var(--radius-full);
        }
        .admin-topbar-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .admin-topbar-year {
          font-size: 0.8rem;
          color: rgba(255,255,255,0.55);
        }
        .admin-signout {
          background: rgba(255,255,255,0.1) !important;
          color: rgba(255,255,255,0.8) !important;
          border-color: rgba(255,255,255,0.2) !important;
          font-size: 0.8rem !important;
          padding: 7px 14px !important;
        }
        .admin-signout:hover {
          background: rgba(255,255,255,0.18) !important;
          color: var(--white) !important;
        }
        .admin-content {
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 24px 120px;
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        /* ── Section card ── */
        .admin-section-title {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-family: var(--font-body);
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .admin-section-title::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--gray-200);
        }
        .admin-card {
          background: var(--white);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }
        .admin-card-header {
          padding: 20px 24px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .admin-card-header h2 {
          font-size: 1.15rem;
          color: var(--navy);
          margin: 0;
        }
        .admin-card-meta {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--cream);
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }
        .admin-card-body {
          padding: 20px 24px 24px;
        }

        /* ── Forms ── */
        .costume-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-field label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text);
        }
        .form-field input[type="text"],
        .form-field input[type="number"],
        .form-field input[type="date"],
        .form-field input[type="password"],
        .form-field textarea {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          font-family: var(--font-body);
          font-size: 0.95rem;
          color: var(--text);
          background: var(--white);
          transition: border-color 0.18s;
          resize: vertical;
        }
        .form-field input:focus,
        .form-field textarea:focus {
          outline: none;
          border-color: var(--navy);
        }
        .form-field-hint {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }

        /* ── File input ── */
        .file-input {
          display: block;
          width: 100%;
          font-family: var(--font-body);
          font-size: 0.875rem;
          color: var(--text);
          padding: 8px 0;
          cursor: pointer;
        }
        .file-input::file-selector-button {
          padding: 8px 16px;
          background: var(--cream);
          border: 2px solid var(--gray-200);
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--navy);
          cursor: pointer;
          margin-right: 12px;
          transition: all 0.18s;
        }
        .file-input::file-selector-button:hover {
          background: var(--cream-dark);
          border-color: var(--navy);
        }

        /* ── Photo previews ── */
        .photo-preview-grid {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .photo-preview-item {
          position: relative;
          width: 72px;
          height: 72px;
          border-radius: var(--radius);
          overflow: hidden;
          border: 2px solid var(--gray-200);
          flex-shrink: 0;
        }
        .photo-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .photo-preview-remove {
          position: absolute;
          top: 2px;
          right: 2px;
          width: 20px;
          height: 20px;
          background: rgba(0,0,0,0.7);
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          font-size: 14px;
          line-height: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          transition: background 0.15s;
        }
        .photo-preview-remove:hover { background: #B91C1C; }
        .photo-preview-item--new { border-color: var(--orange); }
        .photo-preview-badge {
          position: absolute;
          bottom: 2px;
          left: 2px;
          background: var(--orange);
          color: white;
          font-size: 0.55rem;
          font-weight: 700;
          padding: 1px 4px;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* ── Costume list ── */
        .costume-list {
          display: flex;
          flex-direction: column;
        }
        .costume-row {
          border-bottom: 1px solid var(--gray-200);
        }
        .costume-row:last-child { border-bottom: none; }
        .costume-row-main {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 0;
        }
        .costume-thumb {
          width: 56px;
          height: 56px;
          border-radius: var(--radius);
          overflow: hidden;
          background: var(--cream-dark);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        .costume-thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .costume-row-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .costume-row-name {
          font-family: var(--font-display);
          font-size: 1rem;
          color: var(--navy);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .costume-row-tagline {
          font-size: 0.8rem;
          color: var(--text-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .costume-row-meta {
          font-size: 0.72rem;
          color: var(--gray-400);
        }
        .costume-row-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
          flex-wrap: wrap;
        }
        .delete-confirm-text {
          font-size: 0.82rem;
          color: var(--text-muted);
          white-space: nowrap;
        }
        .costume-row-delete {
          background: transparent !important;
          color: #B91C1C !important;
          border-color: #FECACA !important;
        }
        .costume-row-delete:hover {
          background: #FEF2F2 !important;
          border-color: #B91C1C !important;
        }
        .costume-row-delete-confirm {
          background: #B91C1C !important;
          border-color: #B91C1C !important;
          color: white !important;
        }
        .costume-row-delete-confirm:hover {
          background: #991B1B !important;
        }
        .costume-row-edit {
          padding: 0 0 16px;
          border-top: 1px dashed var(--gray-200);
          margin-top: 4px;
          padding-top: 16px;
        }

        /* ── Empty / loading states ── */
        .admin-empty {
          text-align: center;
          padding: 40px 24px;
          color: var(--text-muted);
          font-size: 0.95rem;
        }
        .admin-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          gap: 10px;
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--gray-200);
          border-top-color: var(--navy);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        /* ── Settings ── */
        .settings-grid {
          display: flex;
          flex-direction: column;
        }
        .setting-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 16px 0;
          border-bottom: 1px solid var(--gray-200);
          flex-wrap: wrap;
        }
        .setting-row:last-child { border-bottom: none; }
        .setting-row-label {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 160px;
        }
        .setting-row-label strong { font-size: 0.9rem; color: var(--text); }
        .setting-row-desc { font-size: 0.75rem; color: var(--text-muted); }
        .setting-row-control {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }
        .setting-row-input {
          flex-shrink: 1;
          min-width: 0;
        }
        .setting-input {
          padding: 8px 12px;
          border: 2px solid var(--gray-200);
          border-radius: var(--radius);
          font-family: var(--font-body);
          font-size: 0.9rem;
          color: var(--text);
          width: 200px;
          max-width: 100%;
          transition: border-color 0.18s;
        }
        .setting-input:focus {
          outline: none;
          border-color: var(--navy);
        }
        .setting-input--dirty {
          border-color: var(--orange);
        }

        /* ── Toggle switch ── */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 52px;
          height: 28px;
          cursor: pointer;
          flex-shrink: 0;
        }
        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }
        .toggle-slider {
          position: absolute;
          inset: 0;
          background: var(--gray-400);
          border-radius: 28px;
          transition: background 0.25s;
        }
        .toggle-slider::before {
          content: '';
          position: absolute;
          height: 22px;
          width: 22px;
          left: 3px;
          bottom: 3px;
          background: var(--white);
          border-radius: 50%;
          transition: transform 0.25s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .toggle-switch input:checked + .toggle-slider {
          background: #22c55e;
        }
        .toggle-switch input:checked + .toggle-slider::before {
          transform: translateX(24px);
        }
        .toggle-switch input:focus-visible + .toggle-slider {
          outline: 3px solid var(--yellow);
          outline-offset: 2px;
        }
        .toggle-status {
          font-size: 0.8rem;
          font-weight: 700;
          min-width: 50px;
        }
        .toggle-status.on { color: #16a34a; }
        .toggle-status.off { color: var(--text-muted); }

        /* ── Toasts ── */
        .toast-container {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-width: 340px;
          pointer-events: none;
        }
        .toast {
          padding: 12px 18px;
          border-radius: var(--radius);
          font-size: 0.875rem;
          font-weight: 600;
          box-shadow: var(--shadow-lg);
          animation: toastIn 0.25s ease;
          pointer-events: auto;
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .toast--success {
          background: #D1FAE5;
          color: #065F46;
          border-left: 4px solid #10B981;
        }
        .toast--error {
          background: #FEE2E2;
          color: #991B1B;
          border-left: 4px solid #EF4444;
        }

        /* ── Divider between add form and list ── */
        .admin-card-divider {
          height: 1px;
          background: var(--gray-200);
          margin: 0;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .admin-content { padding: 24px 16px 100px; }
          .admin-topbar { padding: 0 16px; }
          .admin-card-header, .admin-card-body { padding-left: 16px; padding-right: 16px; }
          .form-row { grid-template-columns: 1fr; }
          .costume-row-actions { width: 100%; justify-content: flex-end; }
          .setting-row { flex-direction: column; align-items: flex-start; gap: 10px; }
          .setting-input { width: 100%; }
          .setting-row-input { width: 100%; }
          .setting-row-control.setting-row-input {
            flex-direction: row;
            width: 100%;
          }
          .toast-container { right: 12px; left: 12px; max-width: unset; }
        }
      `}</style>

      {/* ── Toasts ── */}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast--${t.type}`} role="status">
            {t.message}
          </div>
        ))}
      </div>

      <div className="admin-wrap">
        {/* ── Top bar ── */}
        <header className="admin-topbar" role="banner">
          <div className="admin-topbar-logo">
            Hallo<span>Wheels</span>
            <span className="admin-topbar-badge">Admin</span>
          </div>
          <div className="admin-topbar-right">
            <span className="admin-topbar-year">{activeYear}</span>
            <button
              className="btn admin-signout"
              onClick={handleSignOut}
              aria-label="Sign out of admin panel"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Content ── */}
        <div className="admin-content">

          {/* ── COSTUMES ── */}
          <div>
            <p className="admin-section-title">Costumes</p>

            {/* Add form */}
            <div className="admin-card" style={{ marginBottom: '16px' }}>
              <div className="admin-card-header">
                <h2>Add New Costume</h2>
                <span className="admin-card-meta">{activeYear}</span>
              </div>
              <div className="admin-card-body">
                <CostumeForm
                  activeYear={activeYear}
                  onSave={handleSaveCostume}
                  saving={costumeSaving}
                />
              </div>
            </div>

            {/* Costume list */}
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Current Costumes</h2>
                <span className="admin-card-meta">
                  {loadingCostumes ? '…' : `${costumes.length} costume${costumes.length !== 1 ? 's' : ''}`}
                </span>
              </div>
              <div className="admin-card-body">
                {loadingCostumes ? (
                  <div className="admin-loading">
                    <span className="spinner" aria-hidden="true" />
                    Loading costumes…
                  </div>
                ) : costumes.length === 0 ? (
                  <p className="admin-empty">No costumes yet for {activeYear}. Add one above!</p>
                ) : (
                  <div className="costume-list" role="list" aria-label="Costume list">
                    {costumes.map(c => (
                      <div key={c.id} role="listitem">
                        <CostumeRow
                          costume={c}
                          activeYear={activeYear}
                          isEditing={editingId === c.id}
                          isConfirmingDelete={deletingId === c.id}
                          onEdit={() => { setEditingId(c.id); setDeletingId(null) }}
                          onCancelEdit={() => setEditingId(null)}
                          onSaveEdit={handleSaveCostume}
                          onDelete={() => { setDeletingId(c.id); setEditingId(null) }}
                          onCancelDelete={() => setDeletingId(null)}
                          onConfirmDelete={() => handleDeleteCostume(c.id)}
                          saving={editingId === c.id ? costumeSaving : costumeDeleting}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── SETTINGS ── */}
          <div>
            <p className="admin-section-title">Settings</p>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2>Event Settings</h2>
              </div>
              <div className="admin-card-body">
                <div className="settings-grid" role="list" aria-label="Site settings">

                  <div role="listitem">
                    <ToggleRow
                      label="Voting Open"
                      description="Manually open or close voting regardless of dates"
                      settingKey="voting_open"
                      value={settings.voting_open || 'false'}
                      onSave={handleSaveSetting}
                      saving={savingSettingKey}
                    />
                  </div>

                  <div role="listitem">
                    <InputRow
                      label="Voting Start"
                      description="Date voting opens (YYYY-MM-DD)"
                      settingKey="voting_start"
                      value={settings.voting_start || ''}
                      type="date"
                      onSave={handleSaveSetting}
                      saving={savingSettingKey}
                    />
                  </div>

                  <div role="listitem">
                    <InputRow
                      label="Voting End"
                      description="Date voting closes"
                      settingKey="voting_end"
                      value={settings.voting_end || ''}
                      type="date"
                      onSave={handleSaveSetting}
                      saving={savingSettingKey}
                    />
                  </div>

                  <div role="listitem">
                    <InputRow
                      label="Goal Amount"
                      description="Fundraising goal in dollars"
                      settingKey="goal_amount"
                      value={settings.goal_amount || ''}
                      type="number"
                      onSave={handleSaveSetting}
                      saving={savingSettingKey}
                    />
                  </div>

                  <div role="listitem">
                    <InputRow
                      label="Active Year"
                      description="Year used for new costumes and gallery"
                      settingKey="active_year"
                      value={settings.active_year || String(new Date().getFullYear())}
                      type="number"
                      onSave={handleSaveSetting}
                      saving={savingSettingKey}
                    />
                  </div>

                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
