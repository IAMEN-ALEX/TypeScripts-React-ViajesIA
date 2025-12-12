const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI("AIzaSyA_02U8byAPyXB92hwIGadha965xJgsA8I");
    try {
        // For listing models, we might need to use the model manager if available in the SDK,
        // or just try to get a model. But the error message suggested calling ListModels.
        // In the Node SDK, it's usually via the client. But wait, the SDK simplifies this.
        // Actual listing might not be directly exposed in the high-level `GoogleGenerativeAI` class in all versions
        // without using the underlying API client.
        // Let's try to just instantiate a few common ones and see if they work, 
        // OR deeper inspection: The error says "Call ListModels". 
        // Does the SDK have `listModels`? 
        // Checking documentation memory... standard SDK might not have a top-level `listModels`.
        // Actually, it does via `getGenerativeModel`... no.

        // Let's try to just run a generation with candidates.
        const modelsToCheck = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash-001',
            'gemini-1.0-pro',
            'gemini-1.0-pro-latest',
            'gemini-pro-vision'
        ];

        console.log("Checking models...");
        for (const modelName of modelsToCheck) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hello");
                console.log(`SUCCESS: ${modelName} works.`);
                process.exit(0); // Found one!
            } catch (e) {
                console.log(`FAILED: ${modelName} - ${e.message}`);
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

listModels();
