CREATE TABLE IF NOT EXISTS request
(
    -- User ID of LLM.Report
    llm_report_user_id String,

    -- Can be openai or anthropic
    provider String,
    -- request id provided by the provider
    provider_id String,
    -- ID of the user passed in through header
    user_id Nullable(String),

    url String,
    method String,
    status Int64,
    cached Bool DEFAULT false,
    streamed Bool DEFAULT false,

    model String,
    prompt_tokens Int64 DEFAULT 0,
    completion_tokens Int32 DEFAULT 0,

    request_headers String,
    request_body String,
    response_headers String,
    response_body String,
    hashed_key String,
    completion String,

    timestamp DateTime DEFAULT now(),
)
ENGINE = MergeTree
PRIMARY KEY (llm_report_user_id, timestamp, model, status);