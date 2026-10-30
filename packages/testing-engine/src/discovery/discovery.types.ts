export interface DiscoveredFormInput {
  name: string;
  type: string;
  placeholder?: string;
  required: boolean;
  value?: string;
  id?: string;
}

export interface DiscoveredForm {
  action: string;
  method: string;
  id?: string;
  inputs: DiscoveredFormInput[];
  submitButtonText?: string;
}

export interface DiscoveredElement {
  tag: string;
  text: string;
  role?: string;
  href?: string;
  selector: string;
}

export interface PageDiscoveryResult {
  url: string;
  title: string;
  links: string[];
  buttons: DiscoveredElement[];
  forms: DiscoveredForm[];
  consoleErrors: string[];
  networkRequests: {
    url: string;
    method: string;
    status: number;
    responseTimeMs: number;
  }[];
  loadMetrics: {
    domContentLoadedMs: number;
    loadTimeMs: number;
  };
}

export interface ApplicationMap {
  targetUrl: string;
  discoveredPages: PageDiscoveryResult[];
  totalPagesDiscovered: number;
  totalFormsDiscovered: number;
  totalButtonsDiscovered: number;
  unreachableLinks: string[];
}
