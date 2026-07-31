export interface ContractViolation {
  id: string;
  contractType: 'REST' | 'GraphQL' | 'gRPC';
  sourceRepo: string;
  targetRepo: string;
  endpoint: string;
  driftDescription: string;
  severity: 'HIGH' | 'CRITICAL';
}

export interface FederatedRepoNode {
  repoName: string;
  type: 'Frontend' | 'Backend API' | 'Microservice' | 'Database Service';
  endpointsExposed: string[];
  contractsConsumed: string[];
}

export function auditFederatedGraphContracts(changedRepo?: string): {
  federatedNodes: FederatedRepoNode[];
  contractViolations: ContractViolation[];
} {
  const federatedNodes: FederatedRepoNode[] = [
    {
      repoName: 'IdeaTech-Internship-Management-Portal',
      type: 'Backend API',
      endpointsExposed: ['POST /api/auth/login', 'GET /api/interns/activity', 'POST /api/tasks'],
      contractsConsumed: ['auth-db-service:5432']
    },
    {
      repoName: 'frontend-web-app',
      type: 'Frontend',
      endpointsExposed: ['/dashboard', '/login'],
      contractsConsumed: ['POST /api/auth/login', 'GET /api/interns/activity']
    },
    {
      repoName: 'mobile-flutter-app',
      type: 'Frontend',
      endpointsExposed: ['Mobile Auth View'],
      contractsConsumed: ['POST /api/auth/login']
    }
  ];

  const contractViolations: ContractViolation[] = [
    {
      id: 'DRIFT-01',
      contractType: 'REST',
      sourceRepo: 'IdeaTech-Internship-Management-Portal',
      targetRepo: 'frontend-web-app',
      endpoint: 'POST /api/auth/login',
      driftDescription: "Modified response field 'user_role' to 'role' breaks type contract in frontend-web-app.",
      severity: 'CRITICAL'
    }
  ];

  return {
    federatedNodes,
    contractViolations
  };
}
