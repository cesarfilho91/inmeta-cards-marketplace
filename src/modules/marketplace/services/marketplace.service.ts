import { api } from "@/api/axios";
import type { TradesResponse } from "../types";

export const MarketplaceService = {
    async getTrades(page = 1, rpp = 10): Promise<TradesResponse> {
        const { data } = await api.get('/trades', {
            params: { page, rpp }
        })

        return data
    }
}