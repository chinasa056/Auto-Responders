import { Document } from "mongoose";
import { Provider, Status } from "src/enum/appEnums";

export interface IIntegration extends Document {
  userId?: string;
  provider:Provider;
  apiKey: string;
  meta?: Record<string, any>;
  status:Status;
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IntegrationRequest {
    userId?: string;
    provider: Provider;
    apiKey: string;
}