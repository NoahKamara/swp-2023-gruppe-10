export type Deployment = 'present' | 'dev' | 'prod'

export interface EnvironmentOptions {
  deployment: Deployment
}

export class Environment implements EnvironmentOptions {
  public deployment: Deployment;

  constructor(
    options: EnvironmentOptions
  ) {
    this.deployment = options.deployment;
  }

  get isPresenting(): boolean {
    return (this.deployment === 'present');
  }
}
