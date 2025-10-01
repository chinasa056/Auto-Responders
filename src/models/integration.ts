// src/models/Integration.ts
import { Schema, model, Document } from "mongoose";
import { Provider, Status } from "src/enum/appEnums";
import { IIntegration } from "src/interfaces/integrations";

const IntegrationSchema = new Schema<IIntegration>(
    {
        userId: { type: String, required: false },
        provider: { type: String, enum: Object.values(Provider), required: true },
        apiKey: { type: String, required: true },
        meta: { type: Object, default: {} },
        status: { type: String, enum: Object.values(Status), default: Status.active },
        validatedAt: { type: Date, default: null },
    },
    { timestamps: true }
);

const Integration = model<IIntegration>("Integration", IntegrationSchema);
export default Integration;
