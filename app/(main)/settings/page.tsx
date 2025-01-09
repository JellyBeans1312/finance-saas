'use client';

import { Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { SettingsCard } from './SettingsCard';
import SettingsPageSkeleton from './loading';

const SettingsPage = () => {
  return (
    <Suspense fallback={<SettingsPageSkeleton />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-screen-2xl mx-auto w-full pb-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SettingsCard />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Suspense>
  );
};

export default SettingsPage;