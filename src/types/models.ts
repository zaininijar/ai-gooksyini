/**
 * TypeScript types for the OpenRouter models API response.
 * Auto-generated from models.json schema, then cleaned up.
 */

// ─── Top-level Model (the one in data[]) ─────────────────────────────
export interface Model {
    slug: string
    hf_slug?: string | null
    updated_at: string
    created_at: string
    hf_updated_at: any
    name: string
    short_name: string
    author: string
    author_display_name: string
    description: string
    model_version_group_id?: string | null
    context_length: number
    input_modalities: string[]
    output_modalities: string[]
    has_text_output: boolean
    group: string
    instruct_type?: string | null
    default_system: any
    default_stops: string[]
    hidden: boolean
    router: any
    warning_message?: string | null
    promotion_message?: string | null
    routing_error_message?: string | null
    permaslug: string
    supports_reasoning: boolean
    reasoning_config?: ReasoningConfig | null
    features: ModelFeatures
    default_parameters: DefaultParameters
    default_order: any[]
    quick_start_example_type?: string | null
    is_trainable_text?: boolean | null
    is_trainable_image: any
    knowledge_cutoff?: string | null
    limit_rpm?: number | null
    limit_rpd?: number | null
    supported_tts_voices: any
    endpoint: Endpoint
}

// ─── Nested Model inside endpoint.model ──────────────────────────────
export interface EndpointModel {
    slug: string
    hf_slug?: string | null
    updated_at: string
    created_at: string
    hf_updated_at: any
    name: string
    short_name: string
    author: string
    author_display_name: string
    description: string
    model_version_group_id?: string | null
    context_length: number
    input_modalities: string[]
    output_modalities: string[]
    has_text_output: boolean
    group: string
    instruct_type?: string | null
    default_system: any
    default_stops: string[]
    hidden: boolean
    router: any
    warning_message?: string | null
    promotion_message?: string | null
    routing_error_message?: string | null
    permaslug: string
    supports_reasoning: boolean
    reasoning_config?: ReasoningConfig | null
    features: ModelFeatures
    default_parameters: DefaultParameters
    default_order: any[]
    quick_start_example_type?: string | null
    is_trainable_text?: boolean | null
    is_trainable_image: any
    knowledge_cutoff?: string | null
    limit_rpm?: number | null
    limit_rpd?: number | null
    supported_tts_voices: any
}

// ─── Shared sub-types ────────────────────────────────────────────────
export interface ReasoningConfig {
    start_token?: string | null
    end_token?: string | null
    system_prompt?: any
    supports_reasoning_max_tokens?: boolean
    default_reasoning_enabled?: boolean
    reasoning_return_mechanism?: string
    is_mandatory_reasoning?: boolean
    supports_reasoning_effort?: boolean
    supported_reasoning_efforts?: string[]
    default_reasoning_effort?: string
}

export interface ModelFeatures {
    reasoning_config?: ReasoningConfig | null
    chat_template_config?: ChatTemplateConfig
}

export interface ChatTemplateConfig {
    should_hoist_and_merge_system_messages?: boolean
}

export interface DefaultParameters {
    temperature?: number | null
    top_p?: number | null
    top_k?: number | null
    frequency_penalty?: any
    presence_penalty?: any
    repetition_penalty?: any
}

// ─── Endpoint ────────────────────────────────────────────────────────
export interface Endpoint {
    id: string
    name: string
    context_length: number
    model: EndpointModel
    model_variant_slug: string
    model_variant_permaslug: string
    adapter_name: string
    provider_name: string
    provider_info: ProviderInfo
    provider_display_name: string
    provider_slug: string
    provider_model_id: string
    quantization: string
    variant: string
    is_free: boolean
    can_abort: boolean
    max_prompt_tokens: any
    max_completion_tokens?: number | null
    max_tokens_per_image: any
    supported_parameters: string[]
    is_byok: boolean
    moderation_required: boolean
    data_policy: DataPolicy
    pricing: Pricing
    display_pricing: DisplayPricing[]
    pricing_json: Record<string, any>
    pricing_version_id: string
    is_hidden: boolean
    is_deranked: boolean
    is_disabled: boolean
    supports_tool_parameters: boolean
    supports_reasoning: boolean
    supports_multipart: boolean
    limit_rpm?: number | null
    limit_rpd?: number | null
    limit_rpm_cf: any
    has_completions: boolean
    has_chat_completions: boolean
    features: EndpointFeatures
    supported_video_parameters?: SupportedVideoParameters | null
    provider_region: any
    deprecation_date?: string | null
    allowed_passthrough_parameters: string[]
}

export interface ProviderInfo {
    name: string
    displayName: string
    slug: string
    baseUrl: string
    dataPolicy: DataPolicy
    hasChatCompletions: boolean
    hasCompletions: boolean
    isAbortable: boolean
    moderationRequired: boolean
    editors: string[]
    owners: string[]
    adapterName: string
    statusPageUrl?: string | null
    byokEnabled: boolean
    icon: { url: string; className?: string }
    sendClientIp: boolean
    pricingStrategy: string
    headquarters?: string
    datacenters?: string[]
}

export interface DataPolicy {
    training: boolean
    trainingOpenRouter: boolean
    retainsPrompts: boolean
    canPublish: boolean
    requiresUserIDs?: boolean
    termsOfServiceURL?: string
    privacyPolicyURL?: string
    retentionDays?: number
}

export interface Pricing {
    prompt: string
    completion: string
    discount: number
    display_pricing: DisplayPricing[]
}

export interface DisplayPricing {
    kind: string
    sku_label: string
    price: string
    displayMultiplier: number
    unitLabel: string
}

export interface EndpointFeatures {
    supports_tool_choice?: SupportsToolChoice
    supports_multipart?: boolean
    disable_free_endpoint_limits?: boolean
    reasoning_return_mechanism?: string
    supports_native_web_search?: boolean
    supports_native_web_fetch?: boolean
    supports_base64_video_input?: boolean
    supports_video_urls?: boolean
    supports_input_audio?: boolean
    is_mandatory_reasoning?: boolean
}

export interface SupportsToolChoice {
    literal_none: boolean
    literal_auto: boolean
    literal_required: boolean
    type_function: boolean
}

export interface SupportedVideoParameters {
    supported_sizes: any
    supported_frame_images: any
    generate_audio: any
    seed: any
}
