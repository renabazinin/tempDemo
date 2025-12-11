export enum ScenarioType {
  CODER = 'CODER',
  POET = 'POET'
}

export interface GenerationResult {
  text: string;
  temperatureUsed: number;
  scenario: ScenarioType;
  timestamp: number;
}

export interface ScenarioConfig {
  id: ScenarioType;
  title: string;
  subtitle: string;
  description: string;
  prompt: string;
  buttonLabel: string;
  colorClass: string;
  icon: any; // Using any to avoid importing React in a pure .ts file
}