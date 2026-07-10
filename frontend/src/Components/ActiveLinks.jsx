import { BarChart3, Check, ChevronLeft, ChevronRight, Copy, ExternalLink, Filter, Link2, Plus, Search, Upload } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import { GenerateShortUrl } from '../hooks/useLinks.js'
import { useNavigate } from 'react-router'
import Loading from './Loading.jsx'

const ROWS_PER_PAGE_OPTIONS = [8, 10, 25, 50]

// Lightweight "x time ago" formatter so we don't pull in a date library
// just for this. Falls back to "—" if the link has no createdAt yet.
const timeAgo = (date) => {
    if (!date) return '—'
    const diffMs = Date.now() - new Date(date).getTime()
    const minutes = Math.floor(diffMs / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 30) return `${days}d ago`
    const months = Math.floor(days / 30)
    if (months < 12) return `${months}mo ago`
    return `${Math.floor(months / 12)}y ago`
}

const ActiveLinks = ({ ActiveLinks, isLoading }) => {

    const [error, seterror] = useState({})
    const [url, setURL] = useState('')
    const [shortURl, setshortURL] = useState('')
    const [copied, setcopied] = useState(false)

    const [search, setSearch] = useState('')
    const [selected, setSelected] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(8)
    const [page, setPage] = useState(1)

    const navigate = useNavigate()
    const { mutateAsync, isPending, isSuccess } = GenerateShortUrl()

    const handelGeneratelink = async (url) => {
        if (!url) {
            seterror({ message: "Please enter a valid URL starting with https://" })
            return
        }
        try {
            const result = await mutateAsync(url)
            if (result) setshortURL(result)
        } catch (err) {
            seterror(err)
        }
    }

    const handelCopy = (text) => {
        navigator.clipboard.writeText(text ?? shortURl)
        setcopied(true)
        setTimeout(() => setcopied(false), 2000)
    }

    const filteredLinks = useMemo(() => {
        if (!ActiveLinks) return []
        if (!search.trim()) return ActiveLinks
        const q = search.toLowerCase()
        return ActiveLinks.filter(
            (link) =>
                link.short_code?.toLowerCase().includes(q) ||
                link.longURL?.toLowerCase().includes(q)
        )
    }, [ActiveLinks, search])

    const totalPages = Math.max(1, Math.ceil(filteredLinks.length / rowsPerPage))
    const currentPage = Math.min(page, totalPages)
    const paginatedLinks = filteredLinks.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    )

    const allOnPageSelected =
        paginatedLinks.length > 0 && paginatedLinks.every((l) => selected.includes(l.short_code))

    const toggleAllOnPage = () => {
        if (allOnPageSelected) {
            setSelected((prev) => prev.filter((id) => !paginatedLinks.some((l) => l.short_code === id)))
        } else {
            setSelected((prev) => [...new Set([...prev, ...paginatedLinks.map((l) => l.short_code)])])
        }
    }

    const toggleRow = (id) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <div className='h-full flex flex-col w-full rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden'>

            {/* Toolbar */}
            <div className='flex flex-row justify-between gap-3 items-center px-5 py-4 border-b border-slate-100'>
                <div className='flex flex-row items-center gap-2.5'>
                    <h1 className='text-lg font-semibold text-slate-800 tracking-tight'>Active Links</h1>
                    <span className='h-2 w-2 bg-emerald-500 rounded-full animate-pulse' />
                </div>

                <div className='flex flex-row items-center gap-2'>
                    <div className='relative hidden sm:block'>
                        <Search size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                        <input
                            type='text'
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                            placeholder='Search links...'
                            className='w-48 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-slate-300'
                        />
                    </div>

                    <button className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors'>
                        <Filter size={13} />
                        Filter
                    </button>

                    <button className='flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors'>
                        <Upload size={13} />
                        Export
                    </button>

                    <button
                        onClick={() => document.getElementById('my_modal_1').showModal()}
                        className='flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 rounded-lg text-white text-xs font-semibold tracking-wide transition-colors'
                    >
                        <Plus size={18} />
                        {<h1 className='hidden md:block'>Add New Link</h1>}
                    </button>
                </div>

                {/* Create link dialog */}
                <dialog id="my_modal_1" className="modal">
                    <div className="modal-box bg-white rounded-3xl p-10 flex flex-col gap-5">
                        <span className='flex flex-col gap-2'>
                            <h1 className='text-2xl font-semibold text-slate-800'>Create a new link</h1>
                            <p className='text-sm text-slate-500'>Paste a long link and get a short one</p>
                        </span>

                        <div className='flex flex-col w-full gap-2'>
                            <h1 className='text-xs font-medium text-slate-500'>Long URL</h1>
                            <div className='flex flex-col gap-1 w-full'>
                                <span className='flex flex-row gap-2'>
                                    <input
                                        type='url'
                                        onChange={(e) => setURL(e.target.value)}
                                        className='w-full bg-slate-50 border border-slate-200 p-2 rounded-xl text-xs outline-none focus:ring-2 focus:ring-slate-300'
                                    />
                                    <button
                                        onClick={() => handelGeneratelink(url)}
                                        className='px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors'
                                    >
                                        Generate
                                    </button>
                                </span>
                                {error.message && <h1 className='text-xs text-red-600'>{error.message}</h1>}
                            </div>
                        </div>

                        {isPending && <p className='text-center text-sm text-slate-500'>Generating...</p>}

                        {isSuccess && (
                            <div className='flex flex-col gap-4'>
                                <hr className='border-slate-100' />
                                <div className='flex flex-col gap-2'>
                                    <h1 className='text-xs font-medium text-slate-500'>Short URL</h1>
                                    <div className='flex flex-row w-full gap-2'>
                                        <div className='h-9 w-3/4 text-xs items-center flex bg-slate-50 border border-slate-200 rounded-xl px-3 text-slate-700'>
                                            {shortURl}
                                        </div>
                                        <button
                                            onClick={() => handelCopy()}
                                            className='flex items-center gap-1.5 px-3 rounded-xl border border-slate-200 text-xs font-medium hover:bg-slate-50 transition-colors'
                                        >
                                            <Copy size={13} />
                                            {copied ? 'Copied' : 'Copy'}
                                        </button>
                                    </div>
                                </div>

                                {copied && (
                                    <div className='h-9 w-full bg-emerald-50 flex-row flex gap-2 items-center rounded-xl px-3'>
                                        <Check size={15} className='text-emerald-600' />
                                        <h1 className='text-xs text-emerald-700'>Your link is ready to share</h1>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </dialog>
            </div>

            {/* Table */}
            <div className='flex-1 overflow-auto'>
                <table className='w-full text-left border-collapse'>
                    <thead>
                        <tr className='border-b border-slate-100'>
                            <th className='px-5 py-3 w-10'>
                                <input
                                    type='checkbox'
                                    checked={allOnPageSelected}
                                    onChange={toggleAllOnPage}
                                    className='h-3.5 w-3.5 rounded border-slate-300 accent-slate-900'
                                />
                            </th>
                            <th className='px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400'>Link</th>
                            <th className='px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400'>Destination</th>
                            <th className='px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400'>Status</th>
                            <th className='px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400'>Created</th>
                            <th className='px-2 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400'>Clicks</th>
                            <th className='px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-slate-400 text-right'>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedLinks.length === 0 && (
                            <tr>
                                <td colSpan={7} className='px-5 py-10 text-center text-sm text-slate-400'>
                                    No links yet — create your first one above.
                                </td>
                            </tr>
                        )}

                        {paginatedLinks.map((link) => {
                            const isActive = (link.clicks ?? 0) >= 0
                            const shortUrl = `${import.meta.env.VITE_BACKEND_URL}/${link.short_code}`
                            return (
                                <tr key={link.short_code} className='border-b border-slate-50 hover:bg-slate-50/70 transition-colors'>
                                    <td className='px-5 py-3'>
                                        <input
                                            type='checkbox'
                                            checked={selected.includes(link.short_code)}
                                            onChange={() => toggleRow(link.short_code)}
                                            className='h-3.5 w-3.5 rounded border-slate-300 accent-slate-900'
                                        />
                                    </td>

                                    <td className='px-2 py-3'>
                                        <div className='flex items-center gap-2.5'>
                                            <div className='h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0'>
                                                <Link2 size={14} />
                                            </div>
                                            <span className='text-xs font-semibold text-slate-700 truncate max-w-[160px]'>
                                                {shortUrl}
                                            </span>
                                        </div>
                                    </td>

                                    <td className='px-2 py-3'>
                                        <span className='text-xs text-slate-500 truncate max-w-[180px] block'>
                                            {link.longURL?.split('/')[2]}
                                        </span>
                                    </td>

                                    <td className='px-2 py-3'>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium ${isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {isActive ? 'Active' : 'Paused'}
                                        </span>
                                    </td>

                                    <td className='px-2 py-3'>
                                        <span className='text-xs text-slate-500'>{timeAgo(link.created_at)}</span>
                                    </td>

                                    <td className='px-2 py-3'>
                                        <span className='text-xs font-semibold text-slate-700'>{link.clicks ?? 0}</span>
                                    </td>

                                    <td className='px-5 py-3'>
                                        <div className='flex flex-row items-center justify-end gap-3 text-slate-400'>
                                            <Copy
                                                size={14}
                                                onClick={() => handelCopy(shortUrl)}
                                                className='hover:text-slate-700 cursor-pointer'
                                            />
                                            <BarChart3 size={14} className='hover:text-slate-700 cursor-pointer' />
                                            <ExternalLink
                                                size={14}
                                                onClick={() => window.open(link.longURL, '_blank')}
                                                className='hover:text-slate-700 cursor-pointer'
                                            />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination footer */}
            <div className='flex flex-row justify-between items-center px-5 py-3 border-t border-slate-100'>
                <div className='flex items-center gap-2 text-xs text-slate-500'>
                    <span>Show</span>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1) }}
                        className='border border-slate-200 rounded-md px-1.5 py-1 text-xs outline-none'
                    >
                        {ROWS_PER_PAGE_OPTIONS.map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </select>
                    <span>Links per page</span>
                </div>

                <div className='flex items-center gap-1'>
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className='h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50'
                    >
                        <ChevronLeft size={14} />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .slice(0, 5)
                        .map((n) => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                className={`h-7 w-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${n === currentPage ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                {n}
                            </button>
                        ))}

                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className='h-7 w-7 flex items-center justify-center rounded-md border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-slate-50'
                    >
                        <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ActiveLinks