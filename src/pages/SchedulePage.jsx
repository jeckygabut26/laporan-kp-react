import { useEffect, useMemo, useRef, useState } from 'react'
import { scheduleApi } from '../services/api.js'
import './SchedulePage.css'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
const emptyForm = {
  kode_labor: '',
  nama_labor: '',
  hari: '',
  jam: '',
  kelas: '',
  kode_mk: '',
  nama_mk: '',
  sks: '',
  nama_dosen: '',
  semester: '',
}

function SchedulePage() {
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [day, setDay] = useState('')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [connection, setConnection] = useState('checking')
  const [loadError, setLoadError] = useState('')
  const [updatedAt, setUpdatedAt] = useState('Belum diperbarui')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState('')
  const dialogRef = useRef(null)
  const toastTimerRef = useRef(null)

  const visibleRows = useMemo(() => {
    const query = search.trim().toLocaleLowerCase('id')
    return rows.filter((row) => {
      const matchesDay = !day || row.hari === day
      const searchable = [
        row.kode_labor, row.nama_labor, row.hari, row.jam, row.kelas,
        row.kode_mk, row.nama_mk, row.kode_mata_kuliah,
        row.nama_mata_kuliah, row.sks, row.nama_dosen, row.semester,
      ].join(' ').toLocaleLowerCase('id')
      return matchesDay && (!query || searchable.includes(query))
    })
  }, [day, rows, search])

  useEffect(() => () => clearTimeout(toastTimerRef.current), [])

  async function loadSchedules() {
    setLoading(true)
    setLoadError('')
    try {
      const result = await scheduleApi.list()
      setRows(Array.isArray(result) ? result : [])
      setUpdatedAt(new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
      }))
    } catch (error) {
      setRows([])
      setLoadError(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function checkHealth() {
    try {
      await scheduleApi.health()
      setConnection('connected')
    } catch {
      setConnection('warning')
    }
  }

  useEffect(() => {
    let active = true

    scheduleApi.list()
      .then((result) => {
        if (!active) return
        setRows(Array.isArray(result) ? result : [])
        setUpdatedAt(new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
        }))
      })
      .catch((error) => {
        if (!active) return
        setRows([])
        setLoadError(error.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    scheduleApi.health()
      .then(() => {
        if (active) setConnection('connected')
      })
      .catch(() => {
        if (active) setConnection('warning')
      })

    return () => { active = false }
  }, [])

  useEffect(() => {
    if (dialogOpen && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal()
    }
  }, [dialogOpen])

  function showToast(message) {
    setToast(message)
    clearTimeout(toastTimerRef.current)
    toastTimerRef.current = setTimeout(() => setToast(''), 3200)
  }

  function openDialog(row = null) {
    setEditing(row)
    setForm(row ? { ...emptyForm, ...row } : emptyForm)
    setDialogOpen(true)
  }

  function closeDialog() {
    dialogRef.current?.close()
    setDialogOpen(false)
    setEditing(null)
    setForm(emptyForm)
  }

  async function refresh() {
    setRefreshing(true)
    await Promise.all([loadSchedules(), checkHealth()])
    setRefreshing(false)
  }

  async function saveSchedule(event) {
    event.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await scheduleApi.update(editing.id, form)
      } else {
        await scheduleApi.create(form)
      }
      closeDialog()
      showToast(editing ? 'Jadwal berhasil diperbarui.' : 'Jadwal berhasil ditambahkan.')
      await loadSchedules()
    } catch (error) {
      showToast(error.message)
    } finally {
      setSaving(false)
    }
  }

  async function deleteSchedule(row) {
    if (!window.confirm(`Hapus jadwal ${row.nama_mk} untuk kelas ${row.kelas}?`)) return
    try {
      await scheduleApi.remove(row.id)
      showToast('Jadwal berhasil dihapus.')
      await loadSchedules()
    } catch (error) {
      showToast(error.message)
    }
  }

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  return (
    <div className="schedule-app">
      <header className="schedule-topbar">
        <a className="schedule-brand" href="/" aria-label="Sistem Jadwal Laboratorium">
          <span className="schedule-brand-mark">LAB</span>
          <span>
            <span className="schedule-brand-name">Sistem Jadwal</span>
            <span className="schedule-brand-caption">LABORATORIUM AKADEMIK</span>
          </span>
        </a>
        <div className="schedule-topbar-actions">
          <span className={`schedule-connection ${connection}`} role="status">
            <span className="schedule-connection-dot" aria-hidden="true" />
            {connection === 'connected' ? 'Supabase terhubung' : connection === 'checking' ? 'Memeriksa database' : 'Backend belum terhubung'}
          </span>
          <button className="schedule-button ghost" type="button" onClick={refresh} disabled={refreshing}>
            {refreshing ? 'Memuat...' : 'Muat ulang'}
          </button>
        </div>
      </header>

      <main className="schedule-main">
        <section className="schedule-page-heading">
          <div>
            <p className="schedule-eyebrow">OPERASIONAL / AKADEMIK</p>
            <h1>Jadwal Laboratorium</h1>
            <p className="schedule-intro">Kelola penggunaan ruang praktik dan jadwal perkuliahan.</p>
          </div>
          <button className="schedule-button primary" type="button" onClick={() => openDialog()}>
            <span aria-hidden="true">+</span> Tambah jadwal
          </button>
        </section>

        {connection === 'warning' && (
          <section className="schedule-notice" role="status">
            <span className="notice-icon" aria-hidden="true">!</span>
            <div>
              <strong>Backend jadwal belum terhubung</strong>
              <span>Pastikan endpoint /api/health dan /api/jadwal tersedia di backend.</span>
            </div>
          </section>
        )}

        <section className="schedule-overview" aria-label="Ringkasan jadwal">
          <span className="schedule-count"><strong>{visibleRows.length}</strong> jadwal ditampilkan</span>
          <span className="schedule-data-label">DATA LANGSUNG DARI BACKEND</span>
        </section>

        <section className="schedule-table-shell" aria-label="Daftar jadwal">
          <div className="schedule-toolbar">
            <label className="schedule-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari mata kuliah, dosen, kelas..."
                aria-label="Cari jadwal"
              />
            </label>
            <select aria-label="Filter hari" value={day} onChange={(event) => setDay(event.target.value)}>
              <option value="">Semua hari</option>
              {days.map((item) => <option key={item}>{item}</option>)}
            </select>
            <button className="schedule-button light" type="button" onClick={() => { setSearch(''); setDay('') }}>
              Reset filter
            </button>
          </div>

          <div className="schedule-table-scroll">
            <table className="schedule-table">
              <thead>
                <tr><th>Laboratorium</th><th>Hari</th><th>Waktu</th><th>Kelas</th><th>Mata kuliah</th><th>Dosen</th><th>Aksi</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td className="schedule-empty" colSpan="7">Memuat jadwal...</td></tr>
                ) : visibleRows.length === 0 ? (
                  <tr>
                    <td className="schedule-empty" colSpan="7">
                      <strong>{loadError ? 'Jadwal tidak dapat dimuat' : search || day ? 'Tidak ada hasil' : 'Belum ada jadwal'}</strong>
                      {loadError || (search || day ? 'Coba ubah kata kunci atau filter hari.' : 'Tambahkan jadwal pertama untuk mulai mengisi daftar.')}
                    </td>
                  </tr>
                ) : visibleRows.map((row) => (
                  <tr key={row.id}>
                    <td><span className="schedule-lab-code">{row.kode_labor}</span><span className="schedule-course-code">{row.nama_labor}</span></td>
                    <td className="schedule-day">{row.hari}</td>
                    <td>{row.jam}</td>
                    <td>{row.kelas}</td>
                    <td><span className="schedule-course-name">{row.nama_mk}</span><span className="schedule-course-code">{row.kode_mk}</span></td>
                    <td>{row.nama_dosen}</td>
                    <td>
                      <div className="schedule-row-actions">
                        <button className="schedule-button light" type="button" onClick={() => openDialog(row)}>Ubah</button>
                        <button className="schedule-button danger" type="button" onClick={() => deleteSchedule(row)}>Hapus</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <div className="schedule-footer-note">
          <span>Jadwal yang ditampilkan mengikuti data pada database.</span>
          <span>{updatedAt === 'Belum diperbarui' ? updatedAt : `Diperbarui ${updatedAt}`}</span>
        </div>
      </main>

      <dialog ref={dialogRef} className="schedule-dialog" onClose={() => { setDialogOpen(false); setEditing(null); setForm(emptyForm) }}>
        <form onSubmit={saveSchedule}>
          <div className="schedule-dialog-header">
            <div>
              <h2>{editing ? 'Ubah jadwal' : 'Tambah jadwal'}</h2>
              <p>Lengkapi informasi penggunaan laboratorium.</p>
            </div>
            <button className="schedule-close" type="button" onClick={closeDialog} aria-label="Tutup">&times;</button>
          </div>
          <div className="schedule-form-grid">
            <div className="schedule-field"><label htmlFor="kode_labor">Kode laboratorium *</label><input id="kode_labor" name="kode_labor" value={form.kode_labor} onChange={updateField} required maxLength="20" placeholder="LAB-01" /></div>
            <div className="schedule-field"><label htmlFor="nama_labor">Nama laboratorium *</label><input id="nama_labor" name="nama_labor" value={form.nama_labor} onChange={updateField} required maxLength="100" placeholder="Labor 1" /></div>
            <div className="schedule-field"><label htmlFor="hari">Hari *</label><select id="hari" name="hari" value={form.hari} onChange={updateField} required><option value="">Pilih hari</option>{days.map((item) => <option key={item}>{item}</option>)}</select></div>
            <div className="schedule-field"><label htmlFor="jam">Jam *</label><input id="jam" name="jam" value={form.jam} onChange={updateField} required maxLength="30" placeholder="08:00-10:00" /></div>
            <div className="schedule-field"><label htmlFor="kelas">Kelas *</label><input id="kelas" name="kelas" value={form.kelas} onChange={updateField} required maxLength="50" placeholder="TI-1A" /></div>
            <div className="schedule-field"><label htmlFor="kode_mk">Kode mata kuliah *</label><input id="kode_mk" name="kode_mk" value={form.kode_mk} onChange={updateField} required maxLength="30" /></div>
            <div className="schedule-field"><label htmlFor="nama_mk">Nama mata kuliah *</label><input id="nama_mk" name="nama_mk" value={form.nama_mk} onChange={updateField} required maxLength="100" /></div>
            <div className="schedule-field"><label htmlFor="sks">SKS *</label><input id="sks" name="sks" type="number" min="1" max="8" value={form.sks} onChange={updateField} required /></div>
            <div className="schedule-field wide"><label htmlFor="nama_dosen">Nama dosen *</label><input id="nama_dosen" name="nama_dosen" value={form.nama_dosen} onChange={updateField} required maxLength="100" /></div>
            <div className="schedule-field"><label htmlFor="semester">Semester</label><input id="semester" name="semester" value={form.semester} onChange={updateField} maxLength="20" /></div>
          </div>
          <div className="schedule-form-actions">
            <button className="schedule-button light" type="button" onClick={closeDialog}>Batal</button>
            <button className="schedule-button" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Simpan jadwal'}</button>
          </div>
        </form>
      </dialog>

      {toast && <div className="schedule-toast" role="status">{toast}</div>}
    </div>
  )
}

export default SchedulePage