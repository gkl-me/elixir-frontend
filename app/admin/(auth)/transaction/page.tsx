export const dynamic = "force-dynamic";

import TransactionDataTable from "@/components/transaction/TransactionDataTable";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { transactionService } from "@/services/transaction.service";

export default async function TransactionPage() {

  let data;

  try {

    const res = await transactionService.handleListTransactions({})
    data = res.data.data

  } catch (error) {
    throw new Error(AxiosErrorHandler(error).message)
  }


  return (
    <div className="space-y-6">
      <TransactionDataTable
        intialData={data.transactions}
        intialTotalCount={data.totalCount}
      />
    </div>
  );
}
