export const dynamic = "force-dynamic";

import SubscriptionDataTable from "@/components/subscription/SubscriptionDataTable";
import { AxiosErrorHandler } from "@/lib/errorHandler";
import { subscriptionService } from "@/services/subscription.service";

export default async function SubscriptionPage() {

  let data;

  try {

    const res = await subscriptionService.handleListSubscription({})
    data = res.data.data

  } catch (error) {
    throw new Error(AxiosErrorHandler(error).message)
  }

  return (
    <div className="space-y-6">
      <SubscriptionDataTable
        intialData={data.subscriptions}
        intialTotalCount={data.totalCount}
      />
    </div>
  );
}
