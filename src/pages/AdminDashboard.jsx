import { useState } from 'react'
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
      { name: 'bidang', label: 'Bidang', placeholder: 'Bidang keahlian', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Aktif', 'Tidak aktif'] },
    ],
    columns: [{ key: 'nama', label: 'NAMA' }, { key: 'nidn', label: 'NIDN' }, { key: 'bidang', label: 'BIDANG' }, { key: 'status', label: 'STATUS' }],
  },
  courses: {
    eyebrow: 'MASTER DATA',
    title: 'Data Mata Kuliah',
    description: 'Atur mata kuliah, SKS, semester, dan kelas yang tersedia.',
    formTitle: 'Form Input Mata Kuliah',
    fields: [
      { name: 'nama', label: 'Nama Mata Kuliah', placeholder: 'Contoh: Basis Data', required: true },
      { name: 'sks', label: 'SKS', type: 'number', placeholder: '3', required: true },
      { name: 'semester', label: 'Semester', type: 'number', placeholder: '4', required: true },
      { name: 'kelas', label: 'Kelas / Kelompok', placeholder: 'TI-2A' },
    ],
    columns: [{ key: 'nama', label: 'MATA KULIAH' }, { key: 'sks', label: 'SKS' }, { key: 'semester', label: 'SEMESTER' }, { key: 'kelas', label: 'KELAS' }],
  },
  labs: {
    eyebrow: 'MASTER DATA',
    title: 'Data Laboratorium',
    description: 'Atur ruang praktik, kapasitas, dan status laboratorium.',
    formTitle: 'Entry Data Laboratorium',
    fields: [
      { name: 'nama', label: 'Nama Laboratorium', placeholder: 'Contoh: Labor 1', required: true },
      { name: 'kapasitas', label: 'Kapasitas', type: 'number', placeholder: '30', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Tersedia', 'Digunakan', 'Perawatan'] },
      { name: 'keterangan', label: 'Keterangan', placeholder: 'Keterangan ruang' },
    ],
    columns: [{ key: 'nama', label: 'LABORATORIUM' }, { key: 'kapasitas', label: 'KAPASITAS' }, { key: 'status', label: 'STATUS' }, { key: 'keterangan', label: 'KETERANGAN' }],
  },
  software: {
    eyebrow: 'MASTER DATA',
    title: 'Software & Perangkat',
    description: 'Catat perangkat lunak dan fasilitas yang tersedia di laboratorium.',
    formTitle: 'Entry Data Software / Perangkat Lunak',
    fields: [
      { name: 'nama', label: 'Nama Software', placeholder: 'Contoh: Visual Studio Code', required: true },
      { name: 'versi', label: 'Versi', placeholder: 'Latest' },
      { name: 'laboratorium', label: 'Laboratorium', placeholder: 'Labor 1' },
      { name: 'keterangan', label: 'Keterangan', placeholder: 'Status perangkat' },
    ],
    columns: [{ key: 'nama', label: 'SOFTWARE' }, { key: 'versi', label: 'VERSI' }, { key: 'laboratorium', label: 'LABOR' }, { key: 'keterangan', label: 'KETERANGAN' }],
  },
  replacements: {
    eyebrow: 'OPERASIONAL',
    title: 'Kuliah Pengganti',
    description: 'Catat perubahan jadwal perkuliahan dan status pengajuan.',
    formTitle: 'Form Kuliah Pengganti',
    fields: [
      { name: 'mataKuliah', label: 'Mata Kuliah', placeholder: 'Nama mata kuliah', required: true },
      { name: 'dosen', label: 'Dosen', placeholder: 'Nama dosen', required: true },
      { name: 'jadwalLama', label: 'Jadwal Lama', placeholder: 'Hari, tanggal, jam', required: true },
      { name: 'jadwalBaru', label: 'Jadwal Baru', placeholder: 'Hari, tanggal, jam', required: true },
      { name: 'status', label: 'Status', type: 'select', options: ['Menunggu', 'Disetujui', 'Ditolak'] },
    ],
    columns: [{ key: 'mataKuliah', label: 'MATA KULIAH' }, { key: 'dosen', label: 'DOSEN' }, { key: 'jadwalLama', label: 'JADWAL LAMA' }, { key: 'jadwalBaru', label: 'JADWAL BARU' }, { key: 'status', label: 'STATUS' }],
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
  const storageKey = `sistem-jadwal-${pageId}`
  const [rows, setRows] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || '[]')
    } catch {
      return []
    }
  })
  const [form, setForm] = useState(() => Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))
  const [notice, setNotice] = useState('')
  const visibleRows = rows.filter((row) => Object.values(row).join(' ').toLocaleLowerCase('id').includes(search.trim().toLocaleLowerCase('id')))

  function saveRecord(event) {
    event.preventDefault()
    const nextRows = [{ ...form, id: `${Date.now()}` }, ...rows]
    setRows(nextRows)
    localStorage.setItem(storageKey, JSON.stringify(nextRows))
    setForm(Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))
    setNotice('Data disimpan pada browser ini.')
    window.setTimeout(() => setNotice(''), 3000)
  }

  function removeRecord(id) {
    const nextRows = rows.filter((row) => row.id !== id)
    setRows(nextRows)
    localStorage.setItem(storageKey, JSON.stringify(nextRows))
  }

  return (
    <>
      <section className="module-heading">
        <div><p className="module-eyebrow">{config.eyebrow}</p><h1>{config.title}</h1><p>{config.description}</p></div>
        <button className="button neutral" type="button" onClick={() => setForm(Object.fromEntries(config.fields.map((field) => [field.name, field.options?.[0] || ''])))}>Reset Form</button>
      </section>

      <div className="module-stats">
        <div><span>Total Data</span><strong>{rows.length}</strong></div>
        <div><span>Status Data</span><strong>{search ? `${visibleRows.length} cocok` : 'Tersimpan lokal'}</strong></div>
        <div><span>Modul</span><strong>{config.eyebrow === 'MASTER DATA' ? 'Master' : 'Operasional'}</strong></div>
      </div>

      <form className="module-form" onSubmit={saveRecord}>
        <div className="module-form-heading"><strong>{config.formTitle}</strong><span>Data tersimpan di browser ini</span></div>
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
          <button className="button gradient" type="submit">Simpan Data</button>
        </div>
      </form>

      <section className="module-table-panel">
        <div className="panel-heading"><strong>Daftar {config.title.replace('Entry ', '')}</strong><span>{visibleRows.length} data</span></div>
        <div className="table-overflow">
          <table className="admin-table">
            <thead><tr>{config.columns.map((column) => <th key={column.key}>{column.label}</th>)}<th>AKSI</th></tr></thead>
            <tbody>
              {visibleRows.length ? visibleRows.map((row) => (
                <tr key={row.id}>{config.columns.map((column) => <td key={column.key}>{row[column.key]}</td>)}<td><button className="row-delete" type="button" onClick={() => removeRecord(row.id)}>Hapus</button></td></tr>
              )) : <tr><td className="table-empty" colSpan={config.columns.length + 1}>{search ? 'Tidak ada data yang cocok dengan pencarian.' : 'Belum ada data. Isi form di atas untuk menambahkan data.'}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function PrintModule({ reports = false }) {
  const title = reports ? 'Cetak Laporan & Pratinjau' : 'Cetak Jadwal'
  const [report, setReport] = useState('Jadwal Laboratorium')
  const reportOptions = ['Jadwal Laboratorium', 'Kuliah Pengganti', 'Rekap Penggunaan Ruang']

  function copyPreview() {
    navigator.clipboard?.writeText(`${report}\nBelum ada data untuk dicetak.`)
  }

  return (
    <>
      <section className="module-heading"><div><p className="module-eyebrow">CETAK</p><h1>{title}</h1></div></section>
      {reports ? (
        <section className="report-card">
          <p>Pilih jenis laporan untuk melihat pratinjau sebelum dicetak.</p>
          <div className="report-controls">
            <select value={report} onChange={(event) => setReport(event.target.value)} aria-label="Jenis laporan">{reportOptions.map((item) => <option key={item}>{item}</option>)}</select>
            <button className="button gradient" type="button" onClick={() => window.print()}>Cetak Laporan</button>
          </div>
        </section>
      ) : (
        <section className="module-table-panel print-panel">
          <div className="print-toolbar">
            <div className="print-actions">
              <button className="button neutral" type="button" onClick={copyPreview}>Copy</button>
              <button className="button neutral" type="button" onClick={() => window.print()}>PDF</button>
              <button className="button gradient" type="button" onClick={() => window.print()}>Print</button>
            </div>
            <span className="print-count">0 data</span>
          </div>
          <div className="panel-heading"><strong>Preview Jadwal</strong><span>Jadwal Laboratorium</span></div>
          <div className="table-overflow"><table className="admin-table"><thead><tr>{['HARI', 'JAM', 'RUANG', 'MATA KULIAH', 'DOSEN', 'KELAS'].map((item) => <th key={item}>{item}</th>)}</tr></thead><tbody><tr><td className="table-empty" colSpan="6">Belum ada data jadwal untuk ditampilkan.</td></tr></tbody></table></div>
        </section>
      )}
    </>
  )
}

function AdminDashboard({ username = 'admin', onLogout }) {
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
          <span className="admin-brand-mark">LP</span>
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
          <div className="admin-user"><span className="admin-avatar">{(username || 'A').slice(0, 1).toUpperCase()}</span><span><strong>{username}</strong><small>Administrator</small></span></div>
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