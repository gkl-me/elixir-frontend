import { TRANSACTION_API_ROUTES } from "@/constants/apiRoutes"
import api from "@/lib/api"
import { IListTransactionParams } from "@/types/ITransactionType"





export const transactionService = {
    handleListTransactions: async (params: IListTransactionParams) => {
        return api.get(TRANSACTION_API_ROUTES.GET_ALL_TRANSACTION, {
            params
        })
    }
}