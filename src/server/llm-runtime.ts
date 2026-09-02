import {
	createAgentSession,
	ModelRuntime,
	SessionManager,
} from "@earendil-works/pi-coding-agent";

function getProviderId(): string {
	return process.env.CONCIERGE_PROVIDER ?? "zai";
}

function getDefaultModel(): string {
	return process.env.CONCIERGE_MODEL ?? "glm-5-turbo";
}

export async function createLlmRuntime(): Promise<ModelRuntime> {
	const modelRuntime = await ModelRuntime.create();
	const providerId = getProviderId();

	const baseUrl = process.env.ANTHROPIC_BASE_URL;

	if (baseUrl && providerId === "anthropic") {
		modelRuntime.registerProvider(providerId, {
			baseUrl,
			apiKey: process.env.ANTHROPIC_API_KEY,
		});
	}

	return modelRuntime;
}

export async function resolveModel(modelRuntime: ModelRuntime) {
	const providerId = getProviderId();
	const modelId = getDefaultModel();
	const model = modelRuntime.getModel(providerId, modelId);

	if (!model) {
		throw new Error(`Model "${modelId}" not found in provider "${providerId}"`);
	}

	return model;
}

export async function createSession() {
	const modelRuntime = await createLlmRuntime();
	const model = await resolveModel(modelRuntime);

	const { session } = await createAgentSession({
		sessionManager: SessionManager.inMemory(),
		modelRuntime,
		model,
		noTools: "builtin",
		customTools: [],
	});

	return { session, modelRuntime };
}
