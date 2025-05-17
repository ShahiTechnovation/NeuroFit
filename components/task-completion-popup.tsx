"use client"

import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle } from "lucide-react"

export default function TaskCompletionPopup({ isVisible, xp, onClose }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl p-6 flex flex-col items-center max-w-sm mx-4"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 15 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 8 }}
              className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>

            <motion.h3
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Task Completed!
            </motion.h3>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center"
            >
              <p className="text-gray-600 mb-3">Great job! Keep up the good work.</p>
              <div className="text-2xl font-bold text-purple-600">+{xp} XP</div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
