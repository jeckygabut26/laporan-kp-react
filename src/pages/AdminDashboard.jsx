import { useEffect, useState } from 'react'
import { masterDataApi, scheduleApi } from '../services/api.js'
import sttpykLogo from '../assets/sttpyk-logo.png'
import SchedulePage from './SchedulePage.jsx'
import './AdminDashboard.css'

const navigation = [
  { id: 'dashboard', label: 'Dashboard', group: 'UTAMA' },
  { id: 'schedules', label: 'Entry Jadwal', group: 'OPERASIONAL' },
  { id: 'lecturers', label: 'Entry Dosen', group: 'MASTER DATA' },
  { id: 'courses', label: 'Data Mata Kuliah', group: 'MASTER DATA' },
  { id: 'labs', label: 'Data Laboratorium', group: 'MASTER DATA' },
  { id: 'software', label: 'Software & Perangkat', group: 'MASTER DATA' },
  { id: 'replacements', label: 'Kuliah Pengganti', group: 'OPERASIONAL' },
  { id: 'printSchedule', label: 'Cetak Jadwal', group: 'LAPORAN' },
  { id: 'reports', label: 'Cetak Laporan', group: 'LAPORAN' },
]

const moduleDefinitions = {
  lecturers: {
    eyebrow: 'MASTER DATA',
    title: 'Entry Dosen',
    description: 'Kelola data dosen pengampu mata kuliah.',
    formTitle: 'Form Input Dosen',
    fields: [
      { name: 'nama', label: 'Nama Dosen', placeholder: 'Nama dosen', required: true },
      { name: 'nidn', label: 'NIDN', placeholder: 'Nomor induk dosen', required: true },
      { name: 'jurusan', label: 'Jurusan', placeholder: 'Program studi', required: true },
      { name: 'mata_kuliah', label: 'Mata Kuliah', placeholder: 'Pisahkan beberapa mata kuliah dengan koma', multiple: true },
    ],
    columns: [{ key: 'nama', label: 'NAMA' }, { key: 'nidn', label: 'NIDN' }, { key: 'jurusan', label: 'JURUSAN' }, { key: 'mata_kuliah', label: 'MATA KULIAH' }],
  },
  courses: {
    eyebrow: 'MASTER DATA',
    title: 'Data Mata Kuliah',
    description: 'Atur mata kuliah, SKS, semester, dan kelas yang tersedia.',
    formTitle: 'Form Input Mata Kuliah',
    fields: [
      { name: 'kode_mk', label: 'Kode Mata Kuliah', placeholder: 'MK001', required: true },
      { name: 'nama_mk', label: 'Nama Mata Kuliah', placeholder: 'Contoh: Basis Data', required: true },
      { name: 'sks', label: 'SKS', type: 'number', placeholder: '3', required: true },
      { name: 'semester', label: 'Semester', type: 'number', placeholder: '4', required: true },
      { name: 'kelas', label: 'Kelas / Kelompok', placeholder: 'TI-2A' },
      { name: 'jurusan', label: 'Jurusan', placeholder: 'Teknik Informatika' },
    ],
    columns: [{ key: 'kode_mk', label: 'KODE' }, { key: 'nama_mk', label: 'MATA KULIAH' }, { key: 'sks', label: 'SKS' }, { key: 'semester', label: 'SEMESTER' }, { key: 'kelas', label: 'KELAS' }, { key: 'jurusan', label: 'JURUSAN' }],
  },
  labs: {
    eyebrow: 'MASTER DATA',
    title: 'Data Laboratorium',
    description: 'Atur ruang praktik, kapasitas, dan status laboratorium.',
    formTitle: 'Entry Data Laboratorium',
    fields: [
      { name: 'nama_labor', label: 'Nama Laboratorium', placeholder: 'Contoh: Labor 1', required: true },
      { name: 'kapasitas', label: 'Kapasitas', type: 'number', placeholder: '30', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Tersedia', 'Digunakan', 'Perawatan'] },
      { name: 'keterangan', label: 'Keterangan', placeholder: 'Keterangan ruang' },
    ],
    columns: [{ key: 'nama_labor', label: 'LABORATORIUM' }, { key: 'kapasitas', label: 'KAPASITAS' }, { key: 'status', label: 'STATUS' }, { key: 'keterangan', label: 'KETERANGAN' }],
  },
  software: {
    eyebrow: 'MASTER DATA',
    title: 'Software & Perangkat',
    description: 'Catat perangkat lunak dan fasilitas yang tersedia di laboratorium.',
    formTitle: 'Entry Data Software / Perangkat Lunak',
    fields: [
      { name: 'nama_software', label: 'Nama Software', placeholder: 'Contoh: Visual Studio Code', required: true },
      { name: 'versi', label: 'Versi', placeholder: 'Latest' },
      { name: 'laboratorium', label: 'Laboratorium', placeholder: 'Labor 1' },
      { name: 'keterangan', label: 'Keterangan', placeholder: 'Status perangkat' },
    ],
    columns: [{ key: 'nama_software', label: 'SOFTWARE' }, { key: 'versi', label: 'VERSI' }, { key: 'laboratorium', label: 'LABOR' }, { key: 'keterangan', label: 'KETERANGAN' }],
  },
  replacements: {
    eyebrow: 'OPERASIONAL',
    title: 'Kuliah Pengganti',
    description: 'Catat perubahan jadwal perkuliahan dan status pengajuan.',
    formTitle: 'Form Kuliah Pengganti',
    fields: [
      { name: 'mata_kuliah', label: 'Mata Kuliah', placeholder: 'Nama mata kuliah', required: true },
      { name: 'dosen', label: 'Dosen', placeholder: 'Nama dosen', required: true },
      { name: 'jadwal_lama', label: 'Jadwal Lama', placeholder: 'Hari, tanggal, jam', required: true },
      { name: 'jadwal_baru', label: 'Jadwal Baru', placeholder: 'Hari, tanggal, jam', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Menunggu', 'Disetujui', 'Ditolak'] },
      { name: 'keterangan', label: 'Keterangan', placeholder: 'Catatan perubahan jadwal' },
    ],
    columns: [{ key: 'mata_kuliah', label: 'MATA KULIAH' }, { key: 'dosen', label: 'DOSEN' }, { key: 'jadwal_lama', label: 'JADWAL LAMA' }, { key: 'jadwal_baru', label: 'JADWAL BARU' }, { key: 'status', label: 'STATUS' }, { key: 'keterangan', label: 'KETERANGAN' }],
  },
}

function DashboardHome({ username, onNavigate }) {
  const quickLinks = navigation.filter((item) => item.id !== 'dashboard')

  return (
    <>
      <section className="welcome-banner">
        <div>
          <span className="welcome-label">SELAMAT DATANG</span>
          <h1>Admin Laboratorium</h1>
          <p>Kelola jadwal praktikum, data dosen, laboratorium, software, serta laporan kegiatan laboratorium STT Payakumbuh dengan cepat dan terorganisir.</p>
        </div>
        <span className="welcome-account"><i />Login sebagai {username || 'Admin'}</span>
      </section>

      <section className="quick-menu" aria-labelledby="quick-menu-heading">
        <h2 id="quick-menu-heading">Menu Cepat</h2>
        <div className="quick-menu-grid">
          {quickLinks.map((item, index) => (
            <button className="quick-menu-item" key={item.id} type="button" onClick={() => onNavigate(item.id)}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item.label}</strong>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}

function DataModule({ pageId, search }) {
  const config = moduleDefinitions[pageId]
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [form, setForm] = useState(() => Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))
  const [notice, setNotice] = useState('')
  const visibleRows = rows.filter((row) => Object.values(row).join(' ').toLocaleLowerCase('id').includes(search.trim().toLocaleLowerCase('id')))

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    masterDataApi.list(pageId)
      .then((result) => { if (active) setRows(Array.isArray(result) ? result : []) })
      .catch((error) => { if (active) setLoadError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [pageId])

  async function saveRecord(event) {
    event.preventDefault()
    setSaving(true)
    setNotice('')
    try {
      const payload = Object.fromEntries(config.fields.map((field) => [
        field.name,
        field.multiple
          ? form[field.name].split(',').map((value) => value.trim()).filter(Boolean)
          : form[field.name],
      ]))
      const saved = await masterDataApi.create(pageId, payload)
      setRows((current) => [saved, ...current])
      setForm(Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))
      setNotice('Data berhasil disimpan ke Supabase.')
    } catch (error) {
      setNotice(error.message || 'Data gagal disimpan.')
    } finally {
      setSaving(false)
    }
  }

  async function removeRecord(id) {
    try {
      await masterDataApi.remove(pageId, id)
      setRows((current) => current.filter((row) => row.id !== id))
      setNotice('Data berhasil dihapus dari Supabase.')
    } catch (error) {
      setNotice(error.message || 'Data gagal dihapus.')
    }
  }

  return (
    <>
      <section className="module-heading">
        <div><p className="module-eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p>{config.description}</p></div>
        <button className="button neutral" type="button" onClick={() => setForm(Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))}>Reset Form</button>
      </section>

      <div className="module-stats">
        <div><span>Total Data</span><strong>{rows.length}</strong></div>
        <div><span>Status Data</span><strong>{search ? `${visibleRows.length} cocok` : loading ? 'Memuat...' : 'Supabase'}</strong></div>
        <div><span>Modul</span><strong>{config.eyebrow === 'MASTER DATA' ? 'Master' : 'Operasional'}</strong></div>
      </div>

      <form className="module-form" onSubmit={saveRecord}>
        <div className="module-form-heading"><strong>{config.formTitle}</strong><span>Data tersimpan ke Supabase</span></div>
        <div className="module-fields">
          {config.fields.map((field) => (
            <label className="module-field" key={field.name}>
              <span>{field.label}</span>
              {field.type === 'select' ? (
                <select value={form[field.name]} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })}>
                  {field.options.map((option) => <option key={option}>{option}</option>)}
                </select>
              ) : (
                <input type={field.type || 'text'} value={form[field.name]} placeholder={field.placeholder} required={field.required} onChange={(event) => setForm({ ...form, [field.name]: event.target.value })} />
              )}
            </label>
          ))}
        </div>
        <div className="module-form-actions">
          {notice && <span className="module-save-notice" role="status">{notice}</span>}
          <button className="button gradient" type="submit" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Data'}</button>
        </div>
      </form>

      {loadError && <p className="module-load-error" role="alert">{loadError}</p>}

      <section className="module-table-panel">
        <div className="panel-heading"><strong>Daftar {config.title.replace('Entry ', '')}</strong><span>{visibleRows.length} data</span></div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>AKSI</th></tr></thead>
            <tbody>
              {loading ? <tr><td className="table-empty" colSpan={config.columns.length + 1}>Memuat data dari Supabase...</td></tr> : visibleRows.length ? visibleRows.map((row) => (
                <tr key={row.id}>{config.columns.map((column) => <td key={column.key}>{Array.isArray(row[column.key]) ? row[column.key].join(', ') : row[column.key]}</td>)}<td><button className="row-delete" type="button" onClick={() => removeRecord(row.id)}>Hapus</button></td></tr>
              )) : <tr><td className="table-empty" colSpan={config.columns.length + 1}>{search ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data. Isi form di atas untuk menambahkan data.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

const printReports = {
  schedule: {
    title: 'Jadwal Laboratorium',
    columns: [
      { key: 'hari', label: 'HARI' },
      { key: 'jam', label: 'JAM' },
      { key: 'nama_labor', label: 'LABORATORIUM', fallback: 'kode_labor' },
      { key: 'nama_mk', label: 'MATA KULIAH' },
      { key: 'sks', label: 'SKS' },
      { key: 'nama_dosen', label: 'DOSEN' },
      { key: 'kelas', label: 'KELAS' },
      { key: 'semester', label: 'SEMESTER' },
    ],
  },
  replacements: {
    title: 'Kuliah Pengganti',
    columns: [
      { key: 'mata_kuliah', label: 'MATA KULIAH' },
      { key: 'dosen', label: 'DOSEN' },
      { key: 'jadwal_lama', label: 'JADWAL LAMA' },
      { key: 'jadwal_baru', label: 'JADWAL BARU' },
      { key: 'status', label: 'STATUS' },
      { key: 'keterangan', label: 'KETERANGAN' },
    ],
  },
  rooms: {
    title: 'Rekap Penggunaan Laboratorium',
    columns: [
      { key: 'laboratorium', label: 'LABORATORIUM' },
      { key: 'jumlah_jadwal', label: 'JUMLAH JADWAL' },
    ],
  },
}

function PrintModule({ reports = false }) {
  const [report, setReport] = useState('schedule')
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [notice, setNotice] = useState('')
  const reportId = reports ? report : 'schedule'
  const config = printReports[reportId]

  useEffect(() => {
    let active = true
    setLoading(true)
    setLoadError('')
    setNotice('')

    const loadData = reportId === 'replacements'
      ? masterDataApi.list('replacements')
      : scheduleApi.list()

    loadData
      .then((result) => { if (active) setRows(Array.isArray(result) ? result : []) })
      .catch((error) => { if (active) setLoadError(error.message) })
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [reportId])

  const previewRows = reportId === 'rooms'
    ? Object.values(rows.reduce((rooms, row) => {
      const name = row.nama_labor || row.kode_labor || 'Tidak tercatat'
      rooms[name] = { laboratorium: name, jumlah_jadwal: (rooms[name]?.jumlah_jadwal || 0) + 1 }
      return rooms
    }, {})).sort((first, second) => second.jumlah_jadwal - first.jumlah_jadwal)
    : rows

  function cellValue(row, column) {
    const value = row[column.key] ?? (column.fallback ? row[column.fallback] : undefined)
    if (value === undefined || value === null || value === '') return '-'
    return Array.isArray(value) ? value.join(', ') : value
  }

  async function copyPreview() {
    const content = [
      config.title,
      config.columns.map((column) => column.label).join('\t'),
      ...previewRows.map((row) => config.columns.map((column) => cellValue(row, column)).join('\t')),
    ].join('\n')

    try {
      await navigator.clipboard.writeText(content)
      setNotice('Pratinjau berhasil disalin.')
    } catch {
      setNotice('Clipboard tidak tersedia di browser ini.')
    }
  }

  const printedAt = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <section className="module-heading">
        <div><p className="module-eyebrow">CETAK</p><h1>{reports ? 'Cetak Laporan' : 'Cetak Jadwal'}</h1></div>
      </section>
      <section className="report-card print-controls">
        <p>{reports ? 'Pilih laporan untuk melihat data dari Supabase sebelum dicetak.' : 'Jadwal laboratorium dari Supabase siap dicetak atau disimpan sebagai PDF.'}</p>
        <div className="report-controls">
          {reports && (
            <select value={report} onChange={(event) => setReport(event.target.value)} aria-label="Jenis laporan">
              <option value="schedule">Jadwal Laboratorium</option>
              <option value="replacements">Kuliah Pengganti</option>
              <option value="rooms">Rekap Penggunaan Laboratorium</option>
            </select>
          )}
          <button className="button neutral" type="button" onClick={copyPreview} disabled={loading || Boolean(loadError)}>Salin</button>
          <button className="button gradient" type="button" onClick={() => window.print()} disabled={loading || Boolean(loadError)}>Cetak / PDF</button>
        </div>
      </section>
      {loadError && <p className="module-load-error" role="alert">{loadError}</p>}
      {notice && <p className="module-save-notice" role="status">{notice}</p>}
      <section className="module-table-panel print-preview-panel">
        <header className="print-document-heading">
          <p>SISTEM INFORMASI LABORATORIUM STT PAYAKUMBUH</p>
          <h2>{config.title}</h2>
          <span>Tanggal cetak: {printedAt}</span>
        </header>
        <div className="panel-heading"><strong>{config.title}</strong><span>{loading ? 'Memuat...' : `${previewRows.length} data`}</span></div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead>
            <tbody>
              {loading ? (
                <tr><td className="table-empty" colSpan={config.columns.length}>Memuat data dari Supabase...</td></tr>
              ) : previewRows.length ? previewRows.map((row, index) => (
                <tr key={row.id ?? `${reportId}-${index}`}>
                  {config.columns.map((column) => <td key={column.key}>{cellValue(row, column)}</td>)}
                </tr>
              )) : (
                <tr><td className="table-empty" colSpan={config.columns.length}>Belum ada data untuk laporan ini.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        {reportId === 'schedule' && (
          <footer className="schedule-approval">
            <div className="schedule-approval-signature">
              <p>Payakumbuh, {printedAt}</p>
              <p>Disetujui oleh,<br /><strong>Ketua Laboratorium STT Payakumbuh</strong></p>
              <div className="schedule-approval-space" aria-hidden="true" />
              <strong className="schedule-approval-name">Ramzil Huda, S.Kom., M.Kom</strong>
            </div>
          </footer>
        )}
      </section>
    </>
  )
}

function AdminDashboard({ username = 'admin', role = 'admin', onLogout }) {
  const [activePage, setActivePage] = useState('dashboard')
  const [search, setSearch] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const currentPage = navigation.find((item) => item.id === activePage)

  function navigate(pageId) {
    setActivePage(pageId)
    setSearch('')
    setSidebarOpen(false)
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <a className="admin-brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate('dashboard') }}>
          <img className="admin-brand-mark" src={sttpykLogo} alt="Logo STT Payakumbuh" />
          <span><small>SISTEM INFORMASI</small><strong>Laboratorium STT<br />Payakumbuh</strong></span>
        </a>
        <nav className="admin-nav" aria-label="Navigasi utama">
          {navigation.map((item, index) => (
            <div key={item.id}>
              {(index === 0 || navigation[index - 1].group !== item.group) && <p className="nav-group-label">{item.group}</p>}
              <button className={`nav-item${activePage === item.id ? ' active' : ''}`} type="button" onClick={() => navigate(item.id)}>{item.label}</button>
            </div>
          ))}
        </nav>
        <div className="sidebar-foot"><span className="sidebar-status" />Sistem Penjadwalan</div>
      </aside>

      {sidebarOpen && <button className="sidebar-scrim" aria-label="Tutup menu" type="button" onClick={() => setSidebarOpen(false)} />}

      <div className="admin-main-column">
        <header className="admin-topbar">
          <button className="mobile-menu-button" type="button" onClick={() => setSidebarOpen((open) => !open)} aria-expanded={sidebarOpen}>Menu</button>
          <label className="admin-search"><span aria-hidden="true" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari data..." aria-label="Cari data" /></label>
          <div className="admin-user"><span className="admin-avatar">{(username || 'A').slice(0, 1).toUpperCase()}</span><span><strong>{username}</strong><small>{role === 'admin' ? 'Administrator' : 'Operator'}</small></span></div>
          <button className="logout-button" type="button" onClick={onLogout}>Keluar</button>
        </header>

        <main className={`admin-content${activePage === 'schedules' ? ' contains-schedule' : ''}`}>
          {activePage === 'dashboard' && <DashboardHome username={username} onNavigate={navigate} />}
          {activePage === 'schedules' && <SchedulePage />}
          {moduleDefinitions[activePage] && <DataModule key={activePage} pageId={activePage} search={search} />}
          {activePage === 'printSchedule' && <PrintModule />}
          {activePage === 'reports' && <PrintModule reports />}
          <footer className="admin-footer"><span>SISTEM PENJADWALAN LABORATORIUM</span><span>{currentPage?.label}</span></footer>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard