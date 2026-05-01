export interface Model {
    slug: string
    hf_slug?: string
    updated_at: string
    created_at: string
    hf_updated_at: any
    name: string
    short_name: string
    author: string
    author_display_name: string
    description: string
    model_version_group_id?: string
    context_length: number
    input_modalities: string[]
    output_modalities: string[]
    has_text_output: boolean
    group: string
    instruct_type?: string
    default_system: any
    default_stops: string[]
    hidden: boolean
    router: any
    warning_message?: string
    promotion_message?: string
    routing_error_message?: string
    permaslug: string
    supports_reasoning: boolean
    reasoning_config?: ReasoningConfig
    features: Features
    default_parameters: DefaultParameters
    default_order: any[]
    quick_start_example_type?: string
    is_trainable_text?: boolean
    is_trainable_image: any
    knowledge_cutoff?: string
    limit_rpm?: number
    limit_rpd?: number
    supported_tts_voices: any
    endpoint: Endpoint
}

export interface ReasoningConfig {
    start_token?: string
    end_token?: string
    system_prompt: any
    supports_reasoning_max_tokens?: boolean
    default_reasoning_enabled?: boolean
    reasoning_return_mechanism?: string
    is_mandatory_reasoning?: boolean
    supports_reasoning_effort?: boolean
    supported_reasoning_efforts?: string[]
    default_reasoning_effort?: string
}

export interface Features {
    reasoning_config?: ReasoningConfig2
    chat_template_config?: ChatTemplateConfig
}

export interface ReasoningConfig2 {
    start_token?: string
    end_token?: string
    system_prompt: any
    supports_reasoning_max_tokens?: boolean
    default_reasoning_enabled?: boolean
    reasoning_return_mechanism?: string
    is_mandatory_reasoning?: boolean
    supports_reasoning_effort?: boolean
    supported_reasoning_efforts?: string[]
    default_reasoning_effort?: string
}

export interface ChatTemplateConfig {
    should_hoist_and_merge_system_messages?: boolean
}

export interface DefaultParameters {
    temperature?: number
    top_p?: number
    top_k?: number
    frequency_penalty: any
    presence_penalty: any
    repetition_penalty: any
}

export interface Endpoint {
    id: string
    name: string
    context_length: number
    model: Model
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
    max_completion_tokens?: number
    max_tokens_per_image: any
    supported_parameters: string[]
    is_byok: boolean
    moderation_required: boolean
    data_policy: DataPolicy2
    pricing: Pricing
    display_pricing: DisplayPricing2[]
    pricing_json: PricingJson
    pricing_version_id: string
    is_hidden: boolean
    is_deranked: boolean
    is_disabled: boolean
    supports_tool_parameters: boolean
    supports_reasoning: boolean
    supports_multipart: boolean
    limit_rpm?: number
    limit_rpd?: number
    limit_rpm_cf: any
    has_completions: boolean
    has_chat_completions: boolean
    features: Features3
    supported_video_parameters?: SupportedVideoParameters
    provider_region: any
    deprecation_date?: string
    allowed_passthrough_parameters: string[]
}

export interface Model {
    slug: string
    hf_slug?: string
    updated_at: string
    created_at: string
    hf_updated_at: any
    name: string
    short_name: string
    author: string
    author_display_name: string
    description: string
    model_version_group_id?: string
    context_length: number
    input_modalities: string[]
    output_modalities: string[]
    has_text_output: boolean
    group: string
    instruct_type?: string
    default_system: any
    default_stops: string[]
    hidden: boolean
    router: any
    warning_message?: string
    promotion_message?: string
    routing_error_message?: string
    permaslug: string
    supports_reasoning: boolean
    reasoning_config?: ReasoningConfig3
    features: Features2
    default_parameters: DefaultParameters2
    default_order: any[]
    quick_start_example_type?: string
    is_trainable_text?: boolean
    is_trainable_image: any
    knowledge_cutoff?: string
    limit_rpm?: number
    limit_rpd?: number
    supported_tts_voices: any
}

export interface ReasoningConfig3 {
    start_token?: string
    end_token?: string
    system_prompt: any
    supports_reasoning_max_tokens?: boolean
    default_reasoning_enabled?: boolean
    reasoning_return_mechanism?: string
    is_mandatory_reasoning?: boolean
    supports_reasoning_effort?: boolean
    supported_reasoning_efforts?: string[]
    default_reasoning_effort?: string
}

export interface Features2 {
    reasoning_config?: ReasoningConfig4
    chat_template_config?: ChatTemplateConfig2
}

export interface ReasoningConfig4 {
    start_token?: string
    end_token?: string
    system_prompt: any
    supports_reasoning_max_tokens?: boolean
    default_reasoning_enabled?: boolean
    reasoning_return_mechanism?: string
    is_mandatory_reasoning?: boolean
    supports_reasoning_effort?: boolean
    supported_reasoning_efforts?: string[]
    default_reasoning_effort?: string
}

export interface ChatTemplateConfig2 {
    should_hoist_and_merge_system_messages?: boolean
}

export interface DefaultParameters2 {
    temperature?: number
    top_p?: number
    top_k?: number
    frequency_penalty: any
    presence_penalty: any
    repetition_penalty: any
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
    statusPageUrl?: string
    byokEnabled: boolean
    icon: Icon
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

export interface Icon {
    url: string
    className?: string
}

export interface DataPolicy2 {
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

export interface DisplayPricing2 {
    kind: string
    sku_label: string
    price: string
    displayMultiplier: number
    unitLabel: string
}

export interface PricingJson {
    "openai:prompt_tokens": any
    "openai:completion_tokens": any
    "openai:cached_prompt_tokens"?: string
    "openai:web_search_calls"?: string
    "openai:audio_input_tokens"?: string
    "openai:audio_output_tokens"?: string
    "gemini:prompt_tokens": any
    "gemini:reasoning_tokens": any
    "gemini:completion_tokens": any
    "gemini:text_input_tokens": any
    "gemini:audio_input_tokens": any
    "gemini:image_input_tokens": any
    "gemini:video_input_tokens": any
    "gemini:informational_cache_write_tokens_count": any
    "google_lyria:song_generation"?: string
}

export interface Features3 {
    supports_tool_choice: SupportsToolChoice
    supports_multipart?: boolean
    disable_free_endpoint_limits?: boolean
    reasoning_return_mechanism?: string
    supports_native_web_search?: boolean
    supports_native_web_fetch?: boolean
    supports_base64_video_input?: boolean
    supports_video_urls?: boolean
    supports_input_audio?: boolean
    supported_parameters?: SupportedParameters
    is_mandatory_reasoning?: boolean
}

export interface SupportsToolChoice {
    literal_none: boolean
    literal_auto: boolean
    literal_required: boolean
    type_function: boolean
}

export interface SupportedParameters {
    response_format?: boolean
    structured_outputs?: boolean
}

export interface SupportedVideoParameters {
    supported_sizes: any
    supported_frame_images: any
    generate_audio: any
    seed: any
}
