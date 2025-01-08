'use client'

import { Suspense } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { DataGrid } from "@/components/summary-charts/DataGrid";
import { DataCharts } from "@/components/summary-charts/DataCharts";
import BankingOverviewSkeleton from './loading';

const BankingOverviewPage = () => {
  return (
    <Suspense fallback={<BankingOverviewSkeleton />}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-screen-3xl mx-auto w-full px-10 pb-10 -mt-24"
      >
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <DataGrid />
            <DataCharts />
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </Suspense>
  );
};

export default BankingOverviewPage;