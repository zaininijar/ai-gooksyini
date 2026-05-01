import { Model } from "./models.types"

const MODELS: Model[] = require("./models.json").data;

const getModels = async () => {
    const models = []
    for (const model of MODELS) {

        const price = model.endpoint.display_pricing.map(p => p.price).filter(p => Number(p) > 0)

        if (price.length > 0) continue

        if (model.endpoint) {
            models.push({
                name: model.name,
                permaslug: model.permaslug,
                pricing: model.endpoint.pricing,
                endpoint: {
                    id: model.endpoint.id,
                    provider_name: model.endpoint.provider_name,
                    provider_model_id: model.endpoint.provider_model_id,
                }
            })
        }
    }
    return models
}

const main = async () => {
    const models = await getModels()
    console.log(models.length)
}

main()