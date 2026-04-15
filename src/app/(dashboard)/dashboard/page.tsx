'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trpc } from '@/lib/trpc'
import {
  Package, Users, ShoppingBag, Plus,
  Pencil, Trash2, X, Check
} from 'lucide-react'
import Image from 'next/image'

const categories = ['Clothing', 'Accessories', 'Footwear', 'Bags']
const badges = ['', 'New', 'Sale', 'Hot', 'Limited']

const emptyForm = {
  name: '',
  description: '',
  price: 0,
  originalPrice: undefined as number | undefined,
  image: '',
  category: 'Clothing',
  badge: '',
  stock: 0,
}

export default function DashboardPage() {
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: stats } = trpc.admin.getStats.useQuery()
  const { data: products = [], refetch } = trpc.admin.getProducts.useQuery()

  const createProduct = trpc.admin.createProduct.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); setForm(emptyForm) },
  })

  const updateProduct = trpc.admin.updateProduct.useMutation({
    onSuccess: () => { refetch(); setShowForm(false); setEditId(null); setForm(emptyForm) },
  })

  const deleteProduct = trpc.admin.deleteProduct.useMutation({
    onSuccess: () => { refetch(); setDeleteId(null) },
  })

  const handleSubmit = () => {
    const data = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      badge: form.badge || undefined,
    }
    if (editId) {
      updateProduct.mutate({ id: editId, ...data })
    } else {
      createProduct.mutate(data)
    }
  }

  const handleEdit = (product: typeof products[0]) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice ?? undefined,
      image: product.image,
      category: product.category,
      badge: product.badge ?? '',
      stock: product.stock,
    })
    setEditId(product.id)
    setShowForm(true)
  }

  const inputClass = "w-full bg-[#0D0D0D] border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-[#D4A853]/50 transition-colors"
  const labelClass = "text-white/30 text-xs tracking-wider uppercase block mb-2"

  return (
    <main className="min-h-screen bg-[#080808] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <p className="text-[#D4A853] text-xs tracking-[0.4em] uppercase mb-2">Admin</p>
            <h1 className="font-serif text-4xl text-white">Dashboard</h1>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { setShowForm(true); setEditId(null); setForm(emptyForm) }}
            className="flex items-center gap-2 bg-[#D4A853] text-black font-semibold tracking-wider uppercase px-6 py-3 rounded-full text-sm"
          >
            <Plus size={16} />
            Add Product
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { label: 'Products', value: stats?.products ?? 0, icon: Package },
            { label: 'Users', value: stats?.users ?? 0, icon: Users },
            { label: 'Orders', value: stats?.orders ?? 0, icon: ShoppingBag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#0D0D0D] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Icon size={16} className="text-[#D4A853]" />
                <span className="text-white/40 text-xs tracking-widest uppercase">{label}</span>
              </div>
              <p className="text-white text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>

        {/* Products Table */}
        <div className="bg-[#0D0D0D] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5">
            <h2 className="text-white font-medium tracking-wider uppercase text-sm">
              All Products ({products.length})
            </h2>
          </div>
          <div className="divide-y divide-white/5">
            {products.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 p-4 hover:bg-white/2 transition-colors"
              >
                <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-[#111]">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{product.name}</p>
                  <p className="text-white/30 text-xs">{product.category} · ${product.price} · Stock: {product.stock}</p>
                </div>
                {product.badge && (
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full bg-[#D4A853]/10 text-[#D4A853]">
                    {product.badge}
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleEdit(product)}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-colors"
                  >
                    <Pencil size={12} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setDeleteId(product.id)}
                    className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-rose-400 hover:border-rose-400/30 transition-colors"
                  >
                    <Trash2 size={12} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(false)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-x-4 top-10 bottom-10 z-[95] max-w-2xl mx-auto bg-[#0A0A0A] border border-white/10 rounded-2xl overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-white font-medium tracking-wider uppercase text-sm">
                    {editId ? 'Edit Product' : 'New Product'}
                  </h2>
                  <button onClick={() => setShowForm(false)} className="text-white/30 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Name</label>
                    <input className={inputClass} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Product name" />
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <textarea className={`${inputClass} h-24 resize-none`} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Product description" />
                  </div>
                  <div>
                    <label className={labelClass}>Image URL</label>
                    <input className={inputClass} value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Price</label>
                      <input type="number" className={inputClass} value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                    </div>
                    <div>
                      <label className={labelClass}>Original Price</label>
                      <input type="number" className={inputClass} value={form.originalPrice ?? ''} onChange={e => setForm({ ...form, originalPrice: e.target.value ? Number(e.target.value) : undefined })} placeholder="Optional" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Category</label>
                      <select className={inputClass} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                        {categories.map(c => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Badge</label>
                      <select className={inputClass} value={form.badge} onChange={e => setForm({ ...form, badge: e.target.value })}>
                        {badges.map(b => <option key={b} value={b} className="bg-[#111]">{b || 'None'}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Stock</label>
                    <input type="number" className={inputClass} value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={createProduct.isPending || updateProduct.isPending}
                  className="mt-8 w-full flex items-center justify-center gap-2 bg-[#D4A853] hover:bg-[#C4943F] disabled:opacity-70 text-black font-semibold tracking-wider uppercase py-4 rounded-xl transition-colors"
                >
                  {createProduct.isPending || updateProduct.isPending ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <Check size={16} />
                      {editId ? 'Update Product' : 'Create Product'}
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[95] bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 w-full max-w-sm text-center"
            >
              <Trash2 size={32} className="text-rose-400 mx-auto mb-4" />
              <h3 className="text-white font-medium mb-2">Delete Product?</h3>
              <p className="text-white/30 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 border border-white/10 text-white/50 py-3 rounded-xl text-sm tracking-wider uppercase hover:border-white/30 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => deleteProduct.mutate({ id: deleteId })}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl text-sm tracking-wider uppercase transition-colors"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}