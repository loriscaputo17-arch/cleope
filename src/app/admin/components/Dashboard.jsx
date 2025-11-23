'use client'
import { motion } from "framer-motion"

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-3xl font-bold mb-6">Dashboard Overview</h2>
      <p className="text-neutral-400">Quick insights and stats coming soon...</p>
    </motion.div>
  )
}
