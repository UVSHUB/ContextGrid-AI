import neo4j, { Driver } from 'neo4j-driver';

let driver: Driver | null = null;

export function getNeo4jDriver(): Driver | null {
  if (driver) return driver;

  const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
  const user = process.env.NEO4J_USER || 'neo4j';
  const password = process.env.NEO4J_PASSWORD || 'password';

  try {
    driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
    return driver;
  } catch (err) {
    console.warn('[Neo4j SDK] Failed to connect to Neo4j database:', err);
    return null;
  }
}
