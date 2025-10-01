import { Provider } from "src/enum/appEnums";

export interface IIntegration extends Document {
  userId?: string;
  provider:Provider;
  apiKey: string;
  meta?: Record<string, any>;
  status: "active" | "invalid" | "disabled";
  validatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}